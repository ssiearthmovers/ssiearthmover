import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Search, ArrowRight, Copy, Check, RotateCcw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { brands, WHATSAPP, type BrandPart } from "@/lib/siteData";
import { usePageMeta } from "@/hooks/usePageMeta";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

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

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { void navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }}
      className="ml-1 text-gray-600 hover:text-[#F5A623] transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function FindMyPartPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [partSearch, setPartSearch] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  usePageMeta({
    title: "Find My Motor Grader Part — Part Number Lookup | SSI Earthmovers",
    description: "Select your motor grader brand and model to find compatible spare parts. CAT, Komatsu, CASE, SDLG, Liugong and more. SSI Earthmovers, New Delhi.",
    canonical: "https://ssiearthmovers.in/find-my-part",
  });

  const selectedBrand = useMemo(() => brands.find(b => b.slug === selectedBrandSlug), [selectedBrandSlug]);

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return selectedBrand.models;
  }, [selectedBrand]);

  const availableCats = useMemo(() => {
    if (!selectedBrand) return [];
    const cats = new Set(selectedBrand.parts.map(p => p.category));
    return Array.from(cats);
  }, [selectedBrand]);

  const filteredParts = useMemo<BrandPart[]>(() => {
    if (!selectedBrand) return [];
    let parts = selectedBrand.parts;
    if (selectedModel) {
      parts = parts.filter(p => p.model.toLowerCase().includes(selectedModel.toLowerCase().replace(selectedBrand.name + " ", "").replace(selectedBrand.name, "")));
    }
    if (selectedCat !== "all") {
      parts = parts.filter(p => p.category === selectedCat);
    }
    if (partSearch.trim()) {
      const q = partSearch.trim().toLowerCase();
      parts = parts.filter(p => p.name.toLowerCase().includes(q) || p.partNo.toLowerCase().includes(q));
    }
    return parts;
  }, [selectedBrand, selectedModel, selectedCat, partSearch]);

  const reset = () => {
    setStep(1);
    setSelectedBrandSlug("");
    setSelectedModel("");
    setSelectedCat("all");
    setPartSearch("");
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Ticker */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-[#F5A623] text-black text-xs font-bold overflow-hidden h-9 flex items-center">
        <div className="animate-ticker whitespace-nowrap select-none">
          {[1, 2].map((n) => (
            <span key={n} className="inline-flex items-center gap-8 px-8">
              <span>Select Your Machine — Find Compatible Parts Instantly</span>
              <span className="opacity-40">|</span>
              <span>5,000+ Parts in Stock — Same-Day Dispatch from New Delhi</span>
              <span className="opacity-40">|</span>
              <span>Call: +91-9953105738</span>
              <span className="opacity-40">|</span>
            </span>
          ))}
        </div>
      </div>

      <SiteNavbar />

      <div className="pt-36 pb-20 max-w-5xl mx-auto px-6 md:px-10">

        {/* Page header */}
        <div className="text-center mb-10">
          <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-3">Parts Finder</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase mb-4">Find My Part</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Select your machine brand and model to browse compatible spare parts from our catalogue.</p>
        </div>

        {/* Breadcrumb steps */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {[
            { n: 1, label: "Select Brand" },
            { n: 2, label: "Select Model" },
            { n: 3, label: "Browse Parts" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all
                ${step === s.n ? "bg-[#F5A623]/10 border-[#F5A623]/50 text-[#F5A623]" :
                  step > s.n ? "bg-green-500/10 border-green-500/30 text-green-400" :
                  "bg-[#16181D] border-[#2A2E37] text-gray-500"}`}>
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-black
                  ${step === s.n ? "bg-[#F5A623] text-black" :
                    step > s.n ? "bg-green-500 text-black" : "bg-[#2A2E37] text-gray-400"}`}>
                  {step > s.n ? "✓" : s.n}
                </span>
                {s.label}
                {s.n === 1 && selectedBrand && <span className="text-white font-black"> — {selectedBrand.name}</span>}
                {s.n === 2 && selectedModel && <span className="text-white font-black"> — {selectedModel.replace(selectedBrand?.name + " ", "")}</span>}
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-gray-600" />}
            </div>
          ))}
          {step > 1 && (
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2A2E37] text-gray-500 hover:text-white text-xs font-bold transition-colors">
              <RotateCcw className="w-3 h-3" /> Start Over
            </button>
          )}
        </div>

        {/* Step 1: Brand selection */}
        {step === 1 && (
          <div>
            <p className="text-gray-400 text-sm text-center mb-6">Which brand is your motor grader?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {brands.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => { setSelectedBrandSlug(b.slug); setStep(2); }}
                  className="bg-[#16181D] border-2 border-[#2A2E37] rounded-xl p-5 text-center hover:border-current hover:shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all group"
                  style={{ "--hover-color": b.color } as React.CSSProperties}
                >
                  <div className="text-2xl font-black mb-2 group-hover:scale-110 transition-transform" style={{ color: b.color }}>{b.name}</div>
                  <div className="text-gray-400 text-xs font-semibold mb-1">{b.fullName}</div>
                  <div className="text-gray-600 text-xs">{b.parts.length} parts listed</div>
                  <div className="mt-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1" style={{ color: b.color }}>
                    Select <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Model selection */}
        {step === 2 && selectedBrand && (
          <div>
            <p className="text-gray-400 text-sm text-center mb-6">Which {selectedBrand.fullName} model do you have?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => { setSelectedModel(""); setStep(3); }}
                className="bg-[#16181D] border-2 border-[#2A2E37] rounded-xl p-5 text-center hover:border-[#F5A623]/50 transition-all"
              >
                <div className="text-xl font-black text-[#F5A623] mb-1">All Models</div>
                <div className="text-gray-500 text-xs">Show all {selectedBrand.fullName} parts</div>
              </button>
              {availableModels.map((model) => (
                <button
                  key={model}
                  onClick={() => { setSelectedModel(model); setStep(3); }}
                  className="bg-[#16181D] border-2 border-[#2A2E37] rounded-xl p-5 text-center hover:border-current transition-all"
                  style={{ borderColor: undefined }}
                >
                  <div className="text-xl font-black mb-1" style={{ color: selectedBrand.color }}>
                    {model.replace(selectedBrand.name + " ", "")}
                  </div>
                  <div className="text-gray-400 text-xs font-semibold">{model}</div>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-sm font-bold transition-colors">
                ← Back to Brand Selection
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Parts */}
        {step === 3 && selectedBrand && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search part name or number…"
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 text-sm"
                />
              </div>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer"
              >
                <option value="all">All Categories</option>
                {availableCats.map(c => <option key={c} value={c}>{CAT_BADGE[c]?.label ?? c}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                <span className="font-black text-white">{filteredParts.length}</span> parts found
                {selectedModel && <span> for <span className="text-[#F5A623] font-bold">{selectedModel}</span></span>}
              </p>
              <Link href={`/brands/${selectedBrand.slug}`}
                className="text-xs text-[#F5A623] font-bold hover:underline flex items-center gap-1">
                Full {selectedBrand.fullName} Catalogue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {filteredParts.length === 0 ? (
              <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-12 text-center">
                <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-white font-bold mb-2">No parts found</p>
                <p className="text-gray-500 text-sm">Try clearing the filter or call us directly.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredParts.map((part, i) => {
                  const badge = CAT_BADGE[part.category] ?? CAT_BADGE.general;
                  const waMsg = encodeURIComponent(
                    `Hello SSI Earthmovers,\n\nI need the following part:\n\nPart Name: ${part.name}\nPart No: ${part.partNo}\nMachine: ${part.model}\nBrand: ${selectedBrand.fullName}\n\nPlease confirm availability and pricing.`
                  );
                  return (
                    <div key={`${part.partNo}-${i}`}
                      className="bg-[#16181D] border border-[#2A2E37] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#F5A623]/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-bold text-white text-sm">{part.name}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>{badge.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                          <span className="font-mono font-bold text-[#F5A623]">{part.partNo}<CopyBtn text={part.partNo} /></span>
                          <span>{part.model}</span>
                        </div>
                      </div>
                      {part.img && (
                        <img src={part.img} alt={part.name} className="w-12 h-12 rounded-lg object-cover border border-[#2A2E37] shrink-0" />
                      )}
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap shrink-0"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" /> Enquire
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white text-sm font-bold transition-colors">
                ← Change Model
              </button>
            </div>
          </div>
        )}

        {/* Can't find CTA */}
        <div className="mt-14 bg-[#16181D] border border-[#2A2E37] rounded-xl p-8 text-center">
          <p className="text-white font-bold mb-1">Can't find your part?</p>
          <p className="text-gray-400 text-sm mb-5">Share your OEM part number or machine details via WhatsApp — we'll confirm availability within 2 hours.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`https://wa.me/${WHATSAPP}?text=Hello%20SSI%20Earthmovers%2C%0A%0AI%20need%20a%20spare%20part%20for%20my%20motor%20grader.%20Can%20you%20help%3F`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all">
              <FaWhatsapp size={16} /> WhatsApp Now
            </a>
            <a href="tel:+919953105738"
              className="inline-flex items-center gap-2 border border-[#F5A623]/50 text-[#F5A623] px-6 py-3 rounded-lg font-black text-sm hover:bg-[#F5A623]/10 transition-all">
              Call +91-9953105738
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
