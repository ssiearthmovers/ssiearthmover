import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Clock, Tag, ArrowRight, CheckCircle2, Phone, Truck, Package } from "lucide-react";
import { blogArticles } from "@/lib/blogData";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PHONE1, PHONE2 } from "@/lib/siteData";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

const CATEGORY_COLORS: Record<string, string> = {
  "Maintenance Guide": "bg-green-500/15 text-green-400 border-green-500/30",
  "Buying Guide":      "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Brand Comparison":  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Troubleshooting":   "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogListPage() {
  usePageMeta({
    title: "Motor Grader Blog — Expert Tips, Guides & Industry Insights | SSI Earthmovers",
    description: "Expert articles on motor grader spare parts, maintenance tips, buying guides and troubleshooting from SSI Earthmovers — India's leading grader parts supplier since 1994.",
    canonical: "https://ssiearthmovers.in/blog",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "SSI Earthmovers — Motor Grader Blog",
      "description": "Expert articles on motor grader spare parts, maintenance, and industry insights",
      "url": "https://ssiearthmovers.in/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Shiv Shakti International (SSI Earthmovers)",
        "url": "https://ssiearthmovers.in",
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

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-400">Blog</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#F5A623]" />
            <span className="text-[#F5A623] text-sm font-bold uppercase tracking-widest">Expert Insights</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase leading-tight mb-4">
            Motor Grader<br /><span className="text-[#F5A623]">Knowledge Hub</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Expert articles on spare parts maintenance, buying guides, brand comparisons and troubleshooting — from SSI Earthmovers, India's leading motor grader parts supplier since 1994.
          </p>
        </FadeIn>
      </section>

      {/* Articles Grid */}
      <section className="px-6 md:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {blogArticles.map((article, i) => {
            const catCls = CATEGORY_COLORS[article.category] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30";
            return (
              <FadeIn key={article.slug} delay={i * 0.08}>
                <Link href={`/blog/${article.slug}`}
                  className="group block bg-[#1A1D24] border border-[#2A2E37] rounded-xl overflow-hidden hover:border-[#F5A623]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F5A623]/5">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-[#0D0F12]">
                    <img src={article.featuredImage} alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: "brightness(0.6) saturate(0.7)" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24] via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${catCls}`}>
                      {article.category}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-gray-600 text-xs mb-3">
                      <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {formatDate(article.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime} min read</span>
                    </div>
                    <h2 className="text-lg font-black text-white leading-snug mb-3 group-hover:text-[#F5A623] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-[#F5A623] text-sm font-bold group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {/* Browse by Category */}
        <FadeIn delay={0.3} className="mt-16 pt-12 border-t border-[#2A2E37]">
          <h2 className="text-xl font-black text-white uppercase mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
              <span key={cat} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border ${cls}`}>{cat}</span>
            ))}
          </div>
        </FadeIn>

        {/* Internal Links */}
        <FadeIn delay={0.35} className="mt-12">
          <div className="bg-[#0D0F12] border border-[#2A2E37] rounded-xl p-8">
            <h2 className="text-lg font-black text-white uppercase mb-2">Explore Our Spare Parts Catalogue</h2>
            <p className="text-gray-400 text-sm mb-5">Browse parts by brand or category — all stocked and ready for same-day dispatch from New Delhi.</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "CAT Grader Parts", href: "/brands/cat" },
                { label: "Komatsu Parts", href: "/brands/komatsu" },
                { label: "SDLG Parts", href: "/brands/sdlg" },
                { label: "Cutting Edges", href: "/products/cutting-edges" },
                { label: "Scarifier Teeth", href: "/products/scarifier-teeth" },
                { label: "End Bits", href: "/products/end-bits" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="text-sm font-bold text-gray-300 hover:text-[#F5A623] border border-[#2A2E37] hover:border-[#F5A623]/40 px-4 py-2 rounded-lg transition-colors">
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </div>
  );
}
