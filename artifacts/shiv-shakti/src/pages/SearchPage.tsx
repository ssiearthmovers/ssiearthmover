import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useSearch } from "wouter";
import { Search, X, Filter, ArrowRight, Copy, Check, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { brands, productCategories, WHATSAPP, type BrandPart, type PartCategory } from "@/lib/siteData";
import { usePageMeta } from "@/hooks/usePageMeta";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const API_BASE = "/api";

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


interface SearchResult {
  key: string;
  part: BrandPart;
  brandSlug: string;
  brandName: string;
  brandFullName: string;
  brandColor: string;
  fromDb: boolean;
  dbStatus?: string;
  oemNumber?: string;
}

interface DbProduct {
  id: number;
  partNumber: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string | null;
  oemNumber: string | null;
  description: string | null;
  unit: string;
  status: string;
}

function brandFromName(name: string | null): { slug: string; brandName: string; brandFullName: string; brandColor: string } {
  if (name) {
    const n = name.trim().toLowerCase();
    const match = brands.find(
      (b) => b.name.toLowerCase() === n || b.fullName.toLowerCase() === n || n.includes(b.name.toLowerCase())
    );
    if (match) return { slug: match.slug, brandName: match.name, brandFullName: match.fullName, brandColor: match.color };
  }
  return { slug: "inventory", brandName: name ?? "—", brandFullName: name ?? "Inventory", brandColor: "#F5A623" };
}

function mapDbProduct(p: DbProduct): SearchResult {
  const { slug, brandName, brandFullName, brandColor } = brandFromName(p.brand);
  const part: BrandPart = {
    name: p.name,
    partNo: p.partNumber,
    model: p.model ?? "",
    category: (p.category ?? "general") as PartCategory,
  };
  return {
    key: `db-${p.id}`,
    part,
    brandSlug: slug,
    brandName,
    brandFullName,
    brandColor,
    fromDb: true,
    dbStatus: p.status,
    oemNumber: p.oemNumber ?? undefined,
  };
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { void navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }}
      className="ml-1 text-gray-600 hover:text-[#F5A623] transition-colors"
      title="Copy part number"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function SearchPage() {
  const searchString = useSearch();
  const initialQ = new URLSearchParams(searchString).get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [brandFilter, setBrandFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dbResults, setDbResults] = useState<DbProduct[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  usePageMeta({
    title: "Search Motor Grader Parts by Part Number | SSI Earthmovers India",
    description: "Search 5,000+ motor grader spare parts by part number, brand or model. CAT, Komatsu, CASE, SDLG, Liugong, XCMG and more. SSI Earthmovers, New Delhi.",
    canonical: "https://ssiearthmovers.in/search",
  });

  /* ── Fetch from DB whenever query or filters change ─────────────────────── */
  const fetchDb = useCallback(async (q: string, brand: string, cat: string) => {
    setDbLoading(true);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (q) params.set("q", q);
      if (brand !== "all") params.set("brand", brand);
      if (cat !== "all") params.set("category", cat);
      const r = await fetch(`${API_BASE}/products/search?${params.toString()}`);
      if (r.ok) setDbResults((await r.json()) as DbProduct[]);
    } catch { /* silently fail — static results still show */ }
    finally { setDbLoading(false); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const hasFilters = query.trim() || brandFilter !== "all" || catFilter !== "all";
    if (!hasFilters) { setDbResults([]); return; }
    debounceRef.current = setTimeout(() => {
      void fetchDb(query.trim(), brandFilter, catFilter);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, brandFilter, catFilter, fetchDb]);

  /* ── Static parts ────────────────────────────────────────────────────────── */
  const allStaticParts = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];
    for (const brand of brands) {
      for (const part of brand.parts) {
        results.push({
          key: `static-${brand.slug}-${part.partNo}`,
          part,
          brandSlug: brand.slug,
          brandName: brand.name,
          brandFullName: brand.fullName,
          brandColor: brand.color,
          fromDb: false,
        });
      }
    }
    return results;
  }, []);

  const STOP_WORDS = new Set(["all","part","parts","spare","spares","for","the","a","an","and","or","of","in","to","with","my","buy","near","me","india","delhi","new"]);

  const staticFiltered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(w => w && !STOP_WORDS.has(w));
    return allStaticParts.filter((r) => {
      if (brandFilter !== "all" && r.brandSlug !== brandFilter) return false;
      if (catFilter !== "all" && r.part.category !== catFilter) return false;
      if (!words.length) return true;
      return words.every(word =>
        r.part.partNo.toLowerCase().includes(word) ||
        r.part.name.toLowerCase().includes(word) ||
        r.part.model.toLowerCase().includes(word) ||
        r.brandName.toLowerCase().includes(word) ||
        r.brandFullName.toLowerCase().includes(word)
      );
    });
  }, [allStaticParts, query, brandFilter, catFilter]);

  /* ── Merge DB + static, DB wins on duplicate partNumber ─────────────────── */
  const combined = useMemo<SearchResult[]>(() => {
    const mapped = dbResults.map(mapDbProduct);
    const dbPartNos = new Set(dbResults.map((p) => p.partNumber.toLowerCase()));
    const staticOnly = staticFiltered.filter((r) => !dbPartNos.has(r.part.partNo.toLowerCase()));
    return [...mapped, ...staticOnly];
  }, [dbResults, staticFiltered]);

  const hasFilters = !!(query.trim() || brandFilter !== "all" || catFilter !== "all");
  const showing = hasFilters ? combined : [];

  const uniqueCats = useMemo(() => {
    const cats = new Set<string>();
    allStaticParts.forEach(r => cats.add(r.part.category));
    return Array.from(cats).sort();
  }, [allStaticParts]);

  const dbCount = combined.filter((r) => r.fromDb).length;

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Ticker */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-[#F5A623] text-black text-xs font-bold overflow-hidden h-9 flex items-center">
        <div className="animate-ticker whitespace-nowrap select-none">
          {[1, 2].map((n) => (
            <span key={n} className="inline-flex items-center gap-8 px-8">
              <span>5,000+ Parts Ready for Same-Day Dispatch</span>
              <span className="opacity-40">|</span>
              <span>Search by Part Number, Brand or Machine Model</span>
              <span className="opacity-40">|</span>
              <span>Call: +91-9953105738 | 011-49324607</span>
              <span className="opacity-40">|</span>
            </span>
          ))}
        </div>
      </div>

      <SiteNavbar />

      {/* Search Hero */}
      <section className="pt-36 pb-12 bg-[#0D0F12]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-3">Part Number Lookup</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase mb-4">
            Search Our Parts Catalogue
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Search 500+ listed parts across 10+ brands by part number, name or machine model. Can't find your part? Call us — we likely have it.
          </p>

          {/* Main Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter part number, part name or machine model…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#16181D] border-2 border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-500 text-sm transition-colors"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`mt-4 inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border transition-all ${showFilters ? "border-[#F5A623]/50 text-[#F5A623] bg-[#F5A623]/10" : "border-[#2A2E37] text-gray-400 hover:text-white hover:border-[#3A3E47]"}`}
          >
            <Filter className="w-4 h-4" /> {showFilters ? "Hide Filters" : "Filter by Brand / Category"}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer"
              >
                <option value="all">All Brands</option>
                {brands.map(b => <option key={b.slug} value={b.slug}>{b.fullName}</option>)}
              </select>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer"
              >
                <option value="all">All Categories</option>
                {uniqueCats.map(c => <option key={c} value={c}>{CAT_BADGE[c]?.label ?? c}</option>)}
              </select>
              {hasFilters && (
                <button
                  onClick={() => { setQuery(""); setBrandFilter("all"); setCatFilter("all"); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-20 px-6 md:px-10 max-w-7xl mx-auto">

        {/* Prompt — no search yet */}
        {!hasFilters && (
          <div className="mt-4">
            <p className="text-gray-600 text-xs uppercase tracking-widest text-center mb-8">Browse by Brand</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
              {brands.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setBrandFilter(b.slug)}
                  className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-5 text-center hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all"
                >
                  <div className="text-lg font-black mb-1" style={{ color: b.color }}>{b.name}</div>
                  <div className="text-gray-500 text-xs">{b.parts.length} parts listed</div>
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-xs uppercase tracking-widest text-center mb-6">Browse by Product Category</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {productCategories.map((cat) => (
                <Link key={cat.slug} href={`/products/${cat.slug}`}
                  className="group bg-[#16181D] border border-[#2A2E37] rounded-lg overflow-hidden hover:border-[#F5A623]/50 transition-all block">
                  <div className="h-24 overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-white text-xs mb-1">{cat.name}</p>
                    <span className="text-[#F5A623] text-xs font-bold flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results count + live indicator */}
        {hasFilters && (
          <div className="flex items-center justify-between mb-5 mt-2 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-gray-400">
                {dbLoading
                  ? <span className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F5A623]" /> Searching…</span>
                  : <><span className="font-black text-white">{showing.length}</span> part{showing.length !== 1 ? "s" : ""} found
                    {query && <span className="text-gray-500"> for "<span className="text-[#F5A623]">{query}</span>"</span>}</>
                }
              </p>
              {!dbLoading && dbCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {dbCount} live from inventory
                </span>
              )}
            </div>
            {showing.length > 0 && (
              <p className="text-xs text-gray-600">Tap any part to enquire on WhatsApp</p>
            )}
          </div>
        )}

        {/* No results */}
        {hasFilters && !dbLoading && showing.length === 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 text-center">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="text-white font-bold text-lg mb-2">No parts found</p>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Try a different search term, or call us directly — we may have unlisted stock.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello%20SSI%20Earthmovers%2C%0A%0AI%20am%20looking%20for%20a%20part%20but%20could%20not%20find%20it%20on%20your%20website.%20Can%20you%20help%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all"
            >
              <FaWhatsapp size={16} /> Ask on WhatsApp
            </a>
          </div>
        )}

        {/* Results grid */}
        {hasFilters && showing.length > 0 && (
          <div className="grid gap-3">
            {showing.map((r) => {
              const badge = CAT_BADGE[r.part.category] ?? CAT_BADGE.general;
              const partNoDisplay = r.part.partNo === "—" ? "" : r.part.partNo;
              const waMsg = encodeURIComponent(
                `Hello SSI Earthmovers,\n\nI need the following part:\n\nPart Name: ${r.part.name}\nPart No: ${partNoDisplay || r.oemNumber || "—"}\nMachine: ${r.part.model}\nBrand: ${r.brandFullName}\n\nPlease confirm availability and pricing.`
              );
              return (
                <div key={r.key}
                  className={`bg-[#16181D] border rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#F5A623]/30 transition-all ${r.fromDb ? "border-[#2A2E37] hover:border-green-500/30" : "border-[#2A2E37]"}`}>

                  {/* Brand badge */}
                  <div className="shrink-0">
                    <Link href={`/brands/${r.brandSlug}`}
                      className="inline-block text-xs font-black px-3 py-1.5 rounded border border-current/20 hover:opacity-80 transition-opacity"
                      style={{ color: r.brandColor, background: r.brandColor + "18" }}
                    >
                      {r.brandName}
                    </Link>
                  </div>

                  {/* Part info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-white text-sm">{r.part.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                      {partNoDisplay && (
                        <span className="font-mono font-bold text-[#F5A623]">{partNoDisplay}<CopyBtn text={partNoDisplay} /></span>
                      )}
                      {r.oemNumber && r.oemNumber !== partNoDisplay && (
                        <span className="text-gray-600 font-mono">OEM: {r.oemNumber}</span>
                      )}
                      {r.part.model && <span>{r.part.model}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {r.brandSlug !== "inventory" && (
                      <Link href={`/brands/${r.brandSlug}`}
                        className="text-xs text-gray-500 hover:text-white border border-[#2A2E37] hover:border-[#3A3E47] px-3 py-2 rounded-lg font-bold transition-colors">
                        <span className="hidden sm:inline">View Catalogue</span>
                        <span className="sm:hidden">Catalogue</span>
                      </Link>
                    )}
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" /> Enquire
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {hasFilters && showing.length > 0 && (
          <div className="mt-10 bg-[#16181D] border border-[#2A2E37] rounded-xl p-8 text-center">
            <p className="text-white font-bold mb-2">Can't find your part?</p>
            <p className="text-gray-400 text-sm mb-5">Share the OEM part number via WhatsApp and we'll confirm availability within 2 hours.</p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello%20SSI%20Earthmovers%2C%0A%0AI%20could%20not%20find%20the%20part%20I%20need%20on%20your%20website.%20Can%20you%20help%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all"
            >
              <FaWhatsapp size={16} /> WhatsApp Our Team
            </a>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
