import { Link, useLocation } from "wouter";
import { Phone, Mail, MapPin, Download, Clock, ShieldCheck, Truck, Package, Users } from "lucide-react";
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
    <footer className="bg-[#0A0B0E] border-t border-[#2A2E37]">

      {/* ── Trust Badges Strip ── */}
      <div className="border-b border-[#1A1D24]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, value: "30+ Years",      label: "In Business"              },
            { icon: Package,     value: "5,000+ Parts",   label: "Ready to Ship"            },
            { icon: Truck,       value: "PAN India",      label: "Same-Day Dispatch"        },
            { icon: Users,       value: "500+ Clients",   label: "Road & Mining Contractors" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={value} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <div className="text-white font-black text-sm">{value}</div>
                <div className="text-gray-600 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand + SEO description */}
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-black text-white uppercase mb-5 inline-block">
            Shiv Shakti <span className="text-[#F5A623]">International</span>
          </Link>
          <p className="text-gray-500 mb-3 text-sm leading-relaxed">
            SSI Earthmovers (Shiv Shakti International) is India's premier supplier of motor grader
            spare parts — serving road construction contractors, quarry operators and infrastructure
            agencies for over 30 years from our warehouse near Mori Gate, New Delhi.
          </p>
          <p className="text-gray-600 mb-5 text-xs leading-relaxed">
            We stock cutting edges, grader blades, scarifier teeth, end bits, circle segments,
            draw bar parts, hydraulic cylinders, sprockets, ring gears and braking system components
            for CAT, Komatsu, CASE, XCMG, Leeboy, SANY, SDLG, Liugong, BEML and Mitsubishi motor graders.
            OEM quality. PAN India delivery. Bulk pricing available.
          </p>
          <div className="flex gap-3 mb-5">
            {[
              { icon: FaFacebook,  href: "https://facebook.com", label: "Facebook" },
              { icon: FaLinkedin,  href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaWhatsapp,  href: "https://wa.me/919953105738", label: "WhatsApp" },
              { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-[#1A1D24] border border-[#2A2E37] flex items-center justify-center text-gray-400 hover:bg-[#F5A623] hover:text-black hover:border-[#F5A623] transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2">
            <Link href="/search"
              className="text-xs border border-[#2A2E37] text-gray-400 hover:text-white hover:border-[#3A3E47] px-3 py-1.5 rounded font-bold transition-colors">
              🔍 Search Parts
            </Link>
            <Link href="/find-my-part"
              className="text-xs border border-[#2A2E37] text-gray-400 hover:text-white hover:border-[#3A3E47] px-3 py-1.5 rounded font-bold transition-colors">
              🔧 Find My Part
            </Link>
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

        {/* Contact + Hours */}
        <div>
          <h4 className="text-sm font-black mb-5 text-white uppercase tracking-widest">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-gray-500 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <span className="leading-snug">{ADDRESS_SHORT}</span>
            </li>
            <li className="flex gap-3 items-start">
              <Phone className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href={`tel:${PHONE1}`} className="hover:text-[#F5A623] transition-colors font-semibold">{PHONE1}</a>
                <a href="tel:01149324607" className="hover:text-[#F5A623] transition-colors">{PHONE2}</a>
              </div>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
              <a href={`mailto:${EMAIL}`} className="hover:text-[#F5A623] transition-colors break-all">{EMAIL}</a>
            </li>
            <li className="flex gap-3 items-start">
              <Clock className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-400 font-semibold text-xs mb-0.5">Business Hours</div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  Mon – Sat: 9:30 AM – 6:30 PM<br />
                  Sunday: Closed
                </div>
              </div>
            </li>
            <li>
              <a
                href="/ssi-catalogue.pdf"
                download="SSI-Earthmovers-Catalogue.pdf"
                className="flex items-center gap-2 text-[#F5A623] font-bold hover:brightness-125 transition-all text-sm mt-1"
              >
                <Download className="w-3.5 h-3.5" /> Download Catalogue
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── SEO Footer Text ── */}
      <div className="border-t border-[#1A1D24]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          <p className="text-gray-700 text-xs leading-relaxed max-w-5xl">
            <strong className="text-gray-600">Shiv Shakti International / SSI Earthmovers</strong> — Motor Grader Spare Parts Supplier, Nicholson Road, Near Mori Gate, New Delhi 110006, India.
            Specialists in CAT motor grader parts (120K, 120H, 140H), Komatsu GD511/GD535 spare parts, CASE 845B parts, SDLG 9138/9190 parts, Liugong CG414 parts, XCMG 165 parts,
            Leeboy 785/985 parts, SANY PQ190 parts, BEML 605 parts and Mitsubishi 330 MG parts.
            Product range: cutting edges (Hardox 400/500), grader blades, scarifier teeth, ripper tips, end bits, corner bits, circle segments, draw bar pins,
            ball joints, tie rod ends, sprockets, ring gears (CAT 6G5533), hydraulic cylinders (6E1634), braking system components.
            PAN India delivery to all 28 states. Bulk orders welcome.
          </p>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#1A1D24]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 text-xs">
          <span>&copy; {new Date().getFullYear()} Shiv Shakti International. All rights reserved.</span>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button onClick={() => goHome("about")} className="hover:text-gray-400 transition-colors">About</button>
            <button onClick={() => goHome("contact")} className="hover:text-gray-400 transition-colors">Contact</button>
            <Link href="/search" className="hover:text-gray-400 transition-colors">Part Search</Link>
            <Link href="/find-my-part" className="hover:text-gray-400 transition-colors">Find My Part</Link>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          </div>
          <span className="text-gray-700">New Delhi · India · GST Registered</span>
        </div>
      </div>
    </footer>
  );
}
