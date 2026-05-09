import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  LogOut, RefreshCw, Search, Package, AlertTriangle,
  CheckCircle2, XCircle, Plus, Trash2, Edit3, History,
  ChevronDown, X, TrendingDown, TrendingUp, Minus,
  ArrowLeft, MapPin, Box, ShieldCheck, AlertCircle,
  Eye, EyeOff, BarChart3, Tag, ImageOff,
} from "lucide-react";

const API_BASE = "/api";
const AUTH_KEY = "ssi_admin_auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthInfo {
  token: string;
  role: string;
  name: string;
  workerId?: number;
}

interface Product {
  id: number;
  partNumber: string;
  brand: string | null;
  model: string | null;
  name: string;
  description: string | null;
  unit: string;
  rackLocation: string | null;
  photoUrl: string | null;
  quantity: number;
  reorderLevel: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface StockHistoryEntry {
  id: number;
  productId: number;
  previousQty: number;
  newQty: number;
  change: number;
  reason: string | null;
  relatedEnquiryId: number | null;
  actorName: string;
  actorRole: string;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STOCK_STATUSES: { value: string; label: string; tw: string; dot: string; icon?: string }[] = [
  { value: "in-stock",    label: "In Stock",    tw: "bg-green-500/15 text-green-400 border-green-500/30",   dot: "bg-green-400" },
  { value: "low-stock",   label: "Low Stock",   tw: "bg-amber-500/15 text-amber-400 border-amber-500/30",   dot: "bg-amber-400" },
  { value: "out-of-stock",label: "Out of Stock",tw: "bg-red-500/15 text-red-400 border-red-500/30",         dot: "bg-red-400" },
  { value: "reserved",    label: "Reserved",    tw: "bg-violet-500/15 text-violet-400 border-violet-500/30",dot: "bg-violet-400" },
  { value: "dispatched",  label: "Dispatched",  tw: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",dot: "bg-indigo-400" },
];

const UNITS = ["pcs", "set", "pair", "kg", "m", "litre", "box", "roll"];

function getStockStatus(value: string) {
  return STOCK_STATUSES.find((s) => s.value === value) ?? STOCK_STATUSES[0];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StockBadge({ status }: { status: string }) {
  const s = getStockStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.tw} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Product Photo ─────────────────────────────────────────────────────────────

function ProductPhoto({ url, name, size = "sm" }: { url: string | null; name: string; size?: "sm" | "lg" }) {
  const [err, setErr] = useState(false);
  const cls = size === "sm" ? "w-10 h-10 rounded-lg" : "w-20 h-20 rounded-xl";
  if (!url || err) {
    return (
      <div className={`${cls} bg-[#1A1D24] border border-[#2A2E37] flex items-center justify-center shrink-0`}>
        <Package className={`${size === "sm" ? "w-4 h-4" : "w-8 h-8"} text-gray-600`} />
      </div>
    );
  }
  return <img src={url} alt={name} onError={() => setErr(true)} className={`${cls} object-cover shrink-0 border border-[#2A2E37]`} />;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (info: AuthInfo) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json()) as { token?: string; role?: string; name?: string; workerId?: number; error?: string };
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      if (data.token) {
        const info: AuthInfo = { token: data.token, role: data.role ?? "worker", name: data.name ?? username, workerId: data.workerId };
        localStorage.setItem(AUTH_KEY, JSON.stringify(info));
        onLogin(info);
      }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 mb-5">
            <Box className="w-8 h-8 text-[#F5A623]" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Inventory</h1>
          <p className="text-gray-500 mt-2 text-sm">SSI Earthmovers — Stock Management</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-8 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"
              required autoComplete="username"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3.5 text-white placeholder-gray-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password" required autoComplete="current-password"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3.5 text-white placeholder-gray-600 transition-colors pr-12" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#F5A623] text-black py-4 rounded-lg font-black uppercase tracking-wide hover:brightness-110 transition-all disabled:opacity-50">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Product Modal (Add + Edit) ───────────────────────────────────────────────

function ProductModal({ auth, product, onSaved, onClose }: {
  auth: AuthInfo; product?: Product; onSaved: (p: Product) => void; onClose: () => void;
}) {
  const isEdit = !!product;
  const [partNumber, setPartNumber] = useState(product?.partNumber ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [model, setModel] = useState(product?.model ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "pcs");
  const [rackLocation, setRackLocation] = useState(product?.rackLocation ?? "");
  const [photoUrl, setPhotoUrl] = useState(product?.photoUrl ?? "");
  const [quantity, setQuantity] = useState(String(product?.quantity ?? 0));
  const [reorderLevel, setReorderLevel] = useState(String(product?.reorderLevel ?? 5));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { partNumber, name, brand, model, description, unit, rackLocation, photoUrl, quantity: Number(quantity), reorderLevel: Number(reorderLevel) };
    try {
      const res = await fetch(isEdit ? `${API_BASE}/stock/products/${product.id}` : `${API_BASE}/stock/products`, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as Product & { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      onSaved(data); onClose();
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2E37]">
          <h2 className="text-base font-black text-white uppercase tracking-wide">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Part Number *</label>
              <input value={partNumber} onChange={(e) => setPartNumber(e.target.value)} required placeholder="e.g. GRD-001"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-sm cursor-pointer">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Product Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Motor Grader Cutting Edge Blade"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Brand</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. SDLG, Volvo"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Model</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. G9220, 140G"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Rack / Shelf</label>
              <input value={rackLocation} onChange={(e) => setRackLocation(e.target.value)} placeholder="e.g. A-12, B-5"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm font-mono" />
            </div>
            {!isEdit && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Initial Qty</label>
                <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-sm" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Reorder Alert Level <span className="text-gray-600 normal-case font-normal">(alert when stock falls to or below this)</span></label>
            <input type="number" min="0" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)}
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Photo URL <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Description <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              placeholder="Additional details about this part…"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm resize-none" />
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 disabled:opacity-50">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Adjust Stock Modal ───────────────────────────────────────────────────────

function AdjustStockModal({ auth, product, onUpdated, onClose }: {
  auth: AuthInfo; product: Product; onUpdated: (p: Product) => void; onClose: () => void;
}) {
  const [action, setAction] = useState<"add" | "remove" | "set">("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [enquiryId, setEnquiryId] = useState("");
  const [manualStatus, setManualStatus] = useState("auto");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const projected = (() => {
    const n = Number(amount);
    if (isNaN(n) || n < 0) return product.quantity;
    if (action === "add") return product.quantity + n;
    if (action === "remove") return Math.max(0, product.quantity - n);
    return n;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (isNaN(n) || n < 0) { setError("Enter a valid amount"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/stock/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({
          action, amount: n, reason: reason.trim() || undefined,
          relatedEnquiryId: enquiryId ? Number(enquiryId) : null,
          manualStatus: manualStatus === "auto" ? undefined : manualStatus,
        }),
      });
      const data = (await res.json()) as Product & { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed"); return; }
      onUpdated(data); onClose();
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2E37]">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wide">Adjust Stock</h2>
            <p className="text-gray-500 text-xs mt-0.5">{product.name} · {product.partNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-4 bg-[#0D0F12] border-b border-[#2A2E37]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Current Stock</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">{product.quantity}</span>
              <span className="text-gray-500 text-sm">{product.unit}</span>
              <StockBadge status={product.status} />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Action</label>
            <div className="grid grid-cols-3 gap-2">
              {([["add", "Add", "text-green-400"], ["remove", "Remove", "text-red-400"], ["set", "Set to", "text-[#F5A623]"]] as const).map(([v, l, c]) => (
                <button key={v} type="button" onClick={() => setAction(v)}
                  className={`py-2.5 rounded-lg border text-sm font-bold transition-colors ${action === v ? `border-current ${c} bg-current/10` : "border-[#2A2E37] text-gray-500 hover:text-gray-300"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Amount ({product.unit})
            </label>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required
              placeholder="0"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white text-lg font-black text-center" />
            {amount && (
              <p className={`text-center text-sm mt-1.5 font-bold ${projected < product.quantity ? "text-red-400" : projected > product.quantity ? "text-green-400" : "text-gray-400"}`}>
                New quantity: <span className="text-xl">{projected}</span> {product.unit}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Sale, Return, Correction, Received stock"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Enquiry # <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
              <input type="number" min="1" value={enquiryId} onChange={(e) => setEnquiryId(e.target.value)}
                placeholder="e.g. 42"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Override Status</label>
              <select value={manualStatus} onChange={(e) => setManualStatus(e.target.value)}
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-sm cursor-pointer">
                <option value="auto">Auto-compute</option>
                <option value="reserved">Reserved</option>
                <option value="dispatched">Dispatched</option>
              </select>
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold">Cancel</button>
            <button type="submit" disabled={saving || !amount}
              className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 disabled:opacity-50">
              {saving ? "Updating…" : "Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── History Modal ─────────────────────────────────────────────────────────────

function HistoryModal({ auth, product, onClose }: { auth: AuthInfo; product: Product; onClose: () => void }) {
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`${API_BASE}/stock/products/${product.id}/history`, { headers: authHeader(auth.token) })
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data as StockHistoryEntry[] : []))
      .finally(() => setLoading(false));
  }, [product.id, auth.token]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2E37] shrink-0">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wide">Stock History</h2>
            <p className="text-gray-500 text-xs mt-0.5">{product.name} · {product.partNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 text-[#F5A623] animate-spin" /></div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm">No history yet</div>
          ) : (
            <div className="divide-y divide-[#2A2E37]">
              {history.map((h) => (
                <div key={h.id} className="px-6 py-3.5 flex items-start gap-3">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${h.change > 0 ? "bg-green-500/15 text-green-400" : h.change < 0 ? "bg-red-500/15 text-red-400" : "bg-gray-500/15 text-gray-400"}`}>
                    {h.change > 0 ? "+" : ""}{h.change}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-300 font-semibold">{h.previousQty} → {h.newQty} {product.unit}</span>
                      {h.relatedEnquiryId && <span className="text-[10px] bg-[#F5A623]/10 text-[#F5A623] px-1.5 py-0.5 rounded font-bold">Enquiry #{h.relatedEnquiryId}</span>}
                    </div>
                    {h.reason && <p className="text-xs text-gray-400 mt-0.5">{h.reason}</p>}
                    <p className="text-[10px] text-gray-600 mt-0.5">{h.actorName} · {timeAgo(h.createdAt)}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 shrink-0">{formatDate(h.createdAt).split(",")[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Stock Page ───────────────────────────────────────────────────────────

export default function StockPage() {
  const [, navigate] = useLocation();
  const [auth, setAuth] = useState<AuthInfo | null>(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null") as AuthInfo | null; }
    catch { return null; }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async (tok: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/stock/products`, { headers: authHeader(tok) });
      if (res.status === 401) { handleLogout(); return; }
      const data = (await res.json()) as Product[];
      setProducts(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (auth) void fetchProducts(auth.token);
  }, [auth, fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null); setProducts([]);
  };

  const deleteProduct = async (id: number) => {
    if (!auth || !confirm("Delete this product? All stock history will also be deleted. This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/stock/products/${id}`, { method: "DELETE", headers: authHeader(auth.token) });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally { setDeletingId(null); }
  };

  if (!auth) return <LoginScreen onLogin={setAuth} />;

  const isAdmin = auth.role === "admin";

  const filtered = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.partNumber.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q) ||
        (p.model ?? "").toLowerCase().includes(q) ||
        (p.rackLocation ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const inStock = products.filter((p) => p.status === "in-stock").length;
  const lowStock = products.filter((p) => p.status === "low-stock").length;
  const outOfStock = products.filter((p) => p.status === "out-of-stock").length;
  const alerts = lowStock + outOfStock;

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="bg-[#16181D] border-b border-[#2A2E37] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">CRM</span>
            </button>
            <span className="text-[#2A2E37]">|</span>
            <Box className="w-4 h-4 text-[#F5A623]" />
            <span className="font-black text-white tracking-wide">Inventory</span>
            <span className="hidden sm:inline text-gray-600 text-sm">— {auth.name}</span>
            <span className={`hidden sm:inline text-xs rounded px-2 py-0.5 font-bold capitalize ${isAdmin ? "bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30" : "bg-white/5 text-gray-400"}`}>
              {auth.role}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => setAddModal(true)}
                className="flex items-center gap-1.5 bg-[#F5A623] text-black px-4 py-2 rounded-lg font-black text-sm hover:brightness-110 transition-all">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}
            <button onClick={() => auth && void fetchProducts(auth.token)} disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Products", value: products.length, icon: <Package className="w-5 h-5 text-[#F5A623]" />, tw: "border-[#F5A623]/20" },
            { label: "In Stock", value: inStock, icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, tw: "border-green-500/20" },
            { label: "Low Stock", value: lowStock, icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, tw: lowStock > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-[#2A2E37]" },
            { label: "Out of Stock", value: outOfStock, icon: <XCircle className="w-5 h-5 text-red-400" />, tw: outOfStock > 0 ? "border-red-500/30 bg-red-500/5" : "border-[#2A2E37]" },
          ].map((s) => (
            <div key={s.label} className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${s.tw}`}>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{s.icon}</div>
              <div>
                <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Banner */}
        {alerts > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3.5 mb-5 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">
              <span className="font-black">{alerts} item{alerts > 1 ? "s" : ""}</span> need attention —
              {outOfStock > 0 && <span className="text-red-400 font-bold"> {outOfStock} out of stock</span>}
              {outOfStock > 0 && lowStock > 0 && <span className="text-gray-500">, </span>}
              {lowStock > 0 && <span className="text-amber-400 font-bold"> {lowStock} low stock</span>}
              . Filter by status to view.
            </p>
            <div className="flex gap-2 ml-auto">
              {outOfStock > 0 && <button onClick={() => setStatusFilter("out-of-stock")} className="text-xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold hover:bg-red-500/30 transition-colors whitespace-nowrap">Out of Stock</button>}
              {lowStock > 0 && <button onClick={() => setStatusFilter("low-stock")} className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-500/30 transition-colors whitespace-nowrap">Low Stock</button>}
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search part number, name, brand, model, rack…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 transition-colors text-sm" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
              <option value="all">All Status</option>
              {STOCK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          {(search || statusFilter !== "all") && (
            <button onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold whitespace-nowrap">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {(search || statusFilter !== "all") && (
          <p className="text-xs text-gray-600 mb-3">{filtered.length} of {products.length} products</p>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 flex flex-col items-center text-center gap-4">
            <Box className="w-12 h-12 text-gray-600" />
            <div>
              <p className="text-white font-bold text-lg">No products yet</p>
              <p className="text-gray-500 text-sm mt-1">{isAdmin ? "Add your first product using the button above." : "No products have been added to inventory yet."}</p>
            </div>
          </div>
        )}

        {!loading && products.length > 0 && filtered.length === 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-12 text-center">
            <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-white font-bold">No results</p>
            <p className="text-gray-500 text-sm mt-1">Try different search terms or clear the filter.</p>
          </div>
        )}

        {/* Desktop Table */}
        {filtered.length > 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                    <th className="text-left px-4 py-3.5 font-semibold w-12"></th>
                    <th className="text-left px-4 py-3.5 font-semibold">Part #</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Product</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Brand / Model</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Rack</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Qty</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Status</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className={`border-b border-[#2A2E37]/40 hover:bg-white/[0.02] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-4 py-3">
                        <ProductPhoto url={p.photoUrl} name={p.name} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#F5A623] font-bold">{p.partNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white text-sm leading-snug">{p.name}</p>
                        {p.description && <p className="text-gray-500 text-xs mt-0.5 max-w-[160px] truncate">{p.description}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {p.brand && <p className="text-gray-300 text-xs font-semibold">{p.brand}</p>}
                        {p.model && <p className="text-gray-500 text-xs">{p.model}</p>}
                        {!p.brand && !p.model && <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {p.rackLocation ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-[#1A1D24] border border-[#2A2E37] px-2 py-1 rounded">
                            <MapPin className="w-2.5 h-2.5 text-gray-500" /> {p.rackLocation}
                          </span>
                        ) : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg font-black ${p.status === "out-of-stock" ? "text-red-400" : p.status === "low-stock" ? "text-amber-400" : "text-white"}`}>{p.quantity}</span>
                          <span className="text-gray-600 text-xs">{p.unit}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-0.5">Min: {p.reorderLevel}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setAdjustProduct(p)} title="Adjust Stock"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#F5A623] hover:bg-[#F5A623]/10 transition-colors">
                            <BarChart3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setHistoryProduct(p)} title="Stock History"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-sky-400 hover:bg-sky-500/10 transition-colors">
                            <History className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <>
                              <button onClick={() => setEditProduct(p)} title="Edit Product"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { void deleteProduct(p.id); }} disabled={deletingId === p.id} title="Delete Product"
                                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#2A2E37]">
              {filtered.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex gap-3 mb-3">
                    <ProductPhoto url={p.photoUrl} name={p.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs text-[#F5A623] font-black">{p.partNumber}</span>
                        <StockBadge status={p.status} />
                      </div>
                      <p className="font-bold text-white text-sm mt-0.5 leading-snug">{p.name}</p>
                      {(p.brand || p.model) && <p className="text-gray-500 text-xs mt-0.5">{[p.brand, p.model].filter(Boolean).join(" · ")}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wide mb-0.5">Quantity</p>
                      <p className={`text-lg font-black ${p.status === "out-of-stock" ? "text-red-400" : p.status === "low-stock" ? "text-amber-400" : "text-white"}`}>
                        {p.quantity} <span className="text-xs text-gray-600 font-normal">{p.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wide mb-0.5">Min Level</p>
                      <p className="text-sm text-gray-400 font-semibold">{p.reorderLevel} {p.unit}</p>
                    </div>
                    {p.rackLocation && (
                      <div>
                        <p className="text-gray-600 text-[10px] uppercase tracking-wide mb-0.5">Location</p>
                        <p className="text-sm font-mono font-bold text-gray-300">{p.rackLocation}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAdjustProduct(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 text-xs font-bold hover:bg-[#F5A623]/20 transition-colors">
                      <BarChart3 className="w-3.5 h-3.5" /> Adjust
                    </button>
                    <button onClick={() => setHistoryProduct(p)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/20 transition-colors">
                      <History className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => setEditProduct(p)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-400 border border-[#2A2E37] text-xs font-bold hover:bg-white/10 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { void deleteProduct(p.id); }} disabled={deletingId === p.id}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {addModal && <ProductModal auth={auth} onSaved={(p) => setProducts((prev) => [p, ...prev])} onClose={() => setAddModal(false)} />}
      {editProduct && <ProductModal auth={auth} product={editProduct} onSaved={(p) => { setProducts((prev) => prev.map((x) => x.id === p.id ? p : x)); setEditProduct(null); }} onClose={() => setEditProduct(null)} />}
      {adjustProduct && <AdjustStockModal auth={auth} product={adjustProduct} onUpdated={(p) => { setProducts((prev) => prev.map((x) => x.id === p.id ? p : x)); setAdjustProduct(null); }} onClose={() => setAdjustProduct(null)} />}
      {historyProduct && <HistoryModal auth={auth} product={historyProduct} onClose={() => setHistoryProduct(null)} />}
    </div>
  );
}
