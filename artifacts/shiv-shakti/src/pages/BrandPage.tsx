import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2, Phone, Truck, Package, ShieldCheck,
  ChevronDown, ChevronUp, ArrowRight, MapPin, Clock,
  Search, Filter, MessageSquare, Copy, Check,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  brands, productCategories, WHATSAPP, PHONE1, PHONE2,
  PART_CATEGORY_IMG, type BrandPart,
} from "@/lib/siteData";
import { usePageMeta } from "@/hooks/usePageMeta";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#2A2E37] rounded overflow-hidden">
      <button className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-white hover:bg-[#1A1D24] transition-colors"
        onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#F5A623] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#F5A623] shrink-0" />}
      </button>
      {open && <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-[#2A2E37]">{a}</div>}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} className="ml-1 text-gray-600 hover:text-[#F5A623] transition-colors" title="Copy part number">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

const CAT_BADGE: Record<string, { label: string; cls: string }> = {
  sprocket:    { label: "Sprocket",    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  bushing:     { label: "Bushing",     cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  brake:       { label: "Brake",       cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  hub:         { label: "Hub",         cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  gear:        { label: "Gear",        cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  shaft:       { label: "Shaft",       cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  "ring-gear": { label: "Ring Gear",   cls: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  sleeve:      { label: "Sleeve",      cls: "bg-teal-500/15 text-teal-400 border-teal-500/30" },
  plate:       { label: "Plate/Shim",  cls: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
  pin:         { label: "Pin",         cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  joint:       { label: "Joint/Yoke",  cls: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  seal:        { label: "Seal",        cls: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
  hydraulic:   { label: "Hydraulic",   cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  "end-bit":   { label: "End Bit",     cls: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  general:     { label: "General",     cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

function PartRow({ part, index }: { part: BrandPart; index: number }) {
  const badge = CAT_BADGE[part.category] ?? CAT_BADGE.general;
  const waMsg = encodeURIComponent(
    `Hello SSI Earthmovers,\n\nI need the following part:\n\nPart Name: ${part.name}\nPart No: ${part.partNo}\nMachine: ${part.model}\n\nPlease confirm availability and pricing.`
  );

  const handleEnquire = async () => {
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Website Visitor", phone: "—",
          machine: part.model,
          part: `${part.name} (${part.partNo})`,
          message: "Enquiry via brand parts catalog",
          source: "brand-page",
        }),
      });
    } catch { /* continue */ }
    window.open(`https://wa.me/${WHATSAPP}?text=${waMsg}`, "_blank");
  };

  return (
    <div className={`grid items-center gap-3 px-5 py-4 border-b border-[#2A2E37] hover:bg-[#F5A623]/5 transition-colors group
      ${index % 2 === 0 ? "bg-[#1A1D24]" : "bg-[#16181D]"}
    `} style={{ gridTemplateColumns: "2rem 1fr auto auto" }}>
      {/* Row number */}
      <span className="text-xs text-gray-600 font-mono tabular-nums">{index + 1}</span>

      {/* Part info */}
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm leading-tight">{part.name}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-gray-500 text-xs">{part.model}</span>
        </div>
      </div>

      {/* Part number */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-sm font-bold text-[#F5A623] bg-[#F5A623]/10 px-3 py-1.5 rounded border border-[#F5A623]/25 whitespace-nowrap">
          {part.partNo}
        </span>
        <CopyButton text={part.partNo} />
      </div>

      {/* Enquire */}
      <button
        onClick={handleEnquire}
        className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
      >
        <FaWhatsapp className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Enquire</span>
      </button>
    </div>
  );
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "sprocket", label: "Sprockets" },
  { value: "bushing", label: "Bushings" },
  { value: "brake", label: "Brake Parts" },
  { value: "hub", label: "Hubs & Flanges" },
  { value: "gear", label: "Gears & Worms" },
  { value: "shaft", label: "Shafts & Axles" },
  { value: "ring-gear", label: "Ring Gears" },
  { value: "sleeve", label: "Sleeves" },
  { value: "plate", label: "Plates & Shims" },
  { value: "pin", label: "Pins" },
  { value: "joint", label: "Joints & Yokes" },
  { value: "seal", label: "Seals" },
  { value: "hydraulic", label: "Hydraulic Parts" },
  { value: "end-bit", label: "End Bits / Side Cutters" },
  { value: "general", label: "General Parts" },
];

export default function BrandPage() {
  const params = useParams<{ slug: string }>();
  const brand = brands.find(b => b.slug === params.slug);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => { window.scrollTo(0, 0); setSearch(""); setCatFilter("all"); }, [params.slug]);

  usePageMeta({
    title: brand?.metaTitle ?? "Motor Grader Spare Parts | SSI Earthmovers India",
    description: brand?.metaDesc ?? "Premium OEM-quality motor grader spare parts. Same-day dispatch from New Delhi. Call +91-9953105738.",
    canonical: brand ? `https://ssiearthmovers.in/brands/${brand.slug}` : undefined,
    schema: brand ? {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": brand.metaTitle,
      "description": brand.metaDesc,
      "url": `https://ssiearthmovers.in/brands/${brand.slug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ssiearthmovers.in/" },
          { "@type": "ListItem", "position": 2, "name": "Brands", "item": "https://ssiearthmovers.in/#products" },
          { "@type": "ListItem", "position": 3, "name": brand.name, "item": `https://ssiearthmovers.in/brands/${brand.slug}` },
        ],
      },
    } : undefined,
  });

  const filteredParts = useMemo(() => {
    if (!brand?.parts.length) return [];
    return brand.parts.filter(p => {
      const matchesCat = catFilter === "all" || p.category === catFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.partNo.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [brand, search, catFilter]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#16181D] text-white flex flex-col items-center justify-center gap-6">
        <SiteNavbar />
        <div className="text-center pt-40">
          <h1 className="text-4xl font-black text-white mb-4">Brand Not Found</h1>
          <p className="text-gray-400 mb-8">We could not find a page for this brand.</p>
          <Link href="/" className="bg-[#F5A623] text-black px-8 py-3 rounded font-black hover:brightness-110 transition-all">
            Back to Home
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const waMsg = `Hello SSI Earthmovers,%0A%0AI need spare parts for my ${brand.fullName} motor grader (${brand.models.join(", ")}).%0APlease share availability and pricing.`;

  return (
    <div className="min-h-screen text-[#F2F2F2] font-sans" style={{ background: "#16181D" }}>
      {typeof document !== "undefined" && (document.title = brand.metaTitle)}

      {/* Ticker */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-[#F5A623] text-black text-xs font-bold overflow-hidden h-9 flex items-center">
        <div className="animate-ticker whitespace-nowrap select-none">
          {[1, 2].map((n) => (
            <span key={n} className="inline-flex items-center gap-8 px-8">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 5,000+ Parts Ready for Same-Day Dispatch</span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> Call: {PHONE1} &nbsp;|&nbsp; {PHONE2}</span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 shrink-0" /> PAN India Delivery — All 28 States</span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-2"><Package className="w-3.5 h-3.5 shrink-0" /> Bulk Orders Welcome</span>
              <span className="opacity-40">|</span>
            </span>
          ))}
        </div>
      </div>

      <SiteNavbar />

      {/* HERO */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={brand.img}
            alt={`${brand.fullName} motor grader spare parts — SSI Earthmovers`}
            className="w-full h-full object-contain object-right"
            style={{ filter: "brightness(0.35) saturate(0.9)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1014] via-[#0F1014]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1014]/70 via-transparent to-[#0F1014]/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-500">Brands</span>
              <span>/</span>
              <span className="text-[#F5A623]">{brand.fullName}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#F5A623]" />
              <span className="text-[#F5A623] text-sm font-bold uppercase tracking-widest">
                {brand.country} · Motor Grader Parts
              </span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white uppercase max-w-3xl mb-6">
              <span style={{ color: brand.color }}>{brand.name}</span> Motor Grader<br />Spare Parts India
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-8">{brand.description}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-4 mb-10">
              {brand.models.map(m => (
                <span key={m} className="border border-[#F5A623]/50 text-[#F5A623] text-sm font-bold px-4 py-1.5 rounded-full">
                  {m}
                </span>
              ))}
              {brand.parts.length > 0 && (
                <span className="border border-white/20 text-gray-300 text-sm font-bold px-4 py-1.5 rounded-full">
                  {brand.parts.length} Parts Listed
                </span>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex flex-wrap gap-4">
              <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded font-black text-sm hover:brightness-110 transition-all">
                <FaWhatsapp size={18} /> Enquire on WhatsApp
              </a>
              <a href={`tel:${PHONE1}`}
                className="flex items-center gap-2 border border-[#F5A623] text-[#F5A623] px-7 py-3.5 rounded font-bold text-sm hover:bg-[#F5A623]/10 transition-colors">
                <Phone className="w-4 h-4" /> Call Now
              </a>
              {brand.parts.length > 0 && (
                <button
                  onClick={() => document.getElementById("parts-catalog")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 border border-white/20 text-gray-300 px-7 py-3.5 rounded font-bold text-sm hover:border-white/40 transition-colors">
                  View Parts Catalog ↓
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PARTS WE SUPPLY */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">What We Supply</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              {brand.fullName} Motor Grader Parts We Stock
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {brand.keyParts.map((part, i) => (
              <FadeIn key={part} delay={i * 0.07}>
                <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-lg p-5 hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all group">
                  <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#F5A623]/20 transition-colors">
                    <Package className="w-5 h-5 text-[#F5A623]" />
                  </div>
                  <h3 className="font-bold text-white mb-3">{part}</h3>
                  <a href={`https://wa.me/${WHATSAPP}?text=Hello,%20I%20need%20${encodeURIComponent(part)}%20for%20${encodeURIComponent(brand.fullName)}%20motor%20grader.%20Please%20share%20pricing.`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[#F5A623] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PARTS GALLERY */}
      {brand.gallery && (
        <section className="bg-[#0D0F13]">
          {/* ── Machine banner ── */}
          <div className="relative w-full overflow-hidden" style={{ height: "420px" }}>
            <img
              src={brand.img}
              alt={`${brand.fullName} Motor Grader`}
              className="absolute inset-0 w-full h-full object-contain object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-10">
              <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2">
                {brand.country} · Motor Grader
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-none mb-3">
                {brand.fullName}
              </h2>
              <p className="text-gray-300 text-sm mb-4">{brand.models.join("  ·  ")}</p>
              <div className="flex gap-3">
                <span className="bg-[#F5A623] text-black text-xs font-black px-3 py-1.5 rounded-full">
                  {brand.parts.length} OEM Parts Listed
                </span>
                <span className="border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Same-Day Dispatch · New Delhi
                </span>
              </div>
            </div>
          </div>

          {/* ── Catalogue sheet grid ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
            <FadeIn className="mb-8">
              <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2">Official Parts Catalogue</p>
              <h3 className="text-2xl md:text-3xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
                Parts We Stock for {brand.fullName}
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {brand.gallery.featuredParts.map((fp, i) => {
                const isLastOdd = brand.gallery!.featuredParts.length % 2 !== 0
                  && i === brand.gallery!.featuredParts.length - 1;
                return (
                <FadeIn key={i} delay={i * 0.08} className={isLastOdd ? "sm:col-span-2" : ""}>
                  <div className="rounded-2xl overflow-hidden border border-[#2A2E37] hover:border-[#F5A623]/50 hover:shadow-[0_8px_40px_rgba(245,166,35,0.1)] transition-all group">
                    {/* Image on true white — catalogue sheets are already white bg */}
                    <div className="bg-white flex items-center justify-center" style={{ height: "260px" }}>
                      <img
                        src={fp.img}
                        alt={fp.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Footer label */}
                    <div className="bg-[#1A1D24] px-5 py-3 flex items-center justify-between border-t border-[#2A2E37]">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#F5A623] rounded-full" />
                        <p className="text-white text-sm font-bold">{fp.name}</p>
                      </div>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello SSI Earthmovers, I need ${fp.name} for ${brand.fullName} motor grader. Please share pricing.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" /> Enquire
                      </a>
                    </div>
                  </div>
                </FadeIn>
                );
              })}
            </div>

            {/* CTA bar */}
            <FadeIn delay={0.35} className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-6">
              <div>
                <p className="text-white font-bold text-base">Don't see the exact part you need?</p>
                <p className="text-gray-500 text-sm mt-1">Share your OEM part number — we'll confirm availability and quote within 2 hours.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello SSI Earthmovers, I need a ${brand.fullName} motor grader part. Please help.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all">
                  <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
                </a>
                <button
                  onClick={() => document.getElementById("parts-catalog")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 border border-[#F5A623] text-[#F5A623] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#F5A623]/10 transition-all">
                  Full Parts List ↓
                </button>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* PARTS CATALOG */}
      {brand.parts.length > 0 && (
        <section id="parts-catalog" className="py-24 bg-[#16181D]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <FadeIn className="mb-10">
              <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Official Part Numbers</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
                {brand.fullName} Parts Catalogue
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl">
                Browse all {brand.parts.length} listed parts with official OEM part numbers. Click the WhatsApp button on any part to enquire instantly.
              </p>
            </FadeIn>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by part name or part number…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#1A1D24] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 transition-colors text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <select
                  value={catFilter}
                  onChange={e => setCatFilter(e.target.value)}
                  className="appearance-none bg-[#1A1D24] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-9 pr-8 py-3 text-white transition-colors text-sm cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="text-white font-bold">{filteredParts.length}</span> of {brand.parts.length} parts
              </p>
              {(search || catFilter !== "all") && (
                <button onClick={() => { setSearch(""); setCatFilter("all"); }}
                  className="text-[#F5A623] text-sm font-bold hover:underline">
                  Clear filters
                </button>
              )}
            </div>

            {/* Parts Table */}
            {filteredParts.length > 0 ? (
              <div className="rounded-xl overflow-hidden border border-[#2A2E37]">
                {/* Table header */}
                <div className="grid items-center gap-3 px-5 py-3 bg-[#111317] border-b border-[#2A2E37]"
                  style={{ gridTemplateColumns: "2rem 1fr auto auto" }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">#</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Part Name / Category</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">OEM Part No.</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hidden md:block">Action</span>
                </div>
                {filteredParts.map((part, i) => (
                  <PartRow key={`${part.partNo}-${i}`} part={part} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-16 text-center">
                <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-bold mb-1">No parts found</p>
                <p className="text-gray-500 text-sm">Try a different search term or clear the filter.</p>
              </div>
            )}

            {/* CTA strip */}
            <div className="mt-10 bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold">Don't see the part you need?</p>
                <p className="text-gray-400 text-sm mt-0.5">Share the part number or dimensions — we'll check stock and quote you within 2 hours.</p>
              </div>
              <a href={`https://wa.me/${WHATSAPP}?text=Hello,%20I%20need%20a%20${encodeURIComponent(brand.fullName)}%20motor%20grader%20part%20that%20is%20not%20listed%20on%20your%20website.%20Can%20you%20help?`}
                target="_blank" rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all">
                <FaWhatsapp size={16} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT BRAND + WHY SSI */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-start">
          <FadeIn>
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">About {brand.fullName}</p>
            <h2 className="text-3xl font-black uppercase text-white mb-6">
              Why {brand.fullName} Operators Trust SSI Earthmovers
            </h2>
            <p className="text-gray-300 leading-relaxed mb-5">{brand.longDescription}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { icon: ShieldCheck, label: "OEM-spec quality on every part" },
                { icon: Truck, label: "Same-day dispatch from Delhi" },
                { icon: Package, label: "5,000+ parts in stock" },
                { icon: CheckCircle2, label: "30+ years experience" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#1A1D24] border border-[#2A2E37] rounded px-4 py-3">
                  <item.icon className="w-5 h-5 text-[#F5A623] shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-8">
              <h3 className="text-xl font-black text-white mb-6">Get a Quote for {brand.fullName} Parts</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg">
                  <FaWhatsapp size={28} className="text-[#25D366] shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">WhatsApp — Fastest Response</div>
                    <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                      className="text-[#25D366] font-bold hover:underline text-sm">
                      +91-9953105738 →
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg">
                  <Phone className="w-6 h-6 text-[#F5A623] shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Call Us Directly</div>
                    <div className="flex flex-col gap-0.5">
                      <a href={`tel:${PHONE1}`} className="text-[#F5A623] font-bold hover:underline text-sm">{PHONE1}</a>
                      <a href="tel:01149324607" className="text-gray-400 text-sm hover:text-[#F5A623]">{PHONE2}</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#1A1D24] border border-[#2A2E37] rounded-lg">
                  <MapPin className="w-6 h-6 text-[#F5A623] shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Visit Our Store</div>
                    <div className="text-gray-400 text-sm">Nicholson Road, Near Mori Gate, New Delhi – 110006</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#1A1D24] border border-[#2A2E37] rounded-lg">
                  <Clock className="w-6 h-6 text-[#F5A623] shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Business Hours</div>
                    <div className="text-gray-400 text-sm">Mon–Sat, 9:30 AM – 6:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* COMPATIBLE MODELS */}
      <section className="py-16 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase text-white">Compatible {brand.fullName} Models</h2>
            <p className="text-gray-400 mt-3">We stock parts for the following {brand.fullName} motor grader models</p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-5">
            {brand.models.map((model, i) => (
              <FadeIn key={model} delay={i * 0.1}>
                <div className="bg-[#1A1D24] border-2 rounded-xl px-10 py-6 text-center min-w-[160px]"
                  style={{ borderColor: brand.color + "60" }}>
                  <div className="text-2xl font-black mb-1" style={{ color: brand.color }}>{brand.name}</div>
                  <div className="text-white font-bold">{model.replace(brand.name + " ", "").replace(brand.name, "")}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE ALL PRODUCT CATEGORIES */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-12 text-center">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">All Categories</p>
            <h2 className="text-3xl font-black uppercase text-white">Browse Parts for {brand.fullName} Graders</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {productCategories.map((cat, i) => (
              <FadeIn key={cat.slug} delay={i * 0.07}>
                <Link href={`/products/${cat.slug}`}
                  className="group bg-[#1A1D24] border border-[#2A2E37] rounded-lg overflow-hidden hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all block">
                  <div className="h-36 overflow-hidden">
                    <img src={cat.img} alt={`${cat.name} for ${brand.fullName} motor grader`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-2">{cat.name}</h3>
                    <span className="text-[#F5A623] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Parts <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER BRANDS */}
      <section className="py-16 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase text-white">We Also Supply Parts for These Brands</h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.filter(b => b.slug !== brand.slug).map((b, i) => (
              <FadeIn key={b.slug} delay={i * 0.04}>
                <Link href={`/brands/${b.slug}`}
                  className="px-5 py-2.5 bg-[#1A1D24] border border-[#2A2E37] rounded-lg text-sm font-bold text-gray-300 hover:border-[#F5A623]/50 hover:text-[#F5A623] transition-all">
                  {b.fullName}
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {brand.faqs.length > 0 && (
        <section className="py-20 bg-[#111317]">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-black uppercase text-white">FAQs — {brand.fullName} Grader Parts</h2>
            </FadeIn>
            <div className="flex flex-col gap-3">
              {brand.faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.07}><FaqItem q={faq.q} a={faq.a} /></FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="py-20 bg-[#F5A623]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase mb-4">
              Need {brand.fullName} Grader Parts Now?
            </h2>
            <p className="text-black/70 mb-8 text-lg max-w-xl mx-auto">
              Call or WhatsApp our team. In-stock parts dispatched same day. 30+ years of experience. 500+ clients across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded font-black text-sm hover:bg-black/80 transition-all">
                <FaWhatsapp size={18} /> WhatsApp Now
              </a>
              <a href={`tel:${PHONE1}`}
                className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded font-black text-sm hover:bg-gray-100 transition-all">
                <Phone className="w-4 h-4" /> {PHONE1}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }} className="flex items-center gap-3">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0F1014] text-white text-sm font-semibold px-4 py-2 rounded shadow-lg border border-[#2A2E37] whitespace-nowrap">
            Enquire on WhatsApp
          </span>
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.5)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300">
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <FaWhatsapp size={30} className="text-white relative z-10" />
          </div>
        </motion.div>
      </a>

      <SiteFooter />
    </div>
  );
}
