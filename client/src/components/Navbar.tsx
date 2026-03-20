/*
  DESIGN: "Night Market" — Warm Neon & Street Food Energy
  Navbar: Sticky, dark with warm amber accents. Hamburger on mobile.
  Cart button added.
*/

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-night/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-bold font-heading text-gradient-gold tracking-tight">
              Golden City
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                  location === link.href
                    ? "text-amber"
                    : "text-cream/70 hover:text-cream"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+441952618615"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-coral text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call to Order</span>
            </a>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber/10 hover:bg-amber/20 text-amber transition-all duration-200 hover:scale-105"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <a
              href="tel:+441952618615"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-coral text-white"
              aria-label="Call to order"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-cream/80 hover:text-cream transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-night/98 backdrop-blur-lg border-t border-border"
            >
              <div className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location === link.href
                        ? "bg-amber/10 text-amber"
                        : "text-cream/70 hover:bg-white/5 hover:text-cream"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setIsOpen(false); setCartOpen(true); }}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber/10 text-amber font-semibold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Cart {totalItems > 0 && `(${totalItems})`}
                </button>
                <a
                  href="tel:+441952618615"
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-coral text-white font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Call to Order: 01952 618615
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
