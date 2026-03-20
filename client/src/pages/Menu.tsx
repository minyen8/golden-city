/*
  DESIGN: "Night Market" — Menu Page with Add to Cart
*/

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Phone, ChevronRight, Plus, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  popular?: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: "starters",
    title: "Starters",
    items: [
      { name: "Crispy Spring Rolls (4)", price: "£4.20", popular: true },
      { name: "Prawn Crackers", price: "£2.50" },
      { name: "Chicken Satay (4)", price: "£5.50", desc: "Served with peanut sauce" },
      { name: "Sesame Prawn Toast", price: "£5.20" },
      { name: "Crispy Seaweed", price: "£4.00" },
      { name: "Salt & Pepper Chicken Wings", price: "£5.80", popular: true },
      { name: "Spare Ribs in BBQ Sauce", price: "£6.20" },
      { name: "Crispy Wontons (8)", price: "£4.80", desc: "Served with sweet & sour sauce" },
    ],
  },
  {
    id: "chefs-specials",
    title: "Chef's Specials",
    items: [
      { name: "Shredded Chicken in Fruity Sauce", price: "£8.50", popular: true, desc: "Our signature dish — crispy shredded chicken in tangy fruity glaze" },
      { name: "Crispy Shredded Beef", price: "£8.80", popular: true, desc: "Crispy strips of beef in a sweet chilli sauce with peppers" },
      { name: "Salt & Pepper King Prawns", price: "£9.50", desc: "Wok-tossed with chilli, garlic, and spring onion" },
      { name: "Sizzling Fillet Steak", price: "£10.50", desc: "Served on a hot plate with black bean sauce" },
      { name: "Crispy Duck (Half)", price: "£9.80", desc: "Served with pancakes, hoisin sauce, cucumber & spring onion" },
      { name: "Golden City Special Chow Mein", price: "£8.50", desc: "King prawns, chicken, beef & roast pork with noodles" },
    ],
  },
  {
    id: "chicken",
    title: "Chicken Dishes",
    items: [
      { name: "Chicken in Lemon Sauce", price: "£7.50", popular: true },
      { name: "Chicken with Cashew Nuts", price: "£7.50" },
      { name: "Chicken with Black Bean Sauce", price: "£7.50" },
      { name: "Chicken Curry", price: "£7.20" },
      { name: "Sweet & Sour Chicken (Battered)", price: "£7.50", popular: true },
      { name: "Chicken with Mushrooms", price: "£7.20" },
      { name: "Kung Po Chicken", price: "£7.50", desc: "Spicy — with peanuts, chilli & peppers" },
      { name: "Chicken in Oyster Sauce", price: "£7.20" },
    ],
  },
  {
    id: "beef",
    title: "Beef Dishes",
    items: [
      { name: "Beef with Green Peppers & Black Bean", price: "£7.80" },
      { name: "Beef Curry", price: "£7.50" },
      { name: "Beef with Mushrooms", price: "£7.50" },
      { name: "Beef in Oyster Sauce", price: "£7.50" },
      { name: "Sweet & Sour Beef", price: "£7.80" },
      { name: "Beef with Ginger & Spring Onion", price: "£7.80" },
    ],
  },
  {
    id: "rice-noodles",
    title: "Rice & Noodles",
    items: [
      { name: "Egg Fried Rice", price: "£3.80" },
      { name: "Special Fried Rice", price: "£6.50", popular: true, desc: "Chicken, prawns, beef & egg" },
      { name: "Chicken Fried Rice", price: "£5.80" },
      { name: "Yeung Chow Fried Rice", price: "£6.50" },
      { name: "Chicken Chow Mein", price: "£7.00", popular: true },
      { name: "Beef Chow Mein", price: "£7.20" },
      { name: "King Prawn Chow Mein", price: "£7.80" },
      { name: "Singapore Vermicelli", price: "£7.50", desc: "Spicy thin rice noodles" },
      { name: "Boiled Rice", price: "£3.00" },
    ],
  },
  {
    id: "vegetarian",
    title: "Vegetarian",
    items: [
      { name: "Mixed Vegetable Curry", price: "£6.50" },
      { name: "Tofu with Black Bean Sauce", price: "£6.80" },
      { name: "Vegetable Chow Mein", price: "£6.50" },
      { name: "Vegetable Spring Rolls (4)", price: "£3.80" },
      { name: "Stir-Fried Mixed Vegetables", price: "£6.00" },
      { name: "Sweet & Sour Vegetables", price: "£6.50" },
    ],
  },
  {
    id: "set-meals",
    title: "Set Meals for One",
    items: [
      { name: "Set Meal A", price: "£10.50", desc: "Spring roll, sweet & sour chicken, egg fried rice" },
      { name: "Set Meal B", price: "£11.50", desc: "Spare ribs, chicken curry, chips & fried rice" },
      { name: "Set Meal C", price: "£12.50", desc: "Prawn crackers, crispy duck, special fried rice, chicken in lemon sauce" },
    ],
  },
];

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace("£", ""));
}

function AddButton({ name, price }: { name: string; price: string }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.name === name);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(name, parsePrice(price));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAdd}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
        added
          ? "bg-green-500/20 text-green-400"
          : inCart
          ? "bg-amber/20 text-amber hover:bg-amber/30"
          : "bg-white/5 text-cream/60 hover:bg-amber/15 hover:text-amber"
      }`}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Added
          </motion.span>
        ) : (
          <motion.span key="plus" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            {inCart ? `+1 (${inCart.quantity})` : "Add"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("starters");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/menu-hero-dPuhz5SC9TUEBaqyua2vrq.webp"
            alt="Menu dishes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>
        <div className="relative container text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-heading font-semibold uppercase tracking-widest text-amber mb-3 block"
          >
            Explore Our Dishes
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold"
          >
            Our <span className="text-gradient-gold">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-cream/60 mt-3 max-w-md mx-auto"
          >
            Freshly prepared Chinese cuisine from Trench, Telford — from classic favourites to our chef's signature creations.
          </motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide -mx-1 px-1">
              {menuData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-amber text-night font-semibold"
                      : "text-cream/60 hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mt-8">
          <div className="max-w-3xl mx-auto">
            {menuData.map((category) => (
              <section
                key={category.id}
                id={category.id}
                ref={(el) => { sectionRefs.current[category.id] = el; }}
                className="mb-12 scroll-mt-36"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-heading font-bold text-amber mb-1">
                    {category.title}
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-amber to-transparent mb-6" />
                </motion.div>

                <div className="flex flex-col gap-1">
                  {category.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="group flex items-center justify-between gap-4 py-3 px-4 -mx-4 rounded-lg hover:bg-card/80 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-cream group-hover:text-white transition-colors">
                            {item.name}
                          </h3>
                          {item.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-coral/15 text-coral text-[10px] font-bold uppercase tracking-wider">
                              <Star className="w-2.5 h-2.5 fill-coral" />
                              Popular
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-base font-heading font-bold text-amber whitespace-nowrap">
                          {item.price}
                        </span>
                        <AddButton name={item.name} price={item.price} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto mt-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-coral/10 via-amber/5 to-transparent border border-border text-center"
          >
            <h3 className="text-xl font-heading font-bold mb-2">Prefer to Order by Phone?</h3>
            <p className="text-cream/60 text-sm mb-5">
              Call us now and we'll have your food freshly prepared and ready for collection.
            </p>
            <a
              href="tel:+441952618615"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Call 01952 618615
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
