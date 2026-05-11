import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2, Phone, Truck, Package, ShieldCheck,
  ChevronDown, ChevronUp, ArrowRight, MapPin, Clock
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { productCategories, brands, WHATSAPP, PHONE1, PHONE2 } from "@/lib/siteData";
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

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = productCategories.find(p => p.slug === params.slug);

  useEffect(() => { window.scrollTo(0, 0); }, [params.slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#16181D] text-white flex flex-col items-center justify-center gap-6">
        <SiteNavbar />
        <div className="text-center pt-40">
          <h1 className="text-4xl font-black text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">We could not find this product category.</p>
          <Link href="/" className="bg-[#F5A623] text-black px-8 py-3 rounded font-black hover:brightness-110 transition-all">
            Back to Home
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const waMsg = `Hello SSI Earthmovers,%0A%0AI need ${encodeURIComponent(product.name)}%20for%20my%20motor%20grader.%0APlease%20share%20availability%20and%20pricing.`;

  usePageMeta({
    title: product.metaTitle,
    description: product.metaDesc,
    canonical: `https://ssiearthmovers.in/products/${product.slug}`,
    ogImage: product.img,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": product.metaTitle,
      "description": product.metaDesc,
      "url": `https://ssiearthmovers.in/products/${product.slug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ssiearthmovers.in/" },
          { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://ssiearthmovers.in/#products" },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://ssiearthmovers.in/products/${product.slug}` },
        ],
      },
    },
  });

  return (
    <div className="min-h-screen text-[#F2F2F2] font-sans" style={{ background: "#16181D" }}>

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
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={product.img}
            alt={`${product.name} for motor graders — SSI Earthmovers India`}
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.25) saturate(0.8)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1014] via-[#0F1014]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1014]/70 via-transparent to-[#0F1014]/90" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <FadeIn>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-500">Products</span>
                <span>/</span>
                <span className="text-[#F5A623]">{product.name}</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#F5A623]" />
                <span className="text-[#F5A623] text-sm font-bold uppercase tracking-widest">Motor Grader Wear Parts</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white uppercase mb-5">
                <span className="text-[#F5A623]">{product.name}</span><br />
                Supplier India
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-8">{product.tagline}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap gap-4">
                <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded font-black text-sm hover:brightness-110 transition-all">
                  <FaWhatsapp size={18} /> Enquire on WhatsApp
                </a>
                <a href={`tel:${PHONE1}`}
                  className="flex items-center gap-2 border border-[#F5A623] text-[#F5A623] px-7 py-3.5 rounded font-bold text-sm hover:bg-[#F5A623]/10 transition-colors">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-start">
          <FadeIn>
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-4">About This Product</p>
            <h2 className="text-3xl font-black uppercase text-white mb-6">{product.name} for Motor Graders</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{product.description}</p>
            <p className="text-gray-400 leading-relaxed">{product.longDescription}</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-7">
              <h3 className="text-lg font-black text-white uppercase mb-6 border-b border-[#2A2E37] pb-4">
                Technical Specifications
              </h3>
              <div className="flex flex-col gap-3">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex gap-4 py-2 border-b border-[#2A2E37]/60 last:border-0">
                    <span className="text-gray-500 text-sm min-w-[120px] shrink-0">{spec.label}</span>
                    <span className="text-white text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#F5A623] text-black py-3.5 rounded font-black text-sm hover:brightness-110 transition-all"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VARIANTS */}
      <section className="py-20 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Types Available</p>
            <h2 className="text-3xl font-black uppercase text-white border-l-4 border-[#F5A623] pl-4">
              {product.name} — Variants & Types
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.variants.map((v, i) => (
              <FadeIn key={v.name} delay={i * 0.08}>
                <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-6 hover:border-[#F5A623]/50 transition-all h-full flex flex-col">
                  <div className="w-8 h-1 bg-[#F5A623] rounded mb-4" />
                  <h3 className="font-bold text-white mb-3">{v.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">{v.desc}</p>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hello,%20I%20need%20${encodeURIComponent(v.name)}%20for%20my%20motor%20grader.%20Please%20share%20pricing.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-[#F5A623] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SSI */}
      <section className="py-20 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase text-white">
              Why Buy {product.name} from SSI Earthmovers?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "OEM-spec Quality", desc: "Parts that match or exceed original equipment specifications. Quality-checked before dispatch." },
              { icon: Package, title: "5,000+ Parts in Stock", desc: "Massive ready inventory means no waiting. Same-day dispatch on all in-stock items." },
              { icon: Truck, title: "PAN India Delivery", desc: "We deliver to all 28 states. Construction sites, mine locations, city warehouses." },
              { icon: CheckCircle2, title: "30+ Years Experience", desc: "Three decades of expertise means we know grader parts better than anyone in India." },
              { icon: Phone, title: "2-Hour Response", desc: "Share your OEM part number via WhatsApp and get availability + pricing within 2 hours." },
              { icon: MapPin, title: "Walk In Welcome", desc: "Visit our branch at Mori Gate, New Delhi. Monday to Saturday, 9:30 AM – 6:30 PM." },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <div className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-6 hover:border-[#F5A623]/40 transition-all">
                  <f.icon className="w-7 h-7 text-[#F5A623] mb-4" />
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* COMPATIBLE BRANDS */}
      <section className="py-20 bg-[#16181D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="text-center mb-12">
            <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3">Brand Compatibility</p>
            <h2 className="text-3xl font-black uppercase text-white">
              {product.name} Available for All Major Brands
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {brands.map((b, i) => (
              <FadeIn key={b.slug} delay={i * 0.05}>
                <Link href={`/brands/${b.slug}`}
                  className="group bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-5 text-center hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all block">
                  <div className="text-lg font-black mb-1" style={{ color: b.color }}>{b.name}</div>
                  <div className="text-gray-500 text-xs">{b.models.join(", ")}</div>
                  <div className="text-[#F5A623] text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    View Parts <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER PRODUCTS */}
      <section className="py-16 bg-[#111317]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase text-white">Other Motor Grader Parts We Supply</h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4">
            {productCategories.filter(p => p.slug !== product.slug).map((p, i) => (
              <FadeIn key={p.slug} delay={i * 0.06}>
                <Link href={`/products/${p.slug}`}
                  className="group flex items-center gap-3 bg-[#1A1D24] border border-[#2A2E37] rounded-lg px-5 py-3 hover:border-[#F5A623]/50 hover:text-[#F5A623] transition-all">
                  <img src={p.img} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  <span className="text-gray-300 font-bold text-sm group-hover:text-[#F5A623] transition-colors">{p.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section className="py-20 bg-[#16181D]">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-black uppercase text-white">
                FAQs — {product.name}
              </h2>
            </FadeIn>
            <div className="flex flex-col gap-3">
              {product.faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <FaqItem q={faq.q} a={faq.a} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[#F5A623]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase mb-4">
              Order {product.name} Today
            </h2>
            <p className="text-black/70 mb-8 text-lg max-w-xl mx-auto">
              Same-day dispatch from New Delhi. PAN India delivery. 30+ years of expertise.
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

      <SiteFooter />
    </div>
  );
}
