/*
  DESIGN: "Night Market" — Warm Neon & Street Food Energy
  Homepage: Hero with food imagery, about section, featured dishes, reviews, CTA
  Dark warm bg, amber/coral accents, photography-forward
*/

import { motion } from "framer-motion";
import { Star, Phone, MapPin, Clock, ChevronRight, Flame } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const featuredDishes = [
  {
    name: "Shredded Chicken in Fruity Sauce",
    desc: "Our signature dish — crispy shredded chicken in a tangy, sweet fruity glaze",
    price: "£8.50",
    badge: "Most Popular",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/featured-dish-J8xifgVcweciujmuwhLevi.webp",
  },
  {
    name: "Chicken Chow Mein",
    desc: "Stir-fried noodles with tender chicken, bean sprouts, and fresh vegetables",
    price: "£7.80",
    badge: "Classic",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/chow-mein_89f30f51.jpg",
  },
  {
    name: "Crispy Spring Rolls",
    desc: "Golden, crispy vegetable spring rolls served with sweet chilli dipping sauce",
    price: "£4.20",
    badge: "Starter",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/spring-rolls_946486a6.jpg",
  },
];

const reviews = [
  {
    text: "Top quality of service and food. We order from here every week and it never disappoints!",
    author: "Sarah M.",
    rating: 5,
  },
  {
    text: "Ordered 2 of the shredded chicken in fruity sauce and a chicken in lemon sauce. Absolutely delicious!",
    author: "James T.",
    rating: 5,
  },
  {
    text: "It tasted amazing, and the price was pretty decent, too. Best Chinese in Trench by far.",
    author: "Emily R.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/hero-bg-Q7uhcnemvoAXjTCSmkXJbN.webp"
            alt="Chinese takeaway feast"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative container pt-24 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 border border-amber/30 mb-6"
            >
              <Flame className="w-3.5 h-3.5 text-amber" />
              <span className="text-xs font-medium text-amber tracking-wide uppercase">
                Trench, Telford's Favourite Chinese Takeaway
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
            >
              Authentic Chinese
              <br />
              <span className="text-gradient-gold">Flavours,</span> Ready
              <br />
              for Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-cream/70 max-w-lg mb-8 leading-relaxed"
            >
              Fresh ingredients, traditional recipes, and a passion for great food.
              Serving Trench and the wider Telford community with love since day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-coral text-white font-semibold text-base transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 hover:scale-105 active:scale-95"
              >
                View Our Menu
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+441952618615"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-cream font-semibold text-base transition-all duration-200 hover:bg-white/15 hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                Call to Order
              </a>
            </motion.div>

            {/* Quick Info Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-10 flex flex-wrap gap-6 text-sm text-cream/50"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber fill-amber" />
                <span className="text-cream/80 font-medium">4.4</span>
                <span>(168 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-coral" />
                <span>Open 5 PM – 10 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coral" />
                <span>Trench, Telford TF2 6RX</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-20 md:py-28 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div {...fadeInUp} className="relative">
              <div className="relative rounded-2xl overflow-hidden glow-amber">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/about-section-bNgFchLAPgPKgeqmrau6pn.webp"
                  alt="Chef cooking in wok with flames"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-coral text-white px-5 py-3 rounded-xl shadow-xl shadow-coral/20">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-white" />
                  <span className="text-2xl font-heading font-bold">4.4</span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">Google Rating</p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-amber mb-3 block">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6 leading-tight">
                Wok-Fired Perfection,
                <br />
                <span className="text-gradient-gold">Every Single Time</span>
              </h2>
              <p className="text-cream/70 leading-relaxed mb-4">
                At Golden City, we believe great Chinese food starts with fresh
                ingredients and time-honoured recipes. Every dish is prepared to
                order in our kitchen, using traditional wok-frying techniques that
                lock in flavour and create that signature smoky taste.
              </p>
              <p className="text-cream/70 leading-relaxed mb-8">
                From our famous Shredded Chicken in Fruity Sauce to classic
                favourites like Sweet & Sour and Chow Mein, we take pride in
                delivering the authentic taste of Chinese cuisine to the
                Trench and Telford community.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-heading font-bold text-amber">168+</p>
                  <p className="text-xs text-muted-foreground mt-1">Google Reviews</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-heading font-bold text-amber">£10–20</p>
                  <p className="text-xs text-muted-foreground mt-1">Per Person</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED DISHES ===== */}
      <section className="py-20 md:py-28 bg-card/50">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-amber mb-3 block">
              From Our Kitchen
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Popular <span className="text-gradient-gold">Dishes</span>
            </h2>
            <p className="text-cream/60 mt-3 max-w-md mx-auto">
              Discover the dishes our customers keep coming back for, freshly prepared and packed with flavour.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDishes.map((dish, i) => (
              <motion.div
                key={dish.name}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 hover:shadow-xl hover:shadow-amber/10 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber/90 text-night text-xs font-bold">
                    {dish.badge}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-heading font-semibold leading-snug">
                      {dish.name}
                    </h3>
                    <span className="text-lg font-heading font-bold text-coral whitespace-nowrap">
                      {dish.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dish.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber/10 border border-amber/30 text-amber font-semibold text-sm transition-all duration-200 hover:bg-amber/20 hover:scale-105"
            >
              View Full Menu
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-amber mb-3 block">
              What Our Customers Say
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Loved by <span className="text-gradient-gold">Trench</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber fill-amber" />
              ))}
              <span className="text-sm text-cream/60 ml-2">
                4.4 out of 5 based on 168 Google reviews
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-amber/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
                <p className="text-cream/80 leading-relaxed mb-4 font-serif italic">
                  "{review.text}"
                </p>
                <p className="text-sm font-semibold text-amber">
                  {review.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-amber/5 to-transparent" />
        <div className="container relative">
          <motion.div
            {...fadeInUp}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Ready to <span className="text-gradient-gold">Order?</span>
            </h2>
            <p className="text-cream/60 mb-8 max-w-md mx-auto">
              Give us a call and we'll have your favourite dishes freshly prepared
              and ready for collection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+441952618615"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-coral text-white font-bold text-lg transition-all duration-200 hover:shadow-xl hover:shadow-coral/30 hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5" />
                01952 618615
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-cream font-semibold transition-all duration-200 hover:bg-white/15"
              >
                <MapPin className="w-4 h-4" />
                Find Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
