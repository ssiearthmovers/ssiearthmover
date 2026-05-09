import { Link, useLocation } from "wouter";
import { Phone, Mail, MapPin, Download } from "lucide-react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { brands, productCategories, PHONE1, PHONE2, EMAIL, ADDRESS_SHORT } from "@/lib/siteData";

export default function SiteFooter() {
  const [, navigate] = useLocation();

  const goHome = (hash: string) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="bg-[#0A0B0E] pt-16 pb-8 border-t border-[#2A2E37]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-black text-white uppercase mb-5 inline-block">
            Shiv Shakti <span className="text-[#F5A623]">International</span>
          </Link>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-xs">India's premier supplier of premium motor grader spare parts. Keeping your machinery moving for 30+ years.</p>
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

        {/* Products */}
        <div>
          <h4 className="text-sm font-black mb-5 text-white uppercase tracking-widest">Products</h4>
          <ul className="flex flex-col gap-2.5 text-gray-500 text-sm">
            {productCategories.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="hover:text-[#F5A623] transition-colors">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands */}
        <div>
          <h4 className="text-sm font-black mb-5 text-white uppercase tracking-widest">Brands</h4>
          <ul className="flex flex-col gap-2.5 text-gray-500 text-sm">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/brands/${b.slug}`} className="hover:text-[#F5A623] transition-colors">
                  {b.fullName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-black mb-5 text-white uppercase tracking-widest">Contact</h4>
          <ul className="flex flex-col gap-4 text-gray-500 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <span>{ADDRESS_SHORT}</span>
            </li>
            <li className="flex gap-3 items-start">
              <Phone className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href={`tel:${PHONE1}`} className="hover:text-[#F5A623] transition-colors">{PHONE1}</a>
                <a href="tel:01149324607" className="hover:text-[#F5A623] transition-colors">{PHONE2}</a>
              </div>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
              <a href={`mailto:${EMAIL}`} className="hover:text-[#F5A623] transition-colors">{EMAIL}</a>
            </li>
            <li>
              <a
                href="/ssi-catalogue.pdf"
                download="SSI-Earthmovers-Catalogue.pdf"
                className="flex items-center gap-2 text-[#F5A623] font-bold hover:brightness-125 transition-all text-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download Catalogue
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-[#2A2E37] flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 text-xs">
        <span>&copy; {new Date().getFullYear()} Shiv Shakti International. All rights reserved.</span>
        <div className="flex gap-4">
          <button onClick={() => goHome("about")} className="hover:text-gray-400 transition-colors">About</button>
          <button onClick={() => goHome("contact")} className="hover:text-gray-400 transition-colors">Contact</button>
          <span>Designed for the heavy machinery industry of India</span>
        </div>
      </div>
    </footer>
  );
}
