import { useState, useEffect, useCallback, useRef } from "react";
import {
  IndianRupee, Users, FileText, AlertTriangle, CheckCircle2, Clock,
  Plus, Search, X, ChevronRight, Printer, ArrowLeft, LogOut,
  TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff, Banknote,
  CreditCard, Phone, Building2, Calendar, Hash, Package,
  ReceiptText, CircleDollarSign, BadgeAlert,
} from "lucide-react";

/* ── Constants ──────────────────────────────────────────────────────────── */
const API = "/api";
const AUTH_KEY = "ssi_admin_auth";

/* ── Types ──────────────────────────────────────────────────────────────── */
interface AuthInfo { token: string; role: string; name: string; }

interface Customer {
  id: number; name: string; company: string | null; phone: string;
  email: string | null; gstin: string | null; address: string | null;
  city: string | null; state: string | null; creditLimit: number;
  notes: string | null; createdAt: string; outstanding?: number;
}

interface InvoiceItem {
  id: number; invoiceId: number; productId: number | null;
  partNumber: string | null; partName: string;
  quantity: number; unitPrice: number; amount: number;
}

interface Invoice {
  id: number; invoiceNumber: string; customerId: number;
  customerName: string; customerCompany: string | null;
  customerPhone: string | null; customerGstin: string | null;
  customerAddress: string | null;
  invoiceDate: string; dueDate: string | null;
  status: string; subtotal: number; taxPercent: number;
  taxAmount: number; totalAmount: number; paidAmount: number;
  deductStock: boolean; notes: string | null; createdAt: string;
  items?: InvoiceItem[];
  payments?: Payment[];
}

interface Payment {
  id: number; invoiceId: number; customerId: number; amount: number;
  paymentDate: string; paymentMethod: string;
  referenceNumber: string | null; notes: string | null; createdAt: string;
}

interface DraftItem {
  productId: number | null; partNumber: string; partName: string;
  quantity: number; unitPrice: number;
}

interface Summary {
  totalBilled: number; totalCollected: number; totalOutstanding: number; totalOverdue: number;
  counts: { unpaid: number; partial: number; paid: number; overdue: number; total: number };
  topDebtors: Array<{ customerId: number; name: string; company: string | null; outstanding: number }>;
  recentOverdue: Array<{
    id: number; invoiceNumber: string; customerName: string;
    totalAmount: number; paidAmount: number; outstanding: number;
    dueDate: string; daysOverdue: number;
  }>;
}

