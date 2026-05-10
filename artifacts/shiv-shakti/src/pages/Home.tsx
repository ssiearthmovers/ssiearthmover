import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
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
  Search,
  SlidersHorizontal,
  Wrench,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { brands as allBrands, productCategories } from "@/lib/siteData";

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
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#F5A623] shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#F5A623] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-[#2A2E37]">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Brand / Model data ─── */
const brandsData: Record<string, { models: string[]; color: string }> = {
  CAT: { models: ["120K", "120H", "140H"], color: "#F5A623" },
  MITSUBISHI: { models: ["330 MG"], color: "#e84a3a" },
  KOMATSU: { models: ["GD511"], color: "#e8c13a" },
  CASE: { models: ["845B"], color: "#3a7be8" },
  XCMG: { models: ["165"], color: "#a0a0a0" },
  LEEBOY: { models: ["785", "985"], color: "#3ae8a0" },
  SANY: { models: ["PQ190"], color: "#8a3ae8" },
  SDLG: { models: ["9138", "9190"], color: "#e87a3a" },
  LIUGONG: { models: ["CG414"], color: "#3ab8e8" },
  BEML: { models: ["605"], color: "#e83a8a" },
};
const partTypesList = [
  "Cutting Edges",
  "Grader Blades",
  "Scarifier Teeth",
  "Ripper Tips",
  "End Bits",
  "Corner Bits",
  "Circle Segments",
  "Draw Bar Parts",
  "All Parts",
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    machine: "",
    part: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  /* Find-Your-Part state */
  const [finderTab, setFinderTab] = useState<"browse" | "search">("browse");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [partSearch, setPartSearch] = useState("");
  const [finderResult, setFinderResult] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          machine: formData.machine || null,
          part: formData.part || null,
          message: formData.message || null,
          source: "contact-form",
        }),
      });
    } catch {
      // silently continue — WhatsApp will still open
    }
    const msg = `Hello SSI Earthmovers,%0A%0AName: ${encodeURIComponent(formData.name)}%0APhone: ${encodeURIComponent(formData.phone)}%0AMachine: ${encodeURIComponent(formData.machine || "Not specified")}%0APart Required: ${encodeURIComponent(formData.part || "Not specified")}%0AMessage: ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/919953105738?text=${msg}`, "_blank");
    setFormSent(true);
  };

  const navLinks = [
    { label: "Products", id: "products" },
    { label: "Find My Part", id: "finder" },
    { label: "About", id: "about" },
    { label: "Industries", id: "industries" },
    { label: "Contact", id: "contact" },
  ];

  const categories = [
    {
      title: "Grader Blades",
      desc: "Premium curved & straight grader blades for precision leveling",
      img: "/images/category-grader-blades.png",
      slug: "grader-blades",
      imgClass: "object-contain p-4",
      imgStyle: {
        filter:
          "brightness(1.15) contrast(1.35) saturate(1.8) drop-shadow(0 4px 12px rgba(245,166,35,0.35))",
      },
    },
    {
      title: "Scarifier Teeth & Ripper Tips",
      desc: "Heavy-duty scarifier teeth, ripper tips and shanks for tough terrain",
      img: "/images/category-scarifier-teeth.png",
      slug: "scarifier-teeth",
      imgClass: "object-contain p-5",
      imgStyle: { filter: "brightness(1.1) contrast(1.2) saturate(1.5)" },
    },
    {
      title: "Braking System",
      desc: "Brake shafts, brake drums, brake shoes and braking assembly parts for all motor grader brands",
      img: "/images/braking-system-brake-shaft.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-4",
      imgStyle: { filter: "brightness(1.1) contrast(1.2) saturate(0.85) drop-shadow(0 4px 14px rgba(245,166,35,0.2))" },
    },
    {
      title: "Ball Joints & Tie Rod Ends",
      desc: "Precision ball joints and tie rod ends for steering and suspension systems",
      img: "/images/ball-joint-tie-rod-end.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-5",
      imgStyle: { filter: "brightness(1.05) contrast(1.2) saturate(0.9) drop-shadow(0 4px 12px rgba(245,166,35,0.2))" },
    },
    {
      title: "Sprockets / Worm Gears / Ring Gears",
      desc: "High-strength sprockets, worm gears and ring gears for all motor grader models",
      img: "/images/sprocket-worm-gear.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-4",
      imgStyle: { filter: "brightness(1.1) contrast(1.25) saturate(0.8) drop-shadow(0 4px 14px rgba(245,166,35,0.2))" },
    },
    {
      title: "Hydraulic Cylinders",
      desc: "Centre shift cylinders, lift cylinders & hydraulic components — Part No. 6E1634 and more",
      img: "/images/hydraulic-center-shift-cylinder-6e1634.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-3",
      imgStyle: { filter: "brightness(1.1) contrast(1.25) saturate(1.4) drop-shadow(0 4px 14px rgba(245,166,35,0.25))" },
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "OEM Quality",
      desc: "Parts that meet or exceed original equipment specifications.",
    },
    {
      icon: Package,
      title: "5,000+ Parts in Stock",
      desc: "Massive ready-to-ship inventory cuts your downtime.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      desc: "Rapid dispatch via a reliable PAN India logistics network.",
    },
    {
      icon: TrendingUp,
      title: "Competitive Pricing",
      desc: "Direct-to-you pricing that respects your bottom line.",
    },
    {
      icon: CheckCircle2,
      title: "Bulk Orders Welcome",
      desc: "Dedicated pricing and handling for large fleet operators.",
    },
    {
      icon: Headset,
      title: "Expert Support",
      desc: "Technical guidance to ensure you get exactly the right part.",
    },
  ];

  const featuredProducts = [
    {
      name: "Grader Blade — 16 ft",
      desc: "Curved high-tensile grader blade for smooth and precise surface finishing.",
      img: "/images/category-grader-blades.png",
      slug: "grader-blades",
      imgClass: "object-contain p-4",
      imgStyle: {
        filter:
          "brightness(1.15) contrast(1.35) saturate(1.8) drop-shadow(0 4px 12px rgba(245,166,35,0.35))",
      },
    },
    {
      name: "Scarifier Teeth Set",
      desc: "Heavy-duty replaceable scarifier teeth for hard ground breaking.",
      img: "/images/category-scarifier-teeth.png",
      slug: "scarifier-teeth",
      imgClass: "object-contain p-5",
      imgStyle: { filter: "brightness(1.1) contrast(1.2) saturate(1.5)" },
    },
    {
      name: "Braking System",
      desc: "Brake shafts, brake drums, brake shoes and braking assembly parts for all motor grader brands.",
      img: "/images/braking-system-brake-shaft.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-4",
      imgStyle: { filter: "brightness(1.1) contrast(1.2) saturate(0.85) drop-shadow(0 4px 14px rgba(245,166,35,0.2))" },
    },
    {
      name: "Ball Joints & Tie Rod Ends",
      desc: "Precision steering ball joints and tie rod ends for all grader models.",
      img: "/images/ball-joint-tie-rod-end.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-5",
      imgStyle: { filter: "brightness(1.05) contrast(1.2) saturate(0.9) drop-shadow(0 4px 12px rgba(245,166,35,0.2))" },
    },
    {
      name: "Sprockets / Worm Gears / Ring Gears",
      desc: "High-strength transmission gears and sprockets for all motor grader brands.",
      img: "/images/sprocket-worm-gear.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-4",
      imgStyle: { filter: "brightness(1.1) contrast(1.25) saturate(0.8) drop-shadow(0 4px 14px rgba(245,166,35,0.2))" },
    },
    {
      name: "Centre Shift Cylinder — 6E1634",
      desc: "Hydraulic centre shift cylinders and lift cylinders for CAT, Komatsu, CASE and all major grader brands.",
      img: "/images/hydraulic-center-shift-cylinder-6e1634.png",
      slug: "circle-drawbar-parts",
      imgClass: "object-contain p-3",
      imgStyle: { filter: "brightness(1.1) contrast(1.25) saturate(1.4) drop-shadow(0 4px 14px rgba(245,166,35,0.25))" },
    },
  ];

  const industries = [
    { name: "Road Construction", img: "/images/industry-road.png" },
    { name: "Mining", img: "/images/industry-mining.png" },
    { name: "Infrastructure", img: "/images/industry-road.png" },
    { name: "Earthmoving", img: "/images/industry-earthmoving.png" },
  ];

  const stats = [
    { value: 5000, suffix: "+", label: "Parts in Stock" },
    { value: 500, suffix: "+", label: "Clients Served" },
    { value: 30, suffix: "+", label: "Years Experience" },
    { value: 28, suffix: " States", label: "PAN India Delivery" },
  ];

  const processSteps = [
    {
      icon: MessageSquare,
      step: "01",
      title: "Enquiry",
      desc: "Share your requirement via call, WhatsApp or our contact form.",
    },
    {
      icon: FileText,
      step: "02",
      title: "Quote",
      desc: "Receive a detailed quote within 2 business hours.",
    },
    {
      icon: ThumbsUp,
      step: "03",
      title: "Confirmation",
      desc: "Approve the quote and confirm your order.",
    },
    {
      icon: Truck,
      step: "04",
      title: "Dispatch",
      desc: "Parts dispatched same day or next business day.",
    },
  ];

  const faqs = [
    {
      q: "Are all parts OEM quality?",
      a: "Yes. We supply a combination of genuine OEM parts and high-quality compatible replacements that meet or exceed original specifications. Every part is quality-checked before dispatch.",
    },
    {
      q: "Which motor grader brands do you stock parts for?",
      a: "We stock parts for CAT (120K/H, 140H), KOMATSU (GD511), CASE (845B), XCMG (165), Leeboy (785/985), SANY (PQ190), SDLG (9138/9190), Liugong (CG414), BEML (605), and Mitsubishi (330 MG). Can't find your model? Call us — we likely have it.",
    },
    {
      q: "What is the typical delivery time?",
      a: "For in-stock items, we dispatch the same day or next business day. Delivery time across India is typically 2–5 business days depending on your location.",
    },
    {
      q: "Do you supply cutting edges and grader blades for all sizes?",
      a: "Yes. We carry cutting edges and grader blades in standard sizes (11-hole, 14ft, 16ft) as well as custom lengths for all major motor grader models. Hardox 400 and 500 grade steel available.",
    },
    {
      q: "Do you offer bulk discounts?",
      a: "Absolutely. We have a dedicated bulk pricing structure for fleet operators and contractors. Contact our sales team for a customized quote on volume orders.",
    },
    {
      q: "Can I get a part by sharing a part number?",
      a: "Yes — that's the fastest way. Share the OEM part number via WhatsApp or call and we'll confirm availability and pricing within 2 hours. You can also use our Part Number Search tool on this website.",
    },
    {
      q: "Is there a minimum order quantity?",
      a: "There is no minimum order quantity for standard catalogue items. For custom or specialized parts, a minimum order may apply — our team will inform you at the time of enquiry.",
    },
    {
      q: "Do you have a physical store I can visit?",
      a: "Yes. Our branch office is at Nicholson Road, Near Mori Gate, New Delhi – 110006. We also have a head office in Rohini and a workshop in Sonipat. Visit us Monday to Saturday, 9:30 AM – 6:30 PM.",
    },
  ];

  return (
    <div
      className="min-h-screen text-[#F2F2F2] font-sans"
      style={{ background: "#16181D" }}
    >
      {/* ─── ANNOUNCEMENT TICKER ─── */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-[#F5A623] text-black text-xs font-bold overflow-hidden h-9 flex items-center">
        <div className="animate-ticker whitespace-nowrap select-none">
          {[1, 2].map((n) => (
            <span key={n} className="inline-flex items-center gap-8 px-8">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 5,000+ Parts
                Ready for Same-Day Dispatch
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" /> Call: +91-9953105738
                &nbsp;|&nbsp; 011-49324607
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 shrink-0" /> PAN India Delivery —
                All 28 States
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 shrink-0" /> Bulk Orders Welcome
                — Special Pricing Available
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> OEM Quality
                Guaranteed on Every Part
              </span>
              <span className="opacity-40">|</span>
            </span>
          ))}
        </div>
      </div>
      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-9 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0F1014]/97 backdrop-blur-md border-b border-[#2A2E37] py-3"
            : "bg-[#0F1014]/60 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-lg md:text-xl font-black tracking-tight text-white uppercase shrink-0"
            data-testid="link-logo"
          >
            Shiv Shakti <span className="text-[#F5A623]">International</span>
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold tracking-wide">
            {/* Products dropdown */}
            <div className="relative group">
              <button
                onClick={() => scrollTo("products")}
                className="flex items-center gap-1 px-3 py-2 rounded text-gray-300 hover:text-[#F5A623] transition-colors uppercase"
                data-testid="link-nav-products"
              >
                Products <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0F1014] border border-[#2A2E37] rounded-lg shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                {productCategories.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#1A1D24] transition-colors"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
            {/* Brands dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded text-gray-300 hover:text-[#F5A623] transition-colors uppercase">
                Brands <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#0F1014] border border-[#2A2E37] rounded-lg shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                {allBrands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#1A1D24] transition-colors"
                  >
                    {b.fullName}
                  </Link>
                ))}
              </div>
            </div>
            {navLinks
              .filter((l) => l.id !== "products")
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="px-3 py-2 rounded text-gray-300 hover:text-[#F5A623] transition-colors uppercase"
                  data-testid={`link-nav-${l.id}`}
                >
                  {l.label}
                </button>
              ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919953105738"
              className="flex items-center gap-2 text-sm font-bold text-gray-200 hover:text-[#F5A623] transition-colors border border-white/10 hover:border-[#F5A623]/40 px-4 py-2 rounded"
              data-testid="link-phone-nav"
            >
              <Phone className="w-4 h-4 text-[#F5A623]" />
              +91-9953105738
            </a>
            <a
              href="/ssi-catalogue.pdf"
              download="SSI-Earthmovers-Catalogue.pdf"
              className="hidden lg:flex items-center gap-1.5 border border-[#F5A623]/50 text-[#F5A623] px-4 py-2.5 rounded font-bold uppercase tracking-wide hover:bg-[#F5A623] hover:text-black transition-all text-sm"
              data-testid="button-download-catalogue-nav"
            >
              <Download className="w-4 h-4" /> Catalogue
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#F5A623] text-black px-5 py-2.5 rounded font-black uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all text-sm"
              data-testid="button-get-quote-nav"
            >
              Get a Quote
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0F1014] border-b border-[#2A2E37] flex flex-col p-6 gap-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-left text-base font-semibold text-gray-200 hover:text-[#F5A623] transition-colors uppercase py-2.5 border-b border-[#1A1D24]"
              >
                {l.label}
              </button>
            ))}
            <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mt-4 mb-1">
              Products
            </p>
            {productCategories.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="block py-2 text-sm text-gray-300 hover:text-[#F5A623] border-b border-[#1A1D24]"
              >
                {p.name}
              </Link>
            ))}
            <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mt-4 mb-1">
              Brands
            </p>
            {allBrands.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="block py-2 text-sm text-gray-300 hover:text-[#F5A623] border-b border-[#1A1D24]"
              >
                {b.fullName}
              </Link>
            ))}
            <a
              href="tel:+919953105738"
              className="flex items-center gap-2 text-[#F5A623] font-bold text-base mt-4"
            >
              <Phone className="w-5 h-5" /> +91-9953105738
            </a>
            <a
              href="/ssi-catalogue.pdf"
              download="SSI-Earthmovers-Catalogue.pdf"
              className="flex items-center gap-2 border border-[#F5A623] text-[#F5A623] px-6 py-3 rounded font-bold uppercase mt-2"
            >
              <Download className="w-5 h-5" /> Download Catalogue
            </a>
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
      <section className="relative min-h-screen flex items-center pt-44 pb-16 overflow-hidden">
        {/* Full-bleed background image with sand/road vibe */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/motor-grader-hero.png"
            alt="Motor grader operating on road construction site — SSI Earthmovers supplies OEM spare parts for all major motor grader brands across India"
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
              <span className="text-[#F5A623]">Spare Parts</span> – 5,000+ Parts
              Ready for Dispatch
            </h1>

            <p className="text-lg text-gray-300 max-w-xl leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Trusted supplier of OEM-quality cutting edges, grader blades,
              scarifier teeth, end bits and circle parts for construction and
              mining companies across India.
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
              <a
                href="/ssi-catalogue.pdf"
                download="SSI-Earthmovers-Catalogue.pdf"
                className="flex items-center gap-2 border-2 border-[#F5A623]/60 text-[#F5A623] hover:bg-[#F5A623] hover:text-black px-8 py-4 rounded font-bold text-base uppercase tracking-wide transition-all"
                data-testid="button-download-catalogue-hero"
              >
                <Download className="w-5 h-5" /> Download Catalogue
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4">
              {[
                "5,000+ Parts in Stock",
                "Fast PAN India Delivery",
                "Bulk Orders Available",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-gray-200 font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0" />
                  <span className="text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side is intentionally empty — the grader shows through the bg image */}
          <div className="hidden lg:block" />
        </div>
      </section>
      {/* ─── COMPATIBLE BRANDS ─── */}
      <section className="py-10 bg-[#0F1014] border-y border-[#2A2E37]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest shrink-0 text-center md:text-left">
              Compatible With
            </p>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-12 animate-ticker">
                {[
                  "CAT",
                  "MITSUBISHI",
                  "KOMATSU",
                  "CASE",
                  "XCMG",
                  "LEEBOY",
                  "SANY",
                  "SDLG",
                  "LIUGONG",
                  "BEML",
                  "CAT",
                  "MITSUBISHI",
                  "KOMATSU",
                  "CASE",
                  "XCMG",
                  "LEEBOY",
                  "SANY",
                  "SDLG",
                  "LIUGONG",
                  "BEML",
                ].map((brand, i) => (
                  <span
                    key={i}
                    className="text-gray-400 font-black text-sm md:text-base tracking-widest uppercase whitespace-nowrap hover:text-[#F5A623] transition-colors cursor-default"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── FIND YOUR PART ─── */}
      <section id="finder" className="py-20 bg-[#16181D]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-10">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Smart Part Finder
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Find Parts for Your Machine
            </h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              Select your grader brand and model, or search by part number —
              we'll match you instantly.
            </p>
          </FadeIn>

          {/* Tab switcher */}
          <div className="flex rounded overflow-hidden border border-[#2A2E37] w-fit mx-auto mb-10">
            <button
              onClick={() => {
                setFinderTab("browse");
                setFinderResult(false);
              }}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all ${finderTab === "browse" ? "bg-[#F5A623] text-black" : "bg-[#1A1D24] text-gray-400 hover:text-white"}`}
              data-testid="tab-browse"
            >
              <SlidersHorizontal className="w-4 h-4" /> Browse by Machine
            </button>
            <button
              onClick={() => {
                setFinderTab("search");
                setFinderResult(false);
              }}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all ${finderTab === "search" ? "bg-[#F5A623] text-black" : "bg-[#1A1D24] text-gray-400 hover:text-white"}`}
              data-testid="tab-search"
            >
              <Search className="w-4 h-4" /> Search by Part No.
            </button>
          </div>

          {finderTab === "browse" ? (
            <div className="flex flex-col gap-8">
              {/* Step 1 — Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#F5A623] text-black text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="font-bold text-white uppercase tracking-wide text-sm">
                    Select Machine Brand
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(brandsData).map(([brand]) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setSelectedModel("");
                        setSelectedPart("");
                        setFinderResult(false);
                      }}
                      className={`py-4 px-3 rounded border-2 font-black text-sm uppercase tracking-wide transition-all ${
                        selectedBrand === brand
                          ? "border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623]"
                          : "border-[#2A2E37] bg-[#1A1D24] text-gray-300 hover:border-[#F5A623]/40 hover:text-white"
                      }`}
                      data-testid={`brand-${brand}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Model */}
              {selectedBrand && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-[#F5A623] text-black text-xs font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <p className="font-bold text-white uppercase tracking-wide text-sm">
                      Select Model — {selectedBrand}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brandsData[selectedBrand].models.map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setSelectedPart("");
                          setFinderResult(false);
                        }}
                        className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                          selectedModel === model
                            ? "border-[#F5A623] bg-[#F5A623] text-black"
                            : "border-[#2A2E37] bg-[#1A1D24] text-gray-300 hover:border-[#F5A623]/50"
                        }`}
                        data-testid={`model-${model}`}
                      >
                        {selectedBrand} {model}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Part Type */}
              {selectedModel && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-[#F5A623] text-black text-xs font-black flex items-center justify-center shrink-0">
                      3
                    </span>
                    <p className="font-bold text-white uppercase tracking-wide text-sm">
                      Select Part Type
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partTypesList.map((part) => (
                      <button
                        key={part}
                        onClick={() => {
                          setSelectedPart(part);
                          setFinderResult(true);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-bold transition-all ${
                          selectedPart === part
                            ? "border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623]"
                            : "border-[#2A2E37] bg-[#1A1D24] text-gray-300 hover:border-[#F5A623]/50"
                        }`}
                        data-testid={`part-${part}`}
                      >
                        <Wrench className="w-3.5 h-3.5" /> {part}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Result CTA */}
              {finderResult &&
                selectedBrand &&
                selectedModel &&
                selectedPart && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-r from-[#1A1D24] to-[#1E2128] border-2 border-[#F5A623]/50 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[#F5A623] font-black text-lg mb-1">
                        <CheckCircle2 className="w-5 h-5" /> Match Found!
                      </div>
                      <p className="text-white font-semibold">
                        <span className="text-[#F5A623]">{selectedPart}</span>{" "}
                        for{" "}
                        <span className="text-[#F5A623]">
                          {selectedBrand} {selectedModel}
                        </span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Send us this requirement and we'll confirm availability
                        within 2 hours.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <a
                        href={`https://wa.me/919953105738?text=Hello%2C%20I%20need%20${encodeURIComponent(selectedPart)}%20for%20${encodeURIComponent(selectedBrand + " " + selectedModel)}.%20Please%20share%20availability%20and%20pricing.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded font-bold text-sm hover:brightness-110 transition-all"
                        data-testid="button-finder-whatsapp"
                      >
                        <FaWhatsapp size={18} /> WhatsApp Enquiry
                      </a>
                      <button
                        onClick={() => scrollTo("contact")}
                        className="flex items-center gap-2 bg-[#F5A623] text-black px-5 py-3 rounded font-bold text-sm hover:brightness-110 transition-all"
                        data-testid="button-finder-enquiry"
                      >
                        <Send className="w-4 h-4" /> Get Quote
                      </button>
                    </div>
                  </motion.div>
                )}
            </div>
          ) : (
            /* Part Number Search Tab */
            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter part number, description or keyword — e.g. 8J5477, Cutting Edge 14ft, Grader Blade..."
                  value={partSearch}
                  onChange={(e) => {
                    setPartSearch(e.target.value);
                    setFinderResult(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && partSearch.trim())
                      setFinderResult(true);
                  }}
                  className="w-full bg-[#1A1D24] border-2 border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-5 py-4 pl-12 text-white placeholder-gray-600 transition-colors text-base"
                  data-testid="input-part-search"
                />
                <button
                  onClick={() => {
                    if (partSearch.trim()) setFinderResult(true);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#F5A623] text-black px-5 py-2 rounded font-bold text-sm hover:brightness-110 transition-all"
                  data-testid="button-part-search"
                >
                  Search
                </button>
              </div>
              {/* Quick search suggestions */}
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-500 text-xs font-semibold uppercase self-center">
                  Popular searches:
                </span>
                {[
                  "8J5477 Cutting Edge",
                  "Grader Blade 14ft",
                  "Scarifier Shank",
                  "End Bit CAT 140",
                  "Circle Segment",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setPartSearch(s);
                      setFinderResult(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#2A2E37] bg-[#1A1D24] text-gray-400 hover:border-[#F5A623]/50 hover:text-[#F5A623] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {/* Search Result CTA */}
              {finderResult && partSearch.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-[#1A1D24] to-[#1E2128] border-2 border-[#F5A623]/50 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[#F5A623] font-black text-lg mb-1">
                      <Search className="w-5 h-5" /> Searching for:{" "}
                      <span className="italic">"{partSearch}"</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Send this search to our team — we'll confirm stock and
                      pricing within 2 hours.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href={`https://wa.me/919953105738?text=Hello%2C%20I%20am%20looking%20for%20the%20following%20part%3A%20${encodeURIComponent(partSearch)}.%20Please%20confirm%20availability%20and%20price.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded font-bold text-sm hover:brightness-110 transition-all"
                      data-testid="button-search-whatsapp"
                    >
                      <FaWhatsapp size={18} /> WhatsApp Enquiry
                    </a>
                    <a
                      href={`tel:+919953105738`}
                      className="flex items-center gap-2 border-2 border-[#F5A623] text-[#F5A623] px-5 py-3 rounded font-bold text-sm hover:bg-[#F5A623] hover:text-black transition-all"
                      data-testid="button-search-call"
                    >
                      <Phone className="w-4 h-4" /> Call Now
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
      {/* ─── PRODUCT CATEGORIES ─── */}
      <section id="products" className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="mb-12">
              <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
                What We Supply
              </p>
              <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
                Motor Grader Spare Parts — Our Product Categories
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <FadeIn key={cat.title} delay={i * 0.08}>
                <div
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded overflow-hidden group hover:border-[#F5A623]/60 hover:shadow-[0_0_24px_rgba(245,166,35,0.15)] transition-all duration-300 flex flex-col h-full"
                  data-testid={`card-category-${i}`}
                >
                  <div className="h-44 overflow-hidden relative bg-[#1A1D24] flex items-center justify-center">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className={`w-full h-full group-hover:scale-110 transition-transform duration-700 ${cat.imgClass ?? "object-cover"}`}
                      style={cat.imgStyle}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex-grow">
                      {cat.desc}
                    </p>
                    <Link
                      href={`/products/${cat.slug}`}
                      className="w-full py-2.5 border border-[#F5A623] text-[#F5A623] rounded font-bold text-sm hover:bg-[#F5A623] hover:text-black transition-colors text-center flex items-center justify-center gap-1.5"
                      data-testid={`button-enquire-category-${i}`}
                    >
                      View Category <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest">
              Our Story
            </p>
            <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              India's Trusted Motor Grader Parts Supplier — Shiv Shakti
              International
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              With over <strong className="text-white">30+ years</strong> of
              experience,{" "}
              <strong className="text-white">
                SSI Earthmovers (Shiv Shakti International)
              </strong>{" "}
              has become India's most trusted supplier of motor grader spare
              parts — headquartered near{" "}
              <strong className="text-white">Mori Gate, New Delhi</strong>,
              serving construction, mining, and infrastructure companies
              nationwide.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Machine downtime costs money. We maintain a warehouse with 5,000+
              OEM and premium-grade replacement parts, ready for same-day
              dispatch. From cutting edges and grader blades to scarifier teeth
              and circle parts — if your grader needs it, we have it. Trusted by{" "}
              <strong className="text-white">500+ clients</strong> across 28
              states.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { label: "30+ Years", sub: "In Business" },
                { label: "500+ Clients", sub: "Across India" },
                { label: "5,000+ Parts", sub: "Ready to Ship" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="border border-[#2A2E37] rounded px-5 py-3 bg-[#111317]"
                >
                  <div className="text-[#F5A623] font-black text-lg">
                    {b.label}
                  </div>
                  <div className="text-gray-500 text-xs">{b.sub}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollTo("contact")}
              className="self-start mt-2 border-2 border-[#F5A623] text-[#F5A623] px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-[#F5A623] hover:text-black transition-colors"
              data-testid="button-know-more-about"
            >
              Know More
            </button>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative p-4">
              <img
                src="/images/about-warehouse.png"
                alt="SSI Earthmovers motor grader spare parts warehouse — 5,000+ OEM parts in stock at Mori Gate New Delhi"
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
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Our Advantages
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Why Choose SSI Earthmovers for Motor Grader Parts
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="bg-[#16181D] p-8 border border-[#2A2E37] rounded hover:border-[#F5A623]/50 hover:shadow-[0_0_24px_rgba(245,166,35,0.1)] transition-all group h-full">
                  <f.icon className="w-12 h-12 text-[#F5A623] mb-5 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {f.title}
                  </h3>
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
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Top Sellers
            </p>
            <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              Featured Products
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.07}>
                <div
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded overflow-hidden group hover:border-[#F5A623]/60 hover:shadow-[0_0_24px_rgba(245,166,35,0.12)] transition-all duration-300 flex flex-col h-full"
                  data-testid={`card-product-${i}`}
                >
                  <div className="h-44 overflow-hidden relative bg-[#1A1D24] flex items-center justify-center">
                    <img
                      src={p.img}
                      alt={p.name}
                      className={`w-full h-full group-hover:scale-110 transition-transform duration-700 ${p.imgClass ?? "object-cover"}`}
                      style={p.imgStyle}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-bold mb-2 text-white">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex-grow">
                      {p.desc}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="w-full py-2 bg-[#F5A623] text-black rounded font-bold text-sm hover:brightness-110 transition-all text-center"
                        data-testid={`button-enquire-product-${i}`}
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => scrollTo("contact")}
                        className="w-full py-2 border border-[#2A2E37] text-gray-400 rounded font-bold text-sm hover:border-[#F5A623]/50 hover:text-[#F5A623] transition-colors"
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ─── BRANDS WE COVER ─── */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Brand Support
            </p>
            <h2 className="text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              Spare Parts for All Major Motor Grader Brands
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl">
              From Caterpillar and Komatsu to Indian brands like Leeboy and BEML
              — we stock parts for every motor grader brand operating in India.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {allBrands.map((brand, i) => (
              <FadeIn key={brand.slug} delay={i * 0.05}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-5 text-center hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all block"
                  data-testid={`card-brand-${brand.slug}`}
                >
                  <div
                    className="text-xl font-black mb-1.5"
                    style={{ color: brand.color }}
                  >
                    {brand.name}
                  </div>
                  <div className="text-gray-500 text-xs mb-1">
                    {brand.country}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {brand.models.join(", ")}
                  </div>
                  <div className="mt-3 text-[#F5A623] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    View Parts <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ─── INDUSTRIES WE SERVE ─── */}
      <section id="industries" className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Sectors
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Industries We Supply Motor Grader Parts To
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => (
              <FadeIn key={ind.name} delay={i * 0.1}>
                <div
                  className="relative overflow-hidden rounded group cursor-pointer h-56"
                  data-testid={`card-industry-${i}`}
                >
                  <img
                    src={ind.img}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-lg font-black text-white uppercase">
                      {ind.name}
                    </h3>
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
                <div className="text-base font-bold uppercase tracking-wide opacity-80">
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      {/* ─── PROCESS ─── */}
      <section className="py-24 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Our Process
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <div
                  className="relative flex flex-col items-center text-center p-8 bg-[#16181D] border border-[#2A2E37] rounded hover:border-[#F5A623]/50 transition-colors group"
                  data-testid={`card-process-${i}`}
                >
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center text-black text-xs font-black">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center mb-5 group-hover:bg-[#F5A623]/20 transition-colors">
                    <step.icon className="w-7 h-7 text-[#F5A623]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
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
              Need Motor Grader{" "}
              <span className="text-[#F5A623]">Spare Parts?</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Get a quote within 2 hours. Fast dispatch across India.
            </p>
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
              href="tel:+919953105738"
              className="flex items-center gap-2 border-2 border-white/20 hover:border-[#F5A623] hover:text-[#F5A623] px-8 py-4 rounded font-bold uppercase tracking-wide transition-all"
              data-testid="button-call-now"
            >
              <Phone className="w-5 h-5" /> Call Now
            </a>
            <a
              href="https://wa.me/919953105738?text=Hello%2C%20I%20am%20interested%20in%20motor%20grader%20spare%20parts.%20Please%20share%20more%20details."
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
      {/* ─── SERVICE AREAS ─── */}
      <section className="py-20 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              PAN India Delivery
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Motor Grader Parts Delivered Across India
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              We ship motor grader spare parts to construction sites and fleet
              operators across all 28 states. Same-day dispatch from our New
              Delhi warehouse.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { city: "New Delhi", note: "Same-day" },
                { city: "Mumbai", note: "Maharashtra" },
                { city: "Chennai", note: "Tamil Nadu" },
                { city: "Kolkata", note: "West Bengal" },
                { city: "Bangalore", note: "Karnataka" },
                { city: "Hyderabad", note: "Telangana" },
                { city: "Pune", note: "Maharashtra" },
                { city: "Ahmedabad", note: "Gujarat" },
                { city: "Jaipur", note: "Rajasthan" },
                { city: "Lucknow", note: "Uttar Pradesh" },
                { city: "Chandigarh", note: "Punjab/Haryana" },
                { city: "Bhopal", note: "Madhya Pradesh" },
                { city: "Nagpur", note: "Maharashtra" },
                { city: "Surat", note: "Gujarat" },
                { city: "Patna", note: "Bihar" },
                { city: "Indore", note: "Madhya Pradesh" },
                { city: "Bhubaneswar", note: "Odisha" },
                { city: "Guwahati", note: "Assam" },
                { city: "Raipur", note: "Chhattisgarh" },
                { city: "Ranchi", note: "Jharkhand" },
                { city: "Dehradun", note: "Uttarakhand" },
                { city: "Jammu", note: "J&K" },
                { city: "Visakhapatnam", note: "Andhra Pradesh" },
                { city: "Coimbatore", note: "Tamil Nadu" },
              ].map((loc) => (
                <div
                  key={loc.city}
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded px-4 py-3 flex flex-col items-center text-center hover:border-[#F5A623]/50 transition-colors"
                >
                  <span className="text-white font-bold text-sm">
                    {loc.city}
                  </span>
                  <span className="text-[#F5A623] text-xs mt-0.5">
                    {loc.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              + All other districts and tier-2/tier-3 cities across India via
              our logistics partners.
            </p>
          </FadeIn>
        </div>
      </section>
      {/* ─── REVIEWS CTA ─── */}
      <section className="py-24 bg-[#16181D]">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <FadeIn>
            <div className="flex justify-center mb-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-7 h-7 fill-[#F5A623]"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-4">
              Client Reviews
            </p>
            <h2 className="text-4xl font-black uppercase text-white mb-5">
              Happy with Our Service?
              <br />
              Share Your Experience
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              We've served 500+ contractors, mining companies and infrastructure
              agencies across India. If you've worked with us, we'd love to hear
              your feedback — it helps other businesses make the right choice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://g.page/r/ssiearthmovers/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] px-8 py-4 rounded-lg font-black text-sm hover:shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Leave a Google Review
              </a>
              <a
                href={`https://wa.me/919953105738?text=Hi%20SSI%20Earthmovers%2C%20I%20would%20like%20to%20share%20my%20feedback%20about%20your%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-lg font-black text-sm hover:brightness-110 hover:scale-105 transition-all"
              >
                <FaWhatsapp size={20} />
                Share via WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
      {/* ─── FAQ ─── */}
      <section className="py-24 bg-[#111317]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Common Questions
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Frequently Asked Questions About Motor Grader Parts
            </h2>
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
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl font-black uppercase text-white">
              Contact Us
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Send us an enquiry and our team will respond within 2 business
              hours.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <FadeIn className="flex flex-col gap-6">
              {/* Contact details */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Phone,
                    label: "Phone / WhatsApp",
                    value: "+91-9953105738 | 011-49324607, 41055650",
                    href: "tel:+919953105738",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "ssiearthmovers@gmail.com",
                    href: "mailto:ssiearthmovers@gmail.com",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-5 p-5 bg-[#1A1D24] border border-[#2A2E37] rounded hover:border-[#F5A623]/40 transition-colors"
                  >
                    <div className="w-11 h-11 rounded bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#F5A623]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                        {item.label}
                      </div>
                      <a
                        href={item.href}
                        className="text-white font-semibold hover:text-[#F5A623] transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch offices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Branch Office",
                    addr: "Nicholson Road, Near Mori Gate, New Delhi – 110006",
                  },
                  {
                    label: "Head Office",
                    addr: "A-9, Ground Floor, Sec-19, Rohini, Delhi – 110085",
                  },
                  {
                    label: "Workshop",
                    addr: "Plot 138, Phase-1, HSIDC, Rai, Sonipat – 131001",
                  },
                ].map((o) => (
                  <div
                    key={o.label}
                    className="p-4 bg-[#1A1D24] border border-[#2A2E37] rounded hover:border-[#F5A623]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span className="text-[#F5A623] text-xs font-black uppercase tracking-wide">
                        {o.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {o.addr}
                    </p>
                  </div>
                ))}
              </div>

              {/* Business hours */}
              <div className="p-5 bg-[#1A1D24] border border-[#2A2E37] rounded flex items-center gap-5">
                <div className="w-11 h-11 rounded bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#F5A623]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                    Business Hours
                  </div>
                  <div className="text-white font-semibold text-sm">
                    Mon – Sat: 9:30 AM – 6:30 PM
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Sunday: Closed &nbsp;|&nbsp; Emergency: WhatsApp anytime
                  </div>
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded overflow-hidden border border-[#2A2E37] h-48">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.785177739855!2d77.22589661508067!3d28.660571982403637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd53e03e15d9%3A0x3a5b6e1d6b32ce04!2sMori%20Gate%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1691234567890"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "invert(90%) hue-rotate(180deg)",
                  }}
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
                  <h3 className="text-2xl font-bold text-white">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400">
                    Our team will contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="mt-4 border border-[#F5A623] text-[#F5A623] px-6 py-2.5 rounded font-bold hover:bg-[#F5A623] hover:text-black transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-[#1A1D24] border border-[#2A2E37] rounded p-8 flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white placeholder-gray-600 transition-colors"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white placeholder-gray-600 transition-colors"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Machine Brand & Model
                      </label>
                      <select
                        value={formData.machine}
                        onChange={(e) =>
                          setFormData({ ...formData, machine: e.target.value })
                        }
                        className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white transition-colors"
                        data-testid="input-machine"
                      >
                        <option value="">Select machine...</option>
                        <option>CAT 120K</option>
                        <option>CAT 120H</option>
                        <option>CAT 140H</option>
                        <option>KOMATSU GD511</option>
                        <option>MITSUBISHI 330 MG</option>
                        <option>CASE 845B</option>
                        <option>XCMG 165</option>
                        <option>LEEBOY 785</option>
                        <option>LEEBOY 985</option>
                        <option>SANY PQ190</option>
                        <option>SDLG 9138</option>
                        <option>SDLG 9190</option>
                        <option>LIUGONG CG414</option>
                        <option>BEML 605</option>
                        <option>Other (mention in message)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Part Required
                      </label>
                      <select
                        value={formData.part}
                        onChange={(e) =>
                          setFormData({ ...formData, part: e.target.value })
                        }
                        className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white transition-colors"
                        data-testid="input-part"
                      >
                        <option value="">Select part type...</option>
                        <option>Cutting Edges</option>
                        <option>Grader Blades</option>
                        <option>Scarifier Teeth</option>
                        <option>Ripper Tips</option>
                        <option>End Bits / Corner Bits</option>
                        <option>Circle Segments</option>
                        <option>Draw Bar Parts</option>
                        <option>Multiple Parts</option>
                        <option>Other (mention in message)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                      Message / Part Number / Quantity
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share part number, quantity, or any details..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded px-4 py-3 text-white placeholder-gray-600 transition-colors resize-none"
                      data-testid="input-message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F5A623] text-black py-4 rounded font-black uppercase tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all flex items-center justify-center gap-2"
                    data-testid="button-submit-form"
                  >
                    <FaWhatsapp size={20} /> Send via WhatsApp
                  </button>
                  <p className="text-center text-gray-600 text-xs">
                    Clicking above opens WhatsApp with your enquiry pre-filled.
                    We reply within 2 hours.
                  </p>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
      {/* ─── FLOATING WHATSAPP BUTTON ─── */}
      <a
        href="https://wa.me/919953105738?text=Hello%2C%20I%20am%20interested%20in%20motor%20grader%20spare%20parts.%20Please%20share%20more%20details."
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
              India's premier supplier of premium motor grader spare parts.
              Keeping your machinery moving since 30 years.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaWhatsapp, href: "https://wa.me/919953105738" },
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
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 text-gray-500 text-sm">
              {[
                { label: "About Us", id: "about" },
                { label: "Products", id: "products" },
                { label: "Find My Part", id: "finder" },
                { label: "Industries", id: "industries" },
                { label: "Contact", id: "contact" },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="hover:text-[#F5A623] transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/ssi-catalogue.pdf"
                  download="SSI-Earthmovers-Catalogue.pdf"
                  className="flex items-center gap-1.5 hover:text-[#F5A623] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Catalogue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">
              Products
            </h4>
            <ul className="flex flex-col gap-3 text-gray-500 text-sm">
              {productCategories.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="hover:text-[#F5A623] transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black mb-6 text-white uppercase tracking-widest">
              Contact
            </h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <span>Near Mori Gate, New Delhi – 110006, India</span>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+919953105738"
                    className="hover:text-[#F5A623] transition-colors"
                  >
                    +91-9953105738
                  </a>
                  <a
                    href="tel:01149324607"
                    className="hover:text-[#F5A623] transition-colors"
                  >
                    011-49324607, 41055650
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
                <a
                  href="mailto:ssiearthmovers@gmail.com"
                  className="hover:text-[#F5A623] transition-colors"
                >
                  ssiearthmovers@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-[#2A2E37] flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 text-xs">
          <span>
            &copy; {new Date().getFullYear()} Shiv Shakti International. All
            rights reserved.
          </span>
          <span>Designed for the heavy machinery industry of India</span>
        </div>
      </footer>
    </div>
  );
}
