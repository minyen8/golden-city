/*
  DESIGN: "Night Market" — Contact & Location Page
  Embedded Google Map, clickable phone, address, opening hours table
  Dark warm bg, amber/coral accents
*/

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";

const openingHours = [
  { day: "Monday", hours: "5:00 PM – 10:00 PM" },
  { day: "Tuesday", hours: "5:00 PM – 10:00 PM" },
  { day: "Wednesday", hours: "5:00 PM – 10:00 PM" },
  { day: "Thursday", hours: "5:00 PM – 10:00 PM" },
  { day: "Friday", hours: "5:00 PM – 10:30 PM" },
  { day: "Saturday", hours: "5:00 PM – 10:30 PM" },
  { day: "Sunday", hours: "5:00 PM – 10:00 PM" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function Contact() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453176186/7h7aWPVy86wfbPQG7s9KgX/contact-hero-k2S9k7LTQXwoBAZfoRR3Zb.webp"
            alt="Golden City takeaway exterior"
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
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold"
          >
            Find <span className="text-gradient-gold">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-cream/60 mt-3 max-w-md mx-auto"
          >
            Visit us in Trench, Telford or give us a call to place your order for collection.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Phone Card */}
              <motion.a
                href="tel:+441952618615"
                {...fadeInUp}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-coral/40 transition-all duration-300 hover:shadow-lg hover:shadow-coral/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral/15 flex items-center justify-center group-hover:bg-coral/25 transition-colors">
                    <Phone className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Call to Order
                    </p>
                    <p className="text-xl font-heading font-bold text-cream">
                      01952 618615
                    </p>
                  </div>
                </div>
              </motion.a>

              {/* Address Card */}
              <motion.a
                href="https://www.google.com/maps/dir//Unit+4,+The+Shops,+Teagues+Cres,+Telford+TF2+6RX"
                target="_blank"
                rel="noopener noreferrer"
                {...fadeInUp}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-amber/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber/15 flex items-center justify-center group-hover:bg-amber/25 transition-colors shrink-0">
                    <MapPin className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Our Address
                    </p>
                    <p className="text-base font-medium text-cream leading-relaxed">
                      Unit 4, The Shops,<br />
                      Teagues Crescent, Trench,<br />
                      Telford TF2 6RX
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber">
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Opening Hours Card */}
              <motion.div
                {...fadeInUp}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg">
                    Opening Hours
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {openingHours.map((item) => (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
                        item.day === today
                          ? "bg-amber/10 border border-amber/20"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          item.day === today ? "text-amber" : "text-cream/80"
                        }`}
                      >
                        {item.day}
                        {item.day === today && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-coral font-bold">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Map */}
            <motion.div
              {...fadeInUp}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl overflow-hidden border border-border h-[400px] lg:h-full lg:min-h-[500px]">
                <MapView
                  onMapReady={(map) => {
                    const position = { lat: 52.6751, lng: -2.4613 };
                    map.setCenter(position);
                    map.setZoom(16);

                    new google.maps.Marker({
                      position,
                      map,
                      title: "Golden City Chinese Take Away",
                    });
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-amber/5 to-transparent" />
        <div className="container relative">
          <motion.div
            {...fadeInUp}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
              Craving Something <span className="text-gradient-gold">Delicious?</span>
            </h2>
            <p className="text-cream/60 text-sm mb-6">
              Give us a ring and your meal will be freshly prepared and ready for collection in no time.
            </p>
            <a
              href="tel:+441952618615"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-coral text-white font-bold text-lg transition-all duration-200 hover:shadow-xl hover:shadow-coral/30 hover:scale-105 active:scale-95"
            >
              <Phone className="w-5 h-5" />
              01952 618615
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
