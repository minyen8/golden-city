import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [, navigate] = useLocation();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[oklch(0.20_0.03_50)] border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-amber" />
                <h2 className="font-heading font-bold text-lg text-cream">
                  Your Order
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-amber">
                      ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-cream/60 hover:text-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-amber/50" />
                  </div>
                  <div>
                    <p className="text-cream/60 text-sm">Your cart is empty</p>
                    <p className="text-cream/40 text-xs mt-1">Add items from the menu to get started</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 text-amber text-sm font-medium hover:underline"
                  >
                    Browse Menu →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream truncate">{item.name}</p>
                        <p className="text-xs text-amber mt-0.5">
                          £{item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-cream">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-amber/20 hover:bg-amber/30 flex items-center justify-center text-amber transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[60px]">
                        <p className="text-sm font-bold text-cream">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.name)}
                        className="p-1.5 rounded-lg hover:bg-coral/10 text-cream/30 hover:text-coral transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-cream/60 text-sm">Subtotal</span>
                  <span className="font-heading font-bold text-xl text-amber">
                    £{totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-cream/40">
                  Collection only · Minimum order £8.00
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={totalPrice < 8}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-coral text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
