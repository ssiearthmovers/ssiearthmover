import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Download, ChevronDown, Search } from "lucide-react";
import { brands, productCategories } from "@/lib/siteData";

export default function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goHome = (hash: string) => {
    setMobileMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header
      className={`fixed top-9 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0F1014]/97 backdrop-blur-md border-b border-[#2A2E37] py-3"
          : "bg-[#0F1014]/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center gap-6">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-black tracking-tight text-white uppercase shrink-0">
          Shiv Shakti <span className="text-[#F5A623]">International</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-300">

          {/* Products dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded hover:text-[#F5A623] transition-colors"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onClick={() => goHome("products")}
            >
              Products <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {productsOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-64 bg-[#0F1014] border border-[#2A2E37] rounded-lg shadow-2xl py-2 z-50"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                {productCategories.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#1A1D24] transition-colors"
                    onClick={() => setProductsOpen(false)}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Brands dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded hover:text-[#F5A623] transition-colors"
              onMouseEnter={() => setBrandsOpen(true)}
              onMouseLeave={() => setBrandsOpen(false)}
            >
              Brands <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {brandsOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-52 bg-[#0F1014] border border-[#2A2E37] rounded-lg shadow-2xl py-2 z-50"
                onMouseEnter={() => setBrandsOpen(true)}
                onMouseLeave={() => setBrandsOpen(false)}
              >
                {brands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#1A1D24] transition-colors"
                    onClick={() => setBrandsOpen(false)}
                  >
                    {b.fullName}
                    <span className="text-xs text-gray-600 ml-2">{b.models[0]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/find-my-part" className="px-3 py-2 rounded hover:text-[#F5A623] transition-colors">
            Find My Part
          </Link>
          <button onClick={() => goHome("about")} className="px-3 py-2 rounded hover:text-[#F5A623] transition-colors">
            About
          </button>
          <button onClick={() => goHome("contact")} className="px-3 py-2 rounded hover:text-[#F5A623] transition-colors">
            Contact
          </button>
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-all"
            title="Search parts"
          >
            <Search className="w-4 h-4" />
          </Link>
          <a href="tel:+919953105738" className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-[#F5A623] transition-colors">
            <Phone className="w-4 h-4 text-[#F5A623]" />
            +91-9953105738
          </a>
          <a
            href="/ssi-catalogue.pdf"
            download="SSI-Earthmovers-Catalogue.pdf"
            className="flex items-center gap-2 border border-[#F5A623]/50 text-[#F5A623] px-4 py-2 rounded text-sm font-bold hover:bg-[#F5A623]/10 transition-colors"
          >
            <Download className="w-4 h-4" /> Catalogue
          </a>
          <button
            onClick={() => goHome("contact")}
            className="bg-[#F5A623] text-black px-5 py-2 rounded font-black text-sm hover:brightness-110 transition-all"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F1014] border-t border-[#2A2E37] px-6 py-6 flex flex-col gap-1">
          <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2 mt-1">Products</p>
          {productCategories.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="block py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors border-b border-[#1A1D24] text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {p.name}
            </Link>
          ))}
          <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2 mt-4">Brands</p>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="block py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors border-b border-[#1A1D24] text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {b.fullName}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors">
              <Search className="w-4 h-4" /> Search Parts
            </Link>
            <Link href="/find-my-part" onClick={() => setMobileMenuOpen(false)} className="text-left py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors block">Find My Part</Link>
            <button onClick={() => goHome("about")} className="text-left py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors">About</button>
            <button onClick={() => goHome("contact")} className="text-left py-2.5 text-gray-300 font-semibold hover:text-[#F5A623] transition-colors">Contact</button>
            <a
              href="/ssi-catalogue.pdf"
              download="SSI-Earthmovers-Catalogue.pdf"
              className="flex items-center gap-2 text-[#F5A623] font-bold py-2"
            >
              <Download className="w-4 h-4" /> Download Catalogue
            </a>
            <button
              onClick={() => goHome("contact")}
              className="bg-[#F5A623] text-black py-3 rounded font-black text-sm"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
