import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-side menu prices — the single source of truth for payment amounts.
// These MUST match the prices shown on the frontend menu.
const MENU_PRICES: Record<string, number> = {
  "Crispy Spring Rolls (4)": 4.2,
  "Prawn Crackers": 2.5,
  "Chicken Satay (4)": 5.5,
  "Sesame Prawn Toast": 5.2,
  "Crispy Seaweed": 4.0,
  "Salt & Pepper Chicken Wings": 5.8,
  "Spare Ribs in BBQ Sauce": 6.2,
  "Crispy Wontons (8)": 4.8,
  "Shredded Chicken in Fruity Sauce": 8.5,
  "Crispy Shredded Beef": 8.8,
  "Salt & Pepper King Prawns": 9.5,
  "Sizzling Fillet Steak": 10.5,
  "Crispy Duck (Half)": 9.8,
  "Golden City Special Chow Mein": 8.5,
  "Chicken in Lemon Sauce": 7.5,
  "Chicken with Cashew Nuts": 7.5,
  "Chicken with Black Bean Sauce": 7.5,
  "Chicken Curry": 7.2,
  "Sweet & Sour Chicken (Battered)": 7.5,
  "Chicken with Mushrooms": 7.2,
  "Kung Po Chicken": 7.5,
  "Chicken in Oyster Sauce": 7.2,
  "Beef with Green Peppers & Black Bean": 7.8,
  "Beef Curry": 7.5,
  "Beef with Mushrooms": 7.5,
  "Beef in Oyster Sauce": 7.5,
  "Sweet & Sour Beef": 7.8,
  "Beef with Ginger & Spring Onion": 7.8,
  "Egg Fried Rice": 3.8,
  "Special Fried Rice": 6.5,
  "Chicken Fried Rice": 5.8,
  "Yeung Chow Fried Rice": 6.5,
  "Chicken Chow Mein": 7.0,
  "Beef Chow Mein": 7.2,
  "King Prawn Chow Mein": 7.8,
  "Singapore Vermicelli": 7.5,
  "Boiled Rice": 3.0,
  "Mixed Vegetable Curry": 6.5,
  "Tofu with Black Bean Sauce": 6.8,
  "Vegetable Chow Mein": 6.5,
  "Vegetable Spring Rolls (4)": 3.8,
  "Stir-Fried Mixed Vegetables": 6.0,
  "Sweet & Sour Vegetables": 6.5,
  "Set Meal A": 10.5,
  "Set Meal B": 11.5,
  "Set Meal C": 12.5,
};

const MINIMUM_ORDER = 8.0; // £8.00 minimum

// In-memory order store for pay-on-arrival orders
interface Order {
  orderId: string;
  items: { name: string; quantity: number }[];
  total: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  notes: string;
  orderType: "pickup" | "delivery";
  paymentMethod: "on-arrival";
  createdAt: Date;
}

const orders: Map<string, Order> = new Map();

// Generate unique order ID
function generateOrderId(): string {
  return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 7).toUpperCase();
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Stripe setup — requires STRIPE_SECRET_KEY in .env
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  let stripe: Stripe | null = null;

  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey);
    console.log("Stripe initialised");
  } else {
    console.warn(
      "STRIPE_SECRET_KEY not set — /api/create-payment-intent will return an error. " +
        "Add it to your .env file to enable payments."
    );
  }

  // Create a PaymentIntent from the server-validated cart
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      res.status(500).json({ error: "Stripe is not configured on the server." });
      return;
    }

    const { items, name, email, phone, address, city, postcode, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Cart is empty." });
      return;
    }

    // Validate every item against the server-side price list
    let total = 0;
    for (const item of items) {
      const serverPrice = MENU_PRICES[item.name];
      if (serverPrice === undefined) {
        res.status(400).json({ error: `Unknown menu item: "${item.name}"` });
        return;
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        res.status(400).json({ error: `Invalid quantity for "${item.name}"` });
        return;
      }
      total += serverPrice * qty;
    }

    if (total < MINIMUM_ORDER) {
      res.status(400).json({ error: `Minimum order is £${MINIMUM_ORDER.toFixed(2)}.` });
      return;
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Stripe expects pence
        currency: "gbp",
        metadata: {
          customerName: String(name || ""),
          email: String(email || ""),
          phone: String(phone || ""),
          address: String(address || ""),
          city: String(city || ""),
          postcode: String(postcode || ""),
          notes: String(notes || "").slice(0, 500),
          items: JSON.stringify(
            items.map((i: { name: string; quantity: number }) => ({
              name: i.name,
              qty: i.quantity,
            }))
          ).slice(0, 500),
        },
        receipt_email: email || undefined,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Stripe PaymentIntent error:", err);
      res.status(500).json({ error: "Failed to create payment. Please try again." });
    }
  });

  // Create a pay-on-arrival order (no Stripe payment)
  app.post("/api/create-order", async (req, res) => {
    const { items, name, email, phone, address, city, postcode, notes, orderType } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Cart is empty." });
      return;
    }

    // Validate every item against the server-side price list
    let total = 0;
    for (const item of items) {
      const serverPrice = MENU_PRICES[item.name];
      if (serverPrice === undefined) {
        res.status(400).json({ error: `Unknown menu item: "${item.name}"` });
        return;
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        res.status(400).json({ error: `Invalid quantity for "${item.name}"` });
        return;
      }
      total += serverPrice * qty;
    }

    if (total < MINIMUM_ORDER) {
      res.status(400).json({ error: `Minimum order is £${MINIMUM_ORDER.toFixed(2)}.` });
      return;
    }

    // Generate unique order ID
    const orderId = generateOrderId();

    // Create order record
    const order: Order = {
      orderId,
      items: items.map((i: { name: string; quantity: number }) => ({
        name: i.name,
        qty: i.quantity,
      })) as any,
      total,
      customerName: String(name || ""),
      email: String(email || ""),
      phone: String(phone || ""),
      address: String(address || ""),
      city: String(city || ""),
      postcode: String(postcode || ""),
      notes: String(notes || "").slice(0, 500),
      orderType: orderType as "pickup" | "delivery",
      paymentMethod: "on-arrival",
      createdAt: new Date(),
    };

    // Store order in memory
    orders.set(orderId, order);
    console.log(`Order created: ${orderId} - £${total.toFixed(2)} - ${orderType} - pay on ${orderType}`);

    res.json({ orderId });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
