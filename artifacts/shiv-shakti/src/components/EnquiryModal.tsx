import { useState } from "react";
import { X, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "/api";

interface Props {
  part: string;
  machine: string;
  whatsappUrl: string;
  onClose: () => void;
}

export default function EnquiryModal({ part, machine, whatsappUrl, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          machine: machine || null,
          part: part || null,
          message: null,
          source: "enquire-button",
        }),
      });
    } catch {
      // continue — WhatsApp will still open
    }
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1A1D24] border border-[#2A2E37] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-[#F5A623] rounded-full" />
            <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">Quick Enquiry</p>
          </div>
          <h3 className="text-lg font-black text-white leading-snug pr-6">{part || "Request a Quote"}</h3>
          {machine && <p className="text-gray-500 text-xs mt-1">{machine}</p>}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1.5">
              Phone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 transition-colors text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-black text-sm hover:brightness-110 transition-all disabled:opacity-60 mt-1"
          >
            <FaWhatsapp size={18} />
            {submitting ? "Opening WhatsApp…" : "Continue to WhatsApp"}
          </button>
          <p className="text-center text-gray-600 text-xs -mt-1">
            Your details are saved so our team can follow up if needed
          </p>
        </form>
      </div>
    </div>
  );
}
