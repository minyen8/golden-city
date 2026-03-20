/*
  DESIGN: "Night Market" — Footer with warm tones, contact info, and cloud motif divider
*/

import { Link } from "wouter";
import { Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-night-light border-t border-border">
      {/* Decorative wave divider */}
      <div className="absolute -top-px left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 40"
          className="w-full h-8 text-night-light"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-gradient-gold mb-3">
              Golden City
            </h3>
            <p className="text-sm font-serif italic text-muted-foreground mb-4">
              Authentic Chinese Cuisine in Telford
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Serving Trench and the wider Telford community with freshly prepared
              Chinese dishes, made with authentic recipes and the finest ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-amber mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-cream transition-colors">
                Home
              </Link>
              <Link href="/menu" className="text-sm text-muted-foreground hover:text-cream transition-colors">
                Our Menu
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-cream transition-colors">
                Contact & Location
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-amber mb-4">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+441952618615"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-cream transition-colors group"
              >
                <Phone className="w-4 h-4 mt-0.5 text-coral group-hover:text-coral" />
                <span>01952 618615</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-coral shrink-0" />
                <span>Unit 4, The Shops, Teagues Cres,<br />Trench, Telford TF2 6RX</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 text-coral shrink-0" />
                <span>Mon–Thu & Sun: 5 – 10 PM · Fri–Sat: 5 – 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Golden City Chinese Take Away. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Trench, Telford's favourite Chinese takeaway since day one.
          </p>
        </div>
      </div>
    </footer>
  );
}
