import { useRef } from "react";
import { Link, useParams } from "wouter";
import { motion, useInView } from "framer-motion";
import { Clock, Tag, ArrowRight, CheckCircle2, Phone, Truck, Package, ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { blogArticles, getBlogArticle, getRelatedArticles, type BlogSection } from "@/lib/blogData";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PHONE1, PHONE2, WHATSAPP } from "@/lib/siteData";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
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

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "h2":
      return (
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-10 mb-4 leading-tight">
          <span className="text-[#F5A623]">{section.text}</span>
        </h2>
      );
    case "h3":
      return <h3 className="text-lg font-black text-white uppercase mt-6 mb-3">{section.text}</h3>;
    case "p":
      return <p className="text-gray-300 leading-relaxed mb-4 text-[15px]">{section.text}</p>;
    case "ul":
      return (
        <ul className="mb-5 space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F5A623] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-5 space-y-2.5 list-none">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] leading-relaxed">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#F5A623]/15 text-[#F5A623] text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "highlight":
      return (
        <div className="my-6 bg-[#F5A623]/8 border border-[#F5A623]/25 rounded-xl px-6 py-5">
          <p className="text-[#F5A623] text-sm font-semibold leading-relaxed">{section.text}</p>
        </div>
      );
    case "cta":
      return (
        <div className="my-8 bg-[#0D0F12] border border-[#2A2E37] rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm leading-relaxed mb-5">{section.text}</p>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello SSI Earthmovers, I need help with motor grader spare parts. Please assist.")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
            <FaWhatsapp className="w-5 h-5" /> WhatsApp Us Now
          </a>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const article = getBlogArticle(params.slug ?? "");
  const related = article ? getRelatedArticles(article.slug) : [];

  const catCls = article ? (CATEGORY_COLORS[article.category] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30") : "";

  usePageMeta({
    title: article?.metaTitle ?? "Blog | SSI Earthmovers",
    description: article?.metaDesc ?? "Expert motor grader spare parts articles from SSI Earthmovers India.",
    canonical: article ? `https://ssiearthmovers.in/blog/${article.slug}` : undefined,
    schema: article ? {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDesc,
      "image": `https://ssiearthmovers.in${article.featuredImage}`,
      "datePublished": article.date,
      "author": { "@type": "Organization", "name": "SSI Earthmovers", "url": "https://ssiearthmovers.in" },
      "publisher": {
        "@type": "Organization",
        "name": "Shiv Shakti International (SSI Earthmovers)",
        "logo": { "@type": "ImageObject", "url": "https://ssiearthmovers.in/favicon.svg" },
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ssiearthmovers.in/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ssiearthmovers.in/blog" },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://ssiearthmovers.in/blog/${article.slug}` },
        ],
      },
    } : undefined,
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-[#16181D] text-white flex flex-col">
        <SiteNavbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32">
          <h1 className="text-4xl font-black mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-8">This article doesn't exist or may have been moved.</p>
          <Link href="/blog" className="bg-[#F5A623] text-black px-8 py-3 rounded font-black hover:brightness-110">
            Back to Blog
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

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

      {/* Article Header */}
      <section className="relative pt-40 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.featuredImage} alt={article.title}
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.15) saturate(0.5)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#16181D]/60 via-transparent to-[#16181D]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#F5A623] transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-gray-400 line-clamp-1">{article.title}</span>
            </nav>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${catCls}`}>{article.category}</span>
              <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Tag className="w-3 h-3" /> {formatDate(article.date)}</span>
              <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Clock className="w-3 h-3" /> {article.readTime} min read</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">{article.title}</h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-5 text-gray-400 text-lg leading-relaxed">{article.excerpt}</p>
          </FadeIn>
        </div>
      </section>

      {/* Article Body */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-8">
        {article.content.map((section, i) => (
          <FadeIn key={i} delay={Math.min(i * 0.03, 0.2)}>
            <RenderSection section={section} />
          </FadeIn>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        <FadeIn>
          <div className="bg-[#F5A623]/8 border border-[#F5A623]/25 rounded-xl p-8 text-center">
            <h2 className="text-xl font-black text-white uppercase mb-2">Need Motor Grader Spare Parts?</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              SSI Earthmovers stocks 5,000+ parts for CAT, Komatsu, CASE, XCMG, SDLG and more. Same-day dispatch from New Delhi. PAN India delivery in 2–5 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello SSI Earthmovers, I need motor grader spare parts. Please help.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
                <FaWhatsapp className="w-5 h-5" /> WhatsApp for Price
              </a>
              <a href="tel:+919953105738"
                className="inline-flex items-center justify-center gap-2 bg-[#F5A623] text-black px-7 py-3.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
                <Phone className="w-4 h-4" /> Call +91-9953105738
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 md:px-10 pb-20">
          <FadeIn>
            <div className="border-t border-[#2A2E37] pt-10">
              <h2 className="text-lg font-black text-white uppercase mb-6">Related Articles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`}
                    className="group bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-5 hover:border-[#F5A623]/40 transition-all">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[rel.category] ?? ""} mb-3 inline-block`}>
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#F5A623] transition-colors mb-2">{rel.title}</h3>
                    <div className="flex items-center gap-1.5 text-[#F5A623] text-xs font-bold">
                      Read more <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Back to Blog */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F5A623] transition-colors text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}
