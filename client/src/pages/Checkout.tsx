import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Lock,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const MINIMUM_ORDER = 8.0;

// Replace with your real Stripe publishable key (pk_live_... or pk_test_...)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_REPLACE_WITH_YOUR_STRIPE_KEY"
);

type CheckoutStatus = "idle" | "loading" | "success" | "error";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "on-arrival">("stripe");

  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");

  // Stripe refs
  const stripeRef = useRef<Stripe | null>(null);
  const cardElementRef = useRef<StripeCardElement | null>(null);
  const cardMountRef = useRef<HTMLDivElement>(null);

  // Load Stripe and mount Card Element
  useEffect(() => {
    let mounted = true;

    stripePromise.then((stripe) => {
      if (!mounted || !stripe || stripeRef.current) return;
      stripeRef.current = stripe;

      const elements = stripe.elements();
      const card = elements.create("card", {
        style: {
          base: {
            color: "#faf3e8",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "15px",
            "::placeholder": { color: "rgba(250,243,232,0.35)" },
            iconColor: "#e8a838",
          },
          invalid: { color: "#d94f3d", iconColor: "#d94f3d" },
        },
      });
      cardElementRef.current = card;

      if (cardMountRef.current) {
        card.mount(cardMountRef.current);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Redirect if cart empty (unless just completed)
  useEffect(() => {
    if (items.length === 0 && status !== "success") {
      navigate("/menu");
    }
  }, [items, status, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripeRef.current || !cardElementRef.current) {
      setErrorMessage("Payment system not loaded. Please refresh and try again.");
      setStatus("error");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please fill in your name and email.");
      setStatus("error");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      setErrorMessage("Please fill in your delivery address.");
      setStatus("error");
      return;
    }
    if (orderType === "delivery" && !postcode.trim()) {
      setErrorMessage("Please fill in your postcode.");
      setStatus("error");
      return;
    }
    if (totalPrice < MINIMUM_ORDER) {
      setErrorMessage(`Minimum order is £${MINIMUM_ORDER.toFixed(2)}.`);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // If paying on arrival, skip Stripe
      if (paymentMethod === "on-arrival") {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
            name,
            email,
            phone,
            address: orderType === "delivery" ? address : "",
            city: orderType === "delivery" ? city : "",
            postcode: orderType === "delivery" ? postcode : "",
            notes,
            orderType,
            paymentMethod: "on-arrival",
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create order.");

        setOrderRef(data.orderId);
        setStatus("success");
        clearCart();
        return;
      }

      // Otherwise, use Stripe payment
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
          name,
          email,
          phone,
          address: orderType === "delivery" ? address : "",
          city: orderType === "delivery" ? city : "",
          postcode: orderType === "delivery" ? postcode : "",
          notes,
          orderType,
          paymentMethod: "stripe",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment intent.");
      }

      // Confirm the card payment with Stripe
      const result = await stripeRef.current.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElementRef.current,
          billing_details: { name, email },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      // Success
      const ref = result.paymentIntent?.id?.slice(-8).toUpperCase() || "OK";
      setOrderRef(ref);
      setStatus("success");
      clearCart();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-cream mb-3">
              Order Placed!
            </h1>
            <p className="text-cream/60 mb-2">
              Thank you, your order has been received.
              {orderType === "pickup"
                ? " We'll have it ready for collection shortly."
                : " We'll deliver it to your address."}
            </p>
            {paymentMethod === "on-arrival" && (
              <p className="text-coral text-sm font-medium mb-2">
                💳 Payment due on {orderType === "pickup" ? "pickup" : "delivery"}
              </p>
            )}
            {orderRef && (
              <p className="text-cream/50 text-sm mb-1">
                Order ref: <span className="font-mono font-bold text-cream">{orderRef}</span>
              </p>
            )}
            <p className="text-amber text-sm font-medium mb-8">
              A confirmation email will be sent to {email}
            </p>
            <div className="p-4 rounded-xl bg-card border border-border text-sm text-cream/60 mb-4">
              <p className="font-medium text-cream mb-1">Delivery Address</p>
              <p>
                {address}
                <br />
                {city} {postcode}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-sm text-cream/60 mb-8">
              <p className="font-medium text-cream mb-1">
                Golden City Chinese Take Away
              </p>
              <p>Unit 4, The Shops, Teagues Cres, Trench, Telford TF2 6RX</p>
              <p className="mt-1">Tel: 01952 618615</p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber text-night font-semibold hover:scale-105 transition-transform"
            >
              Back to Menu
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container pt-28 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm text-cream/50 hover:text-cream transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Menu
            </Link>
            <h1 className="text-3xl font-heading font-bold">
              <span className="text-gradient-gold">Checkout</span>
            </h1>
            <p className="text-cream/50 text-sm mt-1">
              Golden City, Trench, Telford
            </p>
          </div>

          {/* Minimum order warning */}
          {totalPrice < MINIMUM_ORDER && (
            <div className="mb-6 flex items-start gap-2 p-4 rounded-xl bg-amber/10 border border-amber/30 text-amber text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              Minimum order is £{MINIMUM_ORDER.toFixed(2)}. Please add £
              {(MINIMUM_ORDER - totalPrice).toFixed(2)} more to proceed.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-amber" />
                <h2 className="font-heading font-semibold text-cream">
                  Your Order
                </h2>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-cream/70">
                      {item.name}
                      <span className="text-cream/40 ml-1">
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="text-amber font-medium">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-heading font-semibold text-cream">
                  Total
                </span>
                <span className="font-heading font-bold text-xl text-amber">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Type */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
              <h2 className="font-heading font-semibold text-cream mb-3">
                Order Type
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pickup"
                    checked={orderType === "pickup"}
                    onChange={(e) => {
                      setOrderType(e.target.value as "pickup" | "delivery");
                      setPaymentMethod("stripe");
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-cream">Pickup</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="delivery"
                    checked={orderType === "delivery"}
                    onChange={(e) => {
                      setOrderType(e.target.value as "pickup" | "delivery");
                      setPaymentMethod("stripe");
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-cream">Delivery</span>
                </label>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
              <h2 className="font-heading font-semibold text-cream">
                Your Details
              </h2>

              <div>
                <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07700 900000"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                />
              </div>

              {orderType === "delivery" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required={orderType === "delivery"}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 High Street"
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        required={orderType === "delivery"}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Telford"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        required={orderType === "delivery"}
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="TF2 6RX"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-cream/50 mb-1.5 uppercase tracking-wider">
                  Special Requests
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, spice level, etc."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-amber transition-colors resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            {orderType === "pickup" && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                <h2 className="font-heading font-semibold text-cream mb-3">
                  Payment Method
                </h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value as "stripe" | "on-arrival")}
                      className="w-4 h-4"
                    />
                    <span className="text-cream">Pay with Card (Stripe)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="on-arrival"
                      checked={paymentMethod === "on-arrival"}
                      onChange={(e) => setPaymentMethod(e.target.value as "stripe" | "on-arrival")}
                      className="w-4 h-4"
                    />
                    <span className="text-cream">Pay at Pickup</span>
                  </label>
                </div>
              </div>
            )}
            {orderType === "delivery" && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <h2 className="font-heading font-semibold text-cream mb-3">
                  Payment Method
                </h2>
                <p className="text-cream/70 text-sm">
                  Delivery orders must be paid by card.
                </p>
              </div>
            )}

            {/* Stripe Payment (conditional) */}
            {paymentMethod === "stripe" && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber" />
                  <h2 className="font-heading font-semibold text-cream">
                    Card Details
                  </h2>
                  <span className="ml-auto text-xs text-cream/30">
                    Secured by Stripe
                  </span>
                </div>

                {/* Stripe Card Element mount point */}
                <div
                  ref={cardMountRef}
                  className="px-4 py-3.5 rounded-lg bg-background border border-border min-h-[44px]"
                />

                <p className="text-xs text-cream/30 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Your payment details are encrypted and never stored on our
                  servers.
                </p>
              </div>
            )}

            {/* Error */}
            {status === "error" && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-4 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || totalPrice < MINIMUM_ORDER}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-coral text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {paymentMethod === "stripe"
                    ? "Processing payment…"
                    : "Creating order…"}
                </>
              ) : (
                <>
                  {paymentMethod === "stripe" ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay £{totalPrice.toFixed(2)} securely
                    </>
                  ) : (
                    <>Place Order - Pay on {orderType === "pickup" ? "Pickup" : "Delivery"}</>
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
