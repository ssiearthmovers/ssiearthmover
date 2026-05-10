import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP } from "@/lib/siteData";

export default function FloatingWhatsApp() {
  const msg = encodeURIComponent(
    "Hello SSI Earthmovers,\n\nI am looking for motor grader spare parts. Can you please help me with availability and pricing?"
  );
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 bg-[#25D366] text-white font-black text-sm px-5 py-3.5 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 group"
    >
      <FaWhatsapp className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap">Get Quote</span>
    </a>
  );
}
