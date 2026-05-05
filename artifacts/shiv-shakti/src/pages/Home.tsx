import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Package,
  Headset,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Send,
  Truck,
  FileText,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";

/* ─── Fade-in on scroll ─── */
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Animated count-up ─── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.floor(v) + suffix;
      },
    });
    return controls.stop;
  }, [isInView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ─── FAQ item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#2A2E37] rounded overflow-hidden">
      <button
        className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-white hover:bg-[#1A1D24] transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#F5A623] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#F5A623] shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-[#2A2E37]">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const navLinks = [
    { label: "Products", id: "products" },
    { label: "About", id: "about" },
    { label: "Industries", id: "industries" },
    { label: "Contact", id: "contact" },
  ];

  const categories = [
    { title: "Cutting Edges", desc: "High-strength steel cutting edges for motor graders", img: "/images/category-cutting-edges.png" },
    { title: "Grader Blades", desc: "Premium grader blades for precision leveling", img: "/images/category-grader-blades.png" },
    { title: "Hydraulic Components", desc: "Cylinders, seals, pumps and fittings", img: "/images/category-hydraulic.png" },
    { title: "Engine Parts", desc: "OEM-grade engine components for all models", img: "/images/category-engine.png" },
    { title: "Transmission Parts", desc: "Gearbox and drivetrain components", img: "/images/category-transmission.png" },
  ];

  const features = [
    { icon: ShieldCheck, title: "OEM Quality", desc: "Parts that meet or exceed original equipment specifications." },
    { icon: Package, title: "3000+ Parts in Stock", desc: "Massive ready-to-ship inventory cuts your downtime." },
    { icon: Clock, title: "Fast Delivery", desc: "Rapid dispatch via a reliable PAN India logistics network." },
    { icon: TrendingUp, title: "Competitive Pricing", desc: "Direct-to-you pricing that respects your bottom line." },
    { icon: CheckCircle2, title: "Bulk Orders Welcome", desc: "Dedicated pricing and handling for large fleet operators." },
    { icon: Headset, title: "Expert Support", desc: "Technical guidance to ensure you get exactly the right part." },
  ];

  const featuredProducts = [
    { name: "Cutting Edge Set — 14 ft", desc: "Full 14ft set. Hardox 400 grade steel. Universal bolt pattern.", img: "/images/category-cutting-edges.png" },
    { name: "Hydraulic Cylinder Seal Kit", desc: "Complete seal kit for blade lift and circle cylinders.", img: "/images/category-hydraulic.png" },
    { name: "Grader Blade — 16 ft", desc: "Curved high-tensile grader blade for smooth surface finishing.", img: "/images/category-grader-blades.png" },
    { name: "Engine Filter Kit", desc: "Air, oil and fuel filters combo pack for major grader models.", img: "/images/category-engine.png" },
    { name: "Transmission Gear Set", desc: "Heavy-duty gearbox components for all-terrain grading.", img: "/images/category-transmission.png" },
  ];

  const industries = [
    { name: "Road Construction", img: "/images/industry-road.png" },
    { name: "Mining", img: "/images/industry-mining.png" },
    { name: "Infrastructure", img: "/images/industry-road.png" },
    { name: "Earthmoving", img: "/images/industry-earthmoving.png" },
  ];

  const stats = [
    { value: 3000, suffix: "+", label: "Parts in Stock" },
    { value: 500, suffix: "+", label: "Clients Served" },
    { value: 10, suffix: "+", label: "Years Experience" },
    { value: 28, suffix: " States", label: "PAN India Delivery" },
  ];

  const testimonials = [
    { text: "Shiv Shakti International has been our go-to supplier for grader parts for over 5 years. Their inventory is unmatched and delivery is always on time.", name: "Rajesh Sharma", company: "R.S. Infrastructure Pvt. Ltd." },
    { text: "We run a fleet of 20 motor graders on our mining project. The quality of their cutting edges and hydraulic components keeps our machines running at peak efficiency.", name: "Anil Kumar Verma", company: "Verma Mining Solutions" },
    { text: "Competitive pricing, genuine OEM parts, and expert support. Whenever I need a part, they have it ready. Highly recommended for bulk buyers.", name: "Priya Nair", company: "Nair Road Builders" },
  ];

  const processSteps = [
    { icon: MessageSquare, step: "01", title: "Enquiry", desc: "Share your requirement via call, WhatsApp or our contact form." },
    { icon: FileText, step: "02", title: "Quote", desc: "Receive a detailed quote within 2 business hours." },
    { icon: ThumbsUp, step: "03", title: "Confirmation", desc: "Approve the quote and confirm your order." },
    { icon: Truck, step: "04", title: "Dispatch", desc: "Parts dispatched same day or next business day." },
  ];

  const faqs = [
    { q: "Are all parts OEM quality?", a: "Yes. We supply a combination of genuine OEM parts and high-quality compatible replacements that meet or exceed original specifications. Every part is quality-checked before dispatch." },
    { q: "What is the typical delivery time?", a: "For in-stock items, we dispatch the same day or next business day. Delivery time across India is typically 2–5 business days depending on your location." },
    { q: "Do you offer bulk discounts?", a: "Absolutely. We have a dedicated bulk pricing structure for fleet operators and contractors. Contact our sales team for a customized quote on volume orders." },
    { q: "Is there a minimum order quantity?", a: "There is no minimum order quantity for standard catalogue items. For custom or specialized parts, a minimum order may apply — our team will inform you at the time of enquiry." },
  ];

  return (
    <div
      className="min-h-screen text-[#F2F2F2] font-sans"
      style={{ background: "#16181D" }}
    >
      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#16181D]/95 backdrop-blur-md border-b border-[#2A2E37] py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xl md:text-2xl font-black tracking-tight text-white uppercase"
            data-testid="link-logo"
          >
            Shiv Shakti <span className="text-[#F5A623]">International</span>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-gray-300 hover:text-[#F5A623] transition-colors uppercase"
                data-testid={`link-nav-${l.id}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#F5A623] text-black px-6 py-2.5 rounded font-black uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all"
              data-testid="button-get-quote-nav"
            >
              Get a Quote
            </button>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0F1014] border-b border-[#2A2E37] flex flex-col p-6 gap-5">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-left text-lg font-semibold text-gray-200 hover:text-[#F5A623] transition-colors uppercase"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 bg-[#F5A623] text-black px-6 py-3 rounded font-black uppercase text-center"
            >
              Get a Quote
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Full-bleed background image with sand/road vibe */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/motor-grader-hero.png"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.45) saturate(1.1)" }}
          />
          {/* Left fade — blends photo into the dark content side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1014] via-[#0F1014]/80 to-transparent" />
          {/* Top fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1014]/60 via-transparent to-[#0F1014]/70" />
          {/* Warm dusty golden overlay for sand vibe */}
          <div className="absolute inset-0 bg-gradient-to-tl from-[#8B5E0A]/20 via-transparent to-transparent" />
        </div>

        {/* Dust / haze particles feel */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#16181D] to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[#F5A623] text-sm font-bold uppercase tracking-widest"
            >
              <span className="w-8 h-0.5 bg-[#F5A623]" />
              Motor Grader Parts Specialist
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Premium Motor Grader{" "}
              <span className="text-[#F5A623]">Spare Parts</span> – 3000+
              Parts Ready for Dispatch
            </h1>

            <p className="text-lg text-gray-300 max-w-xl leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Trusted supplier of OEM-quality grader blades, cutting edges,
              hydraulic and engine components for construction and mining
              companies across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => scrollTo("contact")}
                className="bg-[#F5A623] text-black px-8 py-4 rounded font-black text-base uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_24px_rgba(245,166,35,0.5)] transition-all"
                data-testid="button-request-quote-hero"
              >
                Request Bulk Quote
              </button>
              <button
                onClick={() => scrollTo("products")}
                className="border-2 border-white/30 hover:border-[#F5A623] hover:text-[#F5A623] px-8 py-4 rounded font-bold text-base uppercase tracking-wide transition-all backdrop-blur-sm bg-black/20"
                data-testid="button-browse-categories"
              >
                Browse Categories
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4">
              {["3000+ Parts in Stock", "Fast PAN India Delivery", "Bulk Orders Available"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0" />
                  <span className="text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side is intentionally empty — the grader shows through the bg image */}
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* ─── PRODUCT CATEGORIES ─── */}
      <section id="products" className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="mb-12">
              <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">What We Supply</p>
              <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
                Our Product Categories
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <FadeIn key={cat.title} delay={i * 0.08}>
                <div
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded overflow-hidden group hover:border-[#F5A623]/60 hover:shadow-[0_0_24px_rgba(245,166,35,0.15)] transition-all duration-300 flex flex-col h-full"
                  data-testid={`card-category-${i}`}
                >
                  <div className="h-44 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-white">{cat.title}</h3>
                    <p className="text-sm text-gray-400 mb-5 flex-grow">{cat.desc}</p>
                    <button
                      onClick={() => scrollTo("contact")}
                      className="w-full py-2.5 border border-[#F5A623] text-[#F5A623] rounded font-bold text-sm hover:bg-[#F5A623] hover:text-black transition-colors"
                      data-testid={`button-enquire-category-${i}`}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT US ─── */}
      <section id="about" className="py-24 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn className="flex flex-col gap-6">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest">Our Story</p>
            <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              About Shiv Shakti International
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              With over <strong className="text-white">10+ years</strong> in the heavy machinery sector, Shiv Shakti International has become India's most trusted supplier of motor grader spare parts — serving construction, mining, and infrastructure companies nationwide.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We understand that downtime costs money. That is why we maintain a massive inventory of 3000+ OEM and premium replacement parts. Our expert team ensures you get the exact part you need, dispatched fast. Trusted by <strong className="text-white">500+ clients</strong> across India.
            </p>
            <button
              onClick={() => scrollTo("contact")}
              className="self-start mt-2 border-2 border-[#F5A623] text-[#F5A623] px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-[#F5A623] hover:text-black transition-colors"
              data-testid="button-know-more-about"
            >
              Know More
            </button>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#F5A623]/20 translate-x-4 translate-y-4 rounded-lg" />
              <img
                src="/images/about-warehouse.png"
                alt="Industrial Warehouse"
                className="relative z-10 rounded-lg w-full h-auto object-cover aspect-[4/3] shadow-2xl"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Our Advantages</p>
            <h2 className="text-4xl font-black uppercase text-white">Why Choose Us</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="bg-[#16181D] p-8 border border-[#2A2E37] rounded hover:border-[#F5A623]/50 hover:shadow-[0_0_24px_rgba(245,166,35,0.1)] transition-all group h-full">
                  <f.icon className="w-12 h-12 text-[#F5A623] mb-5 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Top Sellers</p>
            <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              Featured Products
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featuredProducts.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.07}>
                <div
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded overflow-hidden group hover:border-[#F5A623]/60 hover:shadow-[0_0_24px_rgba(245,166,35,0.12)] transition-all duration-300 flex flex-col h-full"
                  data-testid={`card-product-${i}`}
                >
                  <div className="h-44 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-bold mb-2 text-white">{p.name}</h3>
                    <p className="text-sm text-gray-400 mb-5 flex-grow">{p.desc}</p>
                    <button
                      onClick={() => scrollTo("contact")}
                      className="w-full py-2.5 bg-[#F5A623] text-black rounded font-bold text-sm hover:brightness-110 transition-all"
                      data-testid={`button-enquire-product-${i}`}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES WE SERVE ─── */}
      <section id="industries" className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Sectors</p>
            <h2 className="text-4xl font-black uppercase text-white">Industries We Serve</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => (
              <FadeIn key={ind.name} delay={i * 0.1}>
                <div className="relative overflow-hidden rounded group cursor-pointer h-56" data-testid={`card-industry-${i}`}>
                  <img
                    src={ind.img}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-lg font-black text-white uppercase">{ind.name}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F5A623]/60 rounded transition-colors" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 bg-gradient-to-r from-[#F5A623] via-[#e8980f] to-[#F5A623]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-black">
          {stats.map((s) => (
            <FadeIn key={s.label}>
              <div>
                <div className="text-5xl md:text-6xl font-black mb-2">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-base font-bold uppercase tracking-wide opacity-80">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">What Clients Say</p>
            <h2 className="text-4xl font-black uppercase text-white">Testimonials</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="bg-[#1A1D24] border border-[#2A2E37] hover:border-[#F5A623]/40 rounded p-8 flex flex-col gap-6 transition-colors h-full" data-testid={`card-testimonial-${i}`}>
                  <div className="text-[#F5A623] text-4xl leading-none font-serif">"</div>
                  <p className="text-gray-300 leading-relaxed flex-grow italic">"{t.text}"</p>
                  <div className="border-t border-[#2A2E37] pt-5">
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-[#F5A623] mt-1">{t.company}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl font-black uppercase text-white">Our Process</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center p-8 bg-[#16181D] border border-[#2A2E37] rounded hover:border-[#F5A623]/50 transition-colors group" data-testid={`card-process-${i}`}>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center text-black text-xs font-black">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center mb-5 group-hover:bg-[#F5A623]/20 transition-colors">
                    <step.icon className="w-7 h-7 text-[#F5A623]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#F5A623] z-10" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1D24] via-[#16181D] to-[#1A1D24]" />
        <div className="absolute inset-0 border-y border-[#F5A623]/20" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#F5A623]/8 blur-[80px]" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#F5A623]/8 blur-[80px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <FadeIn className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
              Need Motor Grader <span className="text-[#F5A623]">Spare Parts?</span>
            </h2>
            <p className="text-gray-400 text-lg">Get a quote within 2 hours. Fast dispatch across India.</p>
          </FadeIn>
          <FadeIn delay={0.15} className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#F5A623] text-black px-8 py-4 rounded font-black uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_24px_rgba(245,166,35,0.5)] transition-all"
              data-testid="button-get-quote-cta"
            >
              Get Quote
            </button>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 border-2 border-white/20 hover:border-[#F5A623] hover:text-[#F5A623] px-8 py-4 rounded font-bold uppercase tracking-wide transition-all"
              data-testid="button-call-now"
            >
              <Phone className="w-5 h-5" /> Call Now
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded font-bold uppercase tracking-wide hover:brightness-110 transition-all"
              data-testid="button-whatsapp"
            >
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 bg-[#111317]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Common Questions</p>
            <h2 className="text-4xl font-black uppercase text-white">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <FaqItem q={faq.q} a={faq.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-4xl font-black uppercase text-white">Contact Us</h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">Send us an enquiry and our team will respond within 2 business hours.</p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <FadeIn className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                {[
                  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                  { icon: Mail, label: "Email", value: "sales@shivshaktiint.com", href: "mailto:sales@shivshaktiint.com" },
                  { icon: MapPin, label: "Address", value: "Industrial Area, Phase 1, New Delhi – 110020, India", href: "#" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-5 p-6 bg-[#1A1D24] border border-[#2A2E37] rounded hover:border-[#F5A623]/40 transition-colors">
                    <div className="w-12 h-12 rounded bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-[#F5A623]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">{item.label}</div>
                      <a href={item.href} className="text-white font-semibold hover:text-[#F5A623] transition-colors">{item.value}</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded overflow-hidden border border-[#2A2E37] h-60">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923196872!2d77.06889754725783!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1691234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.15}>
              {formSent ? (
                <div className="bg-[#1A1D24] border border-[#F5A623]/40 rounded p-12 flex flex-col items-center justify-center h-full text-center gap-4">
                  <CheckCircle2 className="w-16 h-16 text-[#F5A623]" />
                  <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-gray-400">Our team will contact you within 2 business hours.</p>
                  <button onClick={() => setFormSent(false)} className="mt-4 border border-[#F5A623] text-[#F5A623] px-6 py-2.5 rounded font-bold hover:bg-[#F5A623] hover:text-black transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded p-8 flex flex-col gap-5"
                >
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                    { name: "email", label: "Email Address", type: "email", placeholder: "you@company.com" },
                    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white placeholder-gray-600 transition-colors"
                        data-testid={`input-${field.name}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Message / Requirements</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your parts requirement..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white placeholder-gray-600 transition-colors resize-none"
                      data-testid="input-message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F5A623] text-black py-4 rounded font-black uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all flex items-center justify-center gap-2"
                    data-testid="button-submit-form"
                  >
                    <Send className="w-5 h-5" /> Send Enquiry
                  </button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FLOATING WHATSAPP BUTTON ─── */}
      <a
        href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20motor%20grader%20spare%20parts.%20Please%20share%20more%20details."
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-float"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          className="flex items-center gap-3"
        >
          {/* Tooltip label */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0F1014] text-white text-sm font-semibold px-4 py-2 rounded shadow-lg border border-[#2A2E37] whitespace-nowrap">
            Enquire on WhatsApp
          </span>

          {/* WhatsApp circle button */}
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.5)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300">
            {/* Ping animation */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <FaWhatsapp size={30} className="text-white relative z-10" />
          </div>
        </motion.div>
      </a>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0A0B0E] pt-16 pb-8 border-t border-[#2A2E37]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-xl font-black text-white uppercase mb-5">
              Shiv Shakti <span className="text-[#F5A623]">International</span>
            </div>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              India's premier supplier of premium motor grader spare parts. Keeping your machinery moving since 2014.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaWhatsapp, href: "https://wa.me/919876543210" },
                { icon: FaInstagram, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A1D24] border border-[#2A2E37] flex items-center justify-center text-gray-400 hover:bg-[#F5A623] hover:text-black hover:border-[#F5A623] transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-gray-500 text-sm">
              {[
                { label: "About Us", id: "about" },
                { label: "Products", id: "products" },
                { label: "Industries", id: "industries" },
                { label: "Contact", id: "contact" },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => scrollTo(l.id)} className="hover:text-[#F5A623] transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">Products</h4>
            <ul className="flex flex-col gap-3 text-gray-500 text-sm">
              {["Cutting Edges", "Grader Blades", "Hydraulic Components", "Engine Parts", "Transmission Parts"].map((p) => (
                <li key={p}>
                  <button onClick={() => scrollTo("products")} className="hover:text-[#F5A623] transition-colors text-left">
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">Contact</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Industrial Area, Phase 1, New Delhi – 110020, India</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-[#F5A623] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#F5A623] transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
                <a href="mailto:sales@shivshaktiint.com" className="hover:text-[#F5A623] transition-colors">sales@shivshaktiint.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-[#2A2E37] flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 text-xs">
          <span>&copy; {new Date().getFullYear()} Shiv Shakti International. All rights reserved.</span>
          <span>Designed for the heavy machinery industry of India</span>
        </div>
      </footer>
    </div>
  );
}