interface SearchProduct {
  id: number; partNumber: string; name: string;
  brand: string | null; model: string | null; unit: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function fmt(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function authH(token: string) { return { Authorization: `Bearer ${token}` }; }

const STATUS_STYLES: Record<string, string> = {
  paid:    "bg-green-500/15 text-green-400 border border-green-500/30",
  partial: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  unpaid:  "bg-red-500/15 text-red-400 border border-red-500/30",
  overdue: "bg-rose-600/20 text-rose-400 border border-rose-500/40",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[status] ?? STATUS_STYLES["unpaid"]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: (i: AuthInfo) => void }) {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u.trim(), password: p }),
      });
      const d = await r.json() as { token?: string; role?: string; name?: string; error?: string };
      if (!r.ok) { setErr(d.error ?? "Login failed"); return; }
      if (d.token) {
        const info: AuthInfo = { token: d.token, role: d.role ?? "admin", name: d.name ?? u };
        localStorage.setItem(AUTH_KEY, JSON.stringify(info));
        onLogin(info);
      }
    } catch { setErr("Network error."); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-[#0A0B0E] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/30 mb-4">
            <ReceiptText className="w-8 h-8 text-[#F5A623]" />
          </div>
          <h1 className="text-2xl font-black text-white">Ledger & Credit</h1>
          <p className="text-gray-500 text-sm mt-1">SSI Earthmovers — Admin Access</p>
        </div>
        <form onSubmit={submit} className="bg-[#13151A] border border-[#2A2E37] rounded-2xl p-6 flex flex-col gap-4">
          <input value={u} onChange={e => setU(e.target.value)} placeholder="Username"
            className="bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F5A623]" />
          <div className="relative">
            <input type={show ? "text" : "password"} value={p} onChange={e => setP(e.target.value)} placeholder="Password"
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F5A623] pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-500">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {err && <p className="text-red-400 text-xs text-center">{err}</p>}
          <button disabled={loading} className="bg-[#F5A623] text-black font-black py-3 rounded-lg text-sm hover:brightness-110 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PRINT INVOICE
══════════════════════════════════════════════════════════════════════════ */
function PrintInvoice({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  useEffect(() => { setTimeout(() => window.print(), 300); }, []);
  return (
    <div className="fixed inset-0 z-[300] bg-black/90 overflow-y-auto p-4">
      <div className="no-print flex justify-between mb-4 max-w-2xl mx-auto">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#F5A623] text-black px-4 py-2 rounded font-bold text-sm">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>
      <div id="print-invoice" className="bg-white text-black max-w-2xl mx-auto rounded-xl p-8 print:rounded-none print:shadow-none">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0A0B0E]">SSI EARTHMOVERS</h1>
            <p className="text-xs text-gray-500">Shiv Shakti International</p>
            <p className="text-xs text-gray-500 mt-1">Nicholson Road, Near Mori Gate, New Delhi – 110006</p>
            <p className="text-xs text-gray-500">+91-9953105738 | ssiearthmovers@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#F5A623]">INVOICE</p>
            <p className="text-sm font-bold text-gray-700 mt-1">{invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-500">Date: {fmtDate(invoice.invoiceDate)}</p>
            {invoice.dueDate && <p className="text-xs text-gray-500">Due: {fmtDate(invoice.dueDate)}</p>}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Bill To</p>
          <p className="font-black text-lg">{invoice.customerName}</p>
          {invoice.customerCompany && <p className="text-sm text-gray-600">{invoice.customerCompany}</p>}
          {invoice.customerPhone && <p className="text-sm text-gray-600">{invoice.customerPhone}</p>}
          {invoice.customerGstin && <p className="text-sm text-gray-600">GSTIN: {invoice.customerGstin}</p>}
          {invoice.customerAddress && <p className="text-sm text-gray-600">{invoice.customerAddress}</p>}
        </div>
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-3 font-bold text-gray-600 rounded-tl-lg">#</th>
              <th className="text-left py-2 px-3 font-bold text-gray-600">Part / Description</th>
              <th className="text-right py-2 px-3 font-bold text-gray-600">Qty</th>
              <th className="text-right py-2 px-3 font-bold text-gray-600">Rate</th>
              <th className="text-right py-2 px-3 font-bold text-gray-600 rounded-tr-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items ?? []).map((it, i) => (
              <tr key={it.id} className="border-b border-gray-100">
                <td className="py-2 px-3 text-gray-500">{i + 1}</td>
                <td className="py-2 px-3">
                  <p className="font-semibold">{it.partName}</p>
                  {it.partNumber && <p className="text-xs text-gray-500">{it.partNumber}</p>}
                </td>
                <td className="py-2 px-3 text-right">{it.quantity}</td>
                <td className="py-2 px-3 text-right">{fmt(it.unitPrice)}</td>
                <td className="py-2 px-3 text-right font-semibold">{fmt(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1 text-sm"><span className="text-gray-500">Subtotal</span><span>{fmt(invoice.subtotal)}</span></div>
            <div className="flex justify-between py-1 text-sm"><span className="text-gray-500">GST ({invoice.taxPercent}%)</span><span>{fmt(invoice.taxAmount)}</span></div>
            <div className="flex justify-between py-2 text-base font-black border-t border-gray-200 mt-1">
              <span>Total</span><span className="text-[#F5A623]">{fmt(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm text-green-600"><span>Paid</span><span>{fmt(invoice.paidAmount)}</span></div>
            <div className="flex justify-between py-2 text-base font-black border-t border-gray-200">
              <span>Balance Due</span><span className="text-red-600">{fmt(invoice.totalAmount - invoice.paidAmount)}</span>
            </div>
          </div>
        </div>
        {invoice.notes && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Thank you for your business! For queries: +91-9953105738 | ssiearthmovers@gmail.com
        </div>
      </div>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAYMENT MODAL
══════════════════════════════════════════════════════════════════════════ */
function PaymentModal({ invoice, token, onClose, onDone }: {
  invoice: Invoice; token: string; onClose: () => void; onDone: () => void;
}) {
  const balance = invoice.totalAmount - invoice.paidAmount;
  const [amount, setAmount] = useState(String(Math.round(balance / 100)));
  const [method, setMethod] = useState("cash");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr("");
    const amtPaise = Math.round(parseFloat(amount) * 100);
    if (!amtPaise || amtPaise <= 0) { setErr("Enter a valid amount"); setLoading(false); return; }
    try {
      const r = await fetch(`${API}/ledger/invoices/${invoice.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authH(token) },
        body: JSON.stringify({ amount: amtPaise, paymentMethod: method, referenceNumber: ref, notes, paymentDate: date }),
      });
      if (!r.ok) { const d = await r.json() as { error?: string }; setErr(d.error ?? "Failed"); return; }
      onDone();
    } catch { setErr("Network error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#13151A] border border-[#2A2E37] rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-black text-lg">Record Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-[#1A1D24] rounded-xl p-4 mb-5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Invoice</p>
            <p className="text-white font-bold">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Balance Due</p>
            <p className="text-[#F5A623] font-black text-lg">{fmt(balance)}</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Amount (₹)</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]">
              {["cash","upi","bank-transfer","cheque","neft","rtgs"].map(m => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Reference / UTR #</label>
            <input value={ref} onChange={e => setRef(e.target.value)} placeholder="Optional"
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional"
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]" />
          </div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#2A2E37] text-gray-400 rounded-lg py-2.5 text-sm hover:bg-[#1A1D24]">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#F5A623] text-black font-black rounded-lg py-2.5 text-sm hover:brightness-110 disabled:opacity-60">
              {loading ? "Saving…" : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CREATE INVOICE MODAL
══════════════════════════════════════════════════════════════════════════ */
function CreateInvoiceModal({ customers, token, onClose, onDone }: {
  customers: Customer[]; token: string; onClose: () => void; onDone: () => void;
}) {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(18);
  const [notes, setNotes] = useState("");
  const [deductStock, setDeductStock] = useState(true);
  const [items, setItems] = useState<DraftItem[]>([{ productId: null, partNumber: "", partName: "", quantity: 1, unitPrice: 0 }]);
  const [partSearch, setPartSearch] = useState<Record<number, string>>({});
  const [partResults, setPartResults] = useState<Record<number, SearchProduct[]>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const searchParts = (idx: number, q: string) => {
    setPartSearch(prev => ({ ...prev, [idx]: q }));
    clearTimeout(searchTimeout.current);
    if (!q.trim()) { setPartResults(prev => ({ ...prev, [idx]: [] })); return; }
    searchTimeout.current = setTimeout(async () => {
      const r = await fetch(`${API}/products/search?q=${encodeURIComponent(q)}&limit=10`);
      const d = await r.json() as SearchProduct[];
      setPartResults(prev => ({ ...prev, [idx]: d }));
    }, 300);
  };

  const selectPart = (idx: number, p: SearchProduct) => {
    setItems(prev => prev.map((it, i) => i === idx
      ? { ...it, productId: p.id, partNumber: p.partNumber, partName: p.name }
      : it
    ));
    setPartSearch(prev => ({ ...prev, [idx]: "" }));
    setPartResults(prev => ({ ...prev, [idx]: [] }));
  };

  const updateItem = (idx: number, field: keyof DraftItem, value: string | number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  };

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const taxAmount = Math.round(subtotal * taxPercent / 100);
  const total = subtotal + taxAmount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) { setErr("Select a customer"); return; }
    if (items.some(it => !it.partName.trim())) { setErr("All items need a part name"); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/ledger/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authH(token) },
        body: JSON.stringify({
          customerId, dueDate: dueDate || null, taxPercent, notes, deductStock,
          items: items.map(it => ({
            productId: it.productId, partNumber: it.partNumber, partName: it.partName,
            quantity: it.quantity, unitPrice: Math.round(it.unitPrice * 100),
          })),
        }),
      });
      if (!r.ok) { const d = await r.json() as { error?: string }; setErr(d.error ?? "Failed"); return; }
      onDone();
    } catch { setErr("Network error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 overflow-y-auto p-4">
      <div className="bg-[#13151A] border border-[#2A2E37] rounded-2xl w-full max-w-2xl mx-auto my-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-black text-xl">New Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* Customer */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Customer *</label>
            <select value={customerId ?? ""} onChange={e => setCustomerId(Number(e.target.value) || null)}
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]">
              <option value="">— Select customer —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
              ))}
            </select>
          </div>

          {/* Dates + Tax */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">GST %</label>
              <select value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))}
                className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]">
                {[0, 5, 12, 18, 28].map(t => <option key={t} value={t}>{t}%</option>)}
              </select>
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Line Items *</label>
            <div className="flex flex-col gap-3">
              {items.map((it, idx) => (
                <div key={idx} className="bg-[#1A1D24] border border-[#2A2E37] rounded-xl p-3">
                  <div className="relative mb-2">
                    <input
                      value={it.partName || partSearch[idx] || ""}
                      onChange={e => { updateItem(idx, "partName", e.target.value); searchParts(idx, e.target.value); }}
                      placeholder="Search part name or number…"
                      className="w-full bg-[#0A0B0E] border border-[#2A2E37] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F5A623] pr-8"
                    />
                    {(partResults[idx]?.length ?? 0) > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 bg-[#1A1D24] border border-[#2A2E37] rounded-lg mt-1 shadow-xl max-h-48 overflow-y-auto">
                        {(partResults[idx] ?? []).map(p => (
                          <button key={p.id} type="button" onClick={() => selectPart(idx, p)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#2A2E37] text-white">
                            <span className="text-[#F5A623] font-mono text-xs mr-2">{p.partNumber}</span>
                            {p.name}
                            {p.brand && <span className="text-gray-500 text-xs ml-1">({p.brand})</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-gray-600 text-xs mb-0.5 block">Part No.</label>
                      <input value={it.partNumber} onChange={e => updateItem(idx, "partNumber", e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-[#0A0B0E] border border-[#2A2E37] text-white rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#F5A623]" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-0.5 block">Qty</label>
                      <input type="number" min="1" value={it.quantity}
                        onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                        className="w-full bg-[#0A0B0E] border border-[#2A2E37] text-white rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#F5A623]" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-0.5 block">Rate (₹)</label>
                      <input type="number" step="0.01" min="0" value={it.unitPrice}
                        onChange={e => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0A0B0E] border border-[#2A2E37] text-white rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#F5A623]" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[#F5A623] text-xs font-bold">
                      = ₹{(it.quantity * it.unitPrice).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setItems(prev => [...prev, { productId: null, partNumber: "", partName: "", quantity: 1, unitPrice: 0 }])}
                className="flex items-center gap-2 text-[#F5A623] text-sm font-bold hover:text-[#F5A623]/80 border border-dashed border-[#F5A623]/30 rounded-lg py-2.5 justify-center hover:bg-[#F5A623]/5">
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-[#1A1D24] rounded-xl p-4 flex flex-col gap-1">
            <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between text-sm text-gray-400"><span>GST ({taxPercent}%)</span><span>₹{taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between text-base font-black text-white border-t border-[#2A2E37] pt-2 mt-1">
              <span>Total</span><span className="text-[#F5A623]">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDeductStock(!deductStock)}
              className={`w-10 h-6 rounded-full transition-colors ${deductStock ? "bg-[#F5A623]" : "bg-[#2A2E37]"}`}>
              <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${deductStock ? "translate-x-4" : ""}`} />
            </button>
            <span className="text-gray-300 text-sm">Deduct from stock inventory automatically</span>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional"
              className="w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623] resize-none" />
          </div>

          {err && <p className="text-red-400 text-sm">{err}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-[#2A2E37] text-gray-400 rounded-lg py-3 text-sm hover:bg-[#1A1D24]">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#F5A623] text-black font-black rounded-lg py-3 text-sm hover:brightness-110 disabled:opacity-60">
              {loading ? "Creating…" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ADD CUSTOMER MODAL
══════════════════════════════════════════════════════════════════════════ */
function AddCustomerModal({ token, onClose, onDone }: { token: string; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", gstin: "", address: "", city: "", state: "", creditLimit: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setErr("Name and phone are required"); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/ledger/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authH(token) },
        body: JSON.stringify({ ...form, creditLimit: Math.round(parseFloat(form.creditLimit || "0") * 100) }),
      });
      if (!r.ok) { const d = await r.json() as { error?: string }; setErr(d.error ?? "Failed"); return; }
      onDone();
    } catch { setErr("Network error."); }
    finally { setLoading(false); }
  };
  const inp = "w-full bg-[#1A1D24] border border-[#2A2E37] text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F5A623]";
  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13151A] border border-[#2A2E37] rounded-2xl w-full max-w-lg my-8 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-black text-lg">Add Customer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Name *</label><input value={form.name} onChange={f("name")} className={inp} /></div>
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Company</label><input value={form.company} onChange={f("company")} className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Phone *</label><input value={form.phone} onChange={f("phone")} className={inp} /></div>
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Email</label><input value={form.email} onChange={f("email")} type="email" className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">GSTIN</label><input value={form.gstin} onChange={f("gstin")} className={inp} /></div>
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Credit Limit (₹)</label><input type="number" value={form.creditLimit} onChange={f("creditLimit")} placeholder="0" className={inp} /></div>
          </div>
          <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Address</label><input value={form.address} onChange={f("address")} className={inp} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">City</label><input value={form.city} onChange={f("city")} className={inp} /></div>
            <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">State</label><input value={form.state} onChange={f("state")} className={inp} /></div>
          </div>
          <div><label className="text-gray-400 text-xs font-bold uppercase mb-1 block">Notes</label><textarea value={form.notes} onChange={f("notes")} rows={2} className={inp + " resize-none"} /></div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#2A2E37] text-gray-400 rounded-lg py-2.5 text-sm hover:bg-[#1A1D24]">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#F5A623] text-black font-black rounded-lg py-2.5 text-sm hover:brightness-110 disabled:opacity-60">
              {loading ? "Saving…" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN LEDGER PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function LedgerPage() {
  const [auth, setAuth] = useState<AuthInfo | null>(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
  });
  const [tab, setTab] = useState<"dashboard" | "customers" | "invoices">("dashboard");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [invFilter, setInvFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    customer: Customer; invoices: Invoice[]; totalBilled: number; totalPaid: number; outstanding: number;
  } | null>(null);

  const loadSummary = useCallback(async (token: string) => {
    const r = await fetch(`${API}/ledger/summary`, { headers: authH(token) });
    if (r.ok) setSummary(await r.json() as Summary);
  }, []);

  const loadCustomers = useCallback(async (token: string) => {
    const q = search.trim();
    const r = await fetch(`${API}/ledger/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`, { headers: authH(token) });
    if (r.ok) setCustomers(await r.json() as Customer[]);
  }, [search]);

  const loadInvoices = useCallback(async (token: string) => {
    const filter = invFilter !== "all" ? `?status=${invFilter}` : "";
    const r = await fetch(`${API}/ledger/invoices${filter}`, { headers: authH(token) });
    if (r.ok) setInvoices(await r.json() as Invoice[]);
  }, [invFilter]);

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    const p = [loadSummary(auth.token), loadCustomers(auth.token), loadInvoices(auth.token)];
    Promise.all(p).finally(() => setLoading(false));
  }, [auth, loadSummary, loadCustomers, loadInvoices]);

  const openCustomer = async (id: number) => {
    if (!auth) return;
    const r = await fetch(`${API}/ledger/customers/${id}`, { headers: authH(auth.token) });
    if (r.ok) {
      const d = await r.json() as { customer: Customer; invoices: Invoice[]; totalBilled: number; totalPaid: number; outstanding: number };
      setSelectedCustomer(d);
    }
  };

  const openInvoice = async (inv: Invoice) => {
    if (!auth) return;
    const r = await fetch(`${API}/ledger/invoices/${inv.id}`, { headers: authH(auth.token) });
    if (r.ok) setSelectedInvoice(await r.json() as Invoice);
    else setSelectedInvoice(inv);
  };

  const refresh = () => {
    if (!auth) return;
    loadSummary(auth.token);
    loadCustomers(auth.token);
    loadInvoices(auth.token);
  };

  if (!auth) return <LoginScreen onLogin={setAuth} />;

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white">
      {/* Print styles */}
      <style>{`@media print { body * { visibility: hidden; } #print-invoice, #print-invoice * { visibility: visible; } #print-invoice { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0B0E]/90 backdrop-blur border-b border-[#1A1D24] px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5A623]/10 flex items-center justify-center border border-[#F5A623]/20">
            <ReceiptText className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div>
            <h1 className="text-white font-black text-base leading-none">Ledger & Credit</h1>
            <p className="text-gray-500 text-xs">SSI Earthmovers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-2 text-gray-500 hover:text-white hover:bg-[#1A1D24] rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowCreateInvoice(true)} className="hidden sm:flex items-center gap-1.5 bg-[#F5A623] text-black font-bold px-3 py-1.5 rounded-lg text-sm hover:brightness-110">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setAuth(null); }} className="p-2 text-gray-500 hover:text-white hover:bg-[#1A1D24] rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1A1D24] px-4 md:px-6">
        <div className="flex gap-1">
          {([["dashboard", "Dashboard", CircleDollarSign], ["customers", "Customers", Users], ["invoices", "Invoices", FileText]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${tab === id ? "border-[#F5A623] text-[#F5A623]" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* ── DASHBOARD TAB ──────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="flex flex-col gap-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Outstanding", value: fmt(summary?.totalOutstanding ?? 0), icon: IndianRupee, color: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
                { label: "Total Overdue", value: fmt(summary?.totalOverdue ?? 0), icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
                { label: "Total Collected", value: fmt(summary?.totalCollected ?? 0), icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
                { label: "Total Invoiced", value: fmt(summary?.totalBilled ?? 0), icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
              ].map(card => (
                <div key={card.label} className="bg-[#13151A] border border-[#1A1D24] rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">{card.label}</p>
                  <p className={`text-xl font-black mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Count pills */}
            {summary && (
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Unpaid", count: summary.counts.unpaid, style: "bg-red-500/10 text-red-400 border-red-500/20" },
                  { label: "Partial", count: summary.counts.partial, style: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                  { label: "Overdue", count: summary.counts.overdue, style: "bg-rose-600/10 text-rose-400 border-rose-500/20" },
                  { label: "Paid", count: summary.counts.paid, style: "bg-green-500/10 text-green-400 border-green-500/20" },
                  { label: "Total", count: summary.counts.total, style: "bg-[#1A1D24] text-gray-300 border-[#2A2E37]" },
                ].map(p => (
                  <div key={p.label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${p.style}`}>
                    <span>{p.label}</span><span>{p.count}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top debtors */}
              <div className="bg-[#13151A] border border-[#1A1D24] rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F5A623]" /> Top Outstanding Accounts
                </h3>
                {(summary?.topDebtors ?? []).length === 0 ? (
                  <p className="text-gray-600 text-sm">No outstanding balances</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(summary?.topDebtors ?? []).map((d, i) => (
                      <div key={d.customerId} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs font-black flex items-center justify-center">{i + 1}</span>
                          <div>
                            <p className="text-white text-sm font-bold">{d.name}</p>
                            {d.company && <p className="text-gray-500 text-xs">{d.company}</p>}
                          </div>
                        </div>
                        <button onClick={() => { openCustomer(d.customerId); setTab("customers"); }}
                          className="text-[#F5A623] font-black text-sm hover:underline">{fmt(d.outstanding)}</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Overdue alerts */}
              <div className="bg-[#13151A] border border-[#1A1D24] rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">
                  <BadgeAlert className="w-4 h-4 text-rose-400" /> Overdue Invoices
                </h3>
                {(summary?.recentOverdue ?? []).length === 0 ? (
                  <p className="text-gray-600 text-sm">No overdue invoices</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {(summary?.recentOverdue ?? []).map(inv => (
                      <div key={inv.id} className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-sm font-bold">{inv.customerName}</p>
                            <p className="text-gray-500 text-xs">{inv.invoiceNumber} · {inv.daysOverdue}d overdue</p>
                          </div>
                          <p className="text-rose-400 font-black text-sm">{fmt(inv.outstanding)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ──────────────────────────────────────────────── */}
        {tab === "customers" && !selectedCustomer && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company, phone, GSTIN…"
                  className="w-full bg-[#13151A] border border-[#1A1D24] text-white rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-[#F5A623]" />
              </div>
              <button onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-2 bg-[#F5A623] text-black font-bold px-4 py-3 rounded-xl text-sm hover:brightness-110">
                <Plus className="w-4 h-4" /> Add Customer
              </button>
            </div>
            {customers.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-bold">No customers yet</p>
                <p className="text-sm mt-1">Add your first customer to get started</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map(c => (
                  <button key={c.id} onClick={() => openCustomer(c.id)}
                    className="bg-[#13151A] border border-[#1A1D24] rounded-2xl p-5 text-left hover:border-[#F5A623]/30 hover:bg-[#13151A]/80 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                        <span className="text-[#F5A623] font-black text-sm">{c.name.charAt(0)}</span>
                      </div>
                      {(c.outstanding ?? 0) > 0 && (
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20">
                          {fmt(c.outstanding ?? 0)} due
                        </span>
                      )}
                    </div>
                    <p className="text-white font-black">{c.name}</p>
                    {c.company && <p className="text-gray-500 text-xs mt-0.5">{c.company}</p>}
                    <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </div>
                    {c.gstin && <p className="text-gray-600 text-xs mt-1">GSTIN: {c.gstin}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1A1D24]">
                      <span className="text-gray-500 text-xs">View Ledger</span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMER DETAIL ────────────────────────────────────────────── */}
        {tab === "customers" && selectedCustomer && (
          <div>
            <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-5 text-sm">
              <ArrowLeft className="w-4 h-4" /> All Customers
            </button>
            <div className="bg-[#13151A] border border-[#1A1D24] rounded-2xl p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-white font-black text-xl">{selectedCustomer.customer.name}</h2>
                  {selectedCustomer.customer.company && <p className="text-gray-400">{selectedCustomer.customer.company}</p>}
                </div>
                <button onClick={() => setShowCreateInvoice(true)}
                  className="flex items-center gap-2 bg-[#F5A623] text-black font-bold px-4 py-2.5 rounded-xl text-sm hover:brightness-110">
                  <Plus className="w-4 h-4" /> New Invoice
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#1A1D24] rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Total Billed</p>
                  <p className="text-white font-black">{fmt(selectedCustomer.totalBilled)}</p>
                </div>
                <div className="bg-[#1A1D24] rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Total Paid</p>
                  <p className="text-green-400 font-black">{fmt(selectedCustomer.totalPaid)}</p>
                </div>
                <div className="bg-[#1A1D24] rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Outstanding</p>
                  <p className={`font-black ${selectedCustomer.outstanding > 0 ? "text-[#F5A623]" : "text-green-400"}`}>{fmt(selectedCustomer.outstanding)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                {selectedCustomer.customer.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedCustomer.customer.phone}</span>}
                {selectedCustomer.customer.gstin && <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{selectedCustomer.customer.gstin}</span>}
                {selectedCustomer.customer.city && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{selectedCustomer.customer.city}{selectedCustomer.customer.state ? `, ${selectedCustomer.customer.state}` : ""}</span>}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">Invoice History</h3>
            <div className="flex flex-col gap-3">
              {selectedCustomer.invoices.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-10">No invoices yet</p>
              ) : selectedCustomer.invoices.map(inv => (
                <div key={inv.id} className="bg-[#13151A] border border-[#1A1D24] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <p className="text-gray-500 text-xs">{fmtDate(inv.invoiceDate)}{inv.dueDate ? ` · Due ${fmtDate(inv.dueDate)}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-black">{fmt(inv.totalAmount)}</p>
                      {inv.paidAmount > 0 && <p className="text-green-400 text-xs">{fmt(inv.paidAmount)} paid</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openInvoice(inv)} className="p-2 bg-[#1A1D24] hover:bg-[#2A2E37] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      {inv.status !== "paid" && (
                        <button onClick={() => { openInvoice(inv).then(() => setShowPayment(true)); }}
                          className="p-2 bg-[#F5A623]/10 hover:bg-[#F5A623]/20 rounded-lg transition-colors">
                          <Banknote className="w-4 h-4 text-[#F5A623]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INVOICES TAB ───────────────────────────────────────────────── */}
        {tab === "invoices" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {["all", "unpaid", "partial", "overdue", "paid"].map(f => (
                  <button key={f} onClick={() => setInvFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${invFilter === f ? "bg-[#F5A623] text-black" : "bg-[#13151A] text-gray-400 hover:text-white border border-[#1A1D24]"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="sm:ml-auto">
                <button onClick={() => setShowCreateInvoice(true)}
                  className="flex items-center gap-2 bg-[#F5A623] text-black font-bold px-4 py-2 rounded-xl text-sm hover:brightness-110">
                  <Plus className="w-4 h-4" /> New Invoice
                </button>
              </div>
            </div>
            {invoices.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-bold">No invoices</p>
              </div>
            ) : (
              <div className="bg-[#13151A] border border-[#1A1D24] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1A1D24]">
                        {["Invoice #", "Customer", "Date", "Due", "Amount", "Paid", "Status", ""].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-gray-500 font-bold text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} className="border-b border-[#1A1D24] hover:bg-[#1A1D24]/50 transition-colors">
                          <td className="py-3 px-4 text-[#F5A623] font-mono font-bold text-xs">{inv.invoiceNumber}</td>
                          <td className="py-3 px-4">
                            <p className="text-white font-semibold">{inv.customerName}</p>
                            {inv.customerCompany && <p className="text-gray-500 text-xs">{inv.customerCompany}</p>}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-xs">{fmtDate(inv.invoiceDate)}</td>
                          <td className="py-3 px-4 text-gray-400 text-xs">{fmtDate(inv.dueDate)}</td>
                          <td className="py-3 px-4 text-white font-bold">{fmt(inv.totalAmount)}</td>
                          <td className="py-3 px-4 text-green-400 text-xs">{inv.paidAmount > 0 ? fmt(inv.paidAmount) : "—"}</td>
                          <td className="py-3 px-4"><StatusBadge status={inv.status} /></td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <button onClick={() => openInvoice(inv)} className="p-1.5 hover:bg-[#2A2E37] rounded-lg transition-colors text-gray-400">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { openInvoice(inv).then(() => setPrintInvoice(inv)); }} className="p-1.5 hover:bg-[#2A2E37] rounded-lg transition-colors text-gray-400">
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              {inv.status !== "paid" && (
                                <button onClick={() => { openInvoice(inv).then(() => setShowPayment(true)); }}
                                  className="p-1.5 hover:bg-[#F5A623]/10 rounded-lg transition-colors text-[#F5A623]">
                                  <Banknote className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── INVOICE DETAIL SIDE PANEL ───────────────────────────────────── */}
      {selectedInvoice && !showPayment && !printInvoice && (
        <div className="fixed inset-0 z-[150] bg-black/70 flex justify-end" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-[#13151A] border-l border-[#2A2E37] w-full max-w-md overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#13151A] border-b border-[#2A2E37] p-4 flex justify-between items-center">
              <div>
                <p className="text-[#F5A623] font-mono font-black">{selectedInvoice.invoiceNumber}</p>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPrintInvoice(selectedInvoice)} className="p-2 hover:bg-[#1A1D24] rounded-lg text-gray-400">
                  <Printer className="w-4 h-4" />
                </button>
                {selectedInvoice.status !== "paid" && (
                  <button onClick={() => setShowPayment(true)} className="flex items-center gap-1.5 bg-[#F5A623] text-black font-bold px-3 py-2 rounded-lg text-xs hover:brightness-110">
                    <Banknote className="w-3.5 h-3.5" /> Pay
                  </button>
                )}
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-[#1A1D24] rounded-lg text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="bg-[#1A1D24] rounded-xl p-4">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Customer</p>
                <p className="text-white font-bold">{selectedInvoice.customerName}</p>
                {selectedInvoice.customerCompany && <p className="text-gray-500 text-sm">{selectedInvoice.customerCompany}</p>}
                {selectedInvoice.customerPhone && <p className="text-gray-500 text-sm">{selectedInvoice.customerPhone}</p>}
                {selectedInvoice.customerGstin && <p className="text-gray-500 text-xs">GSTIN: {selectedInvoice.customerGstin}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1A1D24] rounded-xl p-3"><p className="text-gray-500 text-xs">Date</p><p className="text-white text-sm font-bold">{fmtDate(selectedInvoice.invoiceDate)}</p></div>
                <div className="bg-[#1A1D24] rounded-xl p-3"><p className="text-gray-500 text-xs">Due Date</p><p className="text-white text-sm font-bold">{fmtDate(selectedInvoice.dueDate)}</p></div>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Items</p>
                <div className="flex flex-col gap-2">
                  {(selectedInvoice.items ?? []).map(it => (
                    <div key={it.id} className="bg-[#1A1D24] rounded-lg p-3 flex justify-between">
                      <div><p className="text-white text-sm font-semibold">{it.partName}</p>
                        {it.partNumber && <p className="text-gray-500 text-xs">{it.partNumber}</p>}
                        <p className="text-gray-500 text-xs">{it.quantity} × {fmt(it.unitPrice)}</p>
                      </div>
                      <p className="text-white font-bold text-sm">{fmt(it.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1A1D24] rounded-xl p-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Subtotal</span><span>{fmt(selectedInvoice.subtotal)}</span></div>
                <div className="flex justify-between text-sm text-gray-400 mb-2"><span>GST ({selectedInvoice.taxPercent}%)</span><span>{fmt(selectedInvoice.taxAmount)}</span></div>
                <div className="flex justify-between text-base font-black text-white border-t border-[#2A2E37] pt-2"><span>Total</span><span className="text-[#F5A623]">{fmt(selectedInvoice.totalAmount)}</span></div>
                <div className="flex justify-between text-sm text-green-400 mt-1"><span>Paid</span><span>{fmt(selectedInvoice.paidAmount)}</span></div>
                <div className="flex justify-between text-sm font-black text-rose-400"><span>Balance</span><span>{fmt(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}</span></div>
              </div>
              {(selectedInvoice.payments ?? []).length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase mb-2">Payment History</p>
                  <div className="flex flex-col gap-2">
                    {(selectedInvoice.payments ?? []).map(p => (
                      <div key={p.id} className="bg-[#1A1D24] rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-green-400 font-bold text-sm">{fmt(p.amount)}</p>
                          <p className="text-gray-500 text-xs">{p.paymentMethod.toUpperCase()} · {fmtDate(p.paymentDate)}</p>
                          {p.referenceNumber && <p className="text-gray-600 text-xs">Ref: {p.referenceNumber}</p>}
                        </div>
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddCustomer && (
        <AddCustomerModal token={auth.token} onClose={() => setShowAddCustomer(false)}
          onDone={() => { setShowAddCustomer(false); loadCustomers(auth.token); loadSummary(auth.token); }} />
      )}
      {showCreateInvoice && (
        <CreateInvoiceModal customers={customers} token={auth.token}
          onClose={() => setShowCreateInvoice(false)}
          onDone={() => { setShowCreateInvoice(false); refresh(); }} />
      )}
      {showPayment && selectedInvoice && (
        <PaymentModal invoice={selectedInvoice} token={auth.token}
          onClose={() => setShowPayment(false)}
          onDone={async () => {
            setShowPayment(false);
            const r = await fetch(`${API}/ledger/invoices/${selectedInvoice.id}`, { headers: authH(auth.token) });
            if (r.ok) setSelectedInvoice(await r.json() as Invoice);
            refresh();
          }} />
      )}
      {printInvoice && (
        <PrintInvoice invoice={printInvoice} onClose={() => setPrintInvoice(null)} />
      )}
    </div>
  );
}
