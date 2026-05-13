import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  LogOut, RefreshCw, Search, Phone, ShieldCheck, Eye, EyeOff,
  CheckCircle2, Clock, AlertCircle, Inbox, Users, ClipboardList,
  Plus, Trash2, UserCheck, UserX, Download, ChevronDown, X,
  Bell, MessageSquare, Lock, Send, FileText, ArrowLeft,
  Mail, Zap, Edit3, ChevronRight, Box,
  Package, Upload, AlertTriangle, Database,
  Copy, PhoneCall, Flag, CalendarDays, LayoutDashboard, History,
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

interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  machine: string | null;
  part: string | null;
  message: string | null;
  source: string;
  status: string;
  priority: string;
  assignedToId: number | null;
  assignedToName: string | null;
  followUpDate: string | null;
  lastContactedAt: string | null;
  createdAt: string;
}

interface Worker {
  id: number;
  name: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Reply {
  id: number;
  enquiryId: number;
  authorId: number | null;
  authorName: string;
  authorRole: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

interface Template {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

interface Product {
  id: number;
  partNumber: string;
  brand: string | null;
  model: string | null;
  category: string | null;
  oemNumber: string | null;
  name: string;
  description: string | null;
  unit: string;
  rackLocation: string | null;
  warehouse: string | null;
  warehouseBreakdown?: Record<string, number>;
  quantity: number;
  reorderLevel: number;
  status: string;
  updatedAt: string;
}

interface ImportHistoryItem {
  id: number;
  fileName: string;
  totalRows: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string | null;
  actorName: string;
  createdAt: string;
}

type ImportRow = Record<string, string>;

interface NotificationItem {
  id: number;
  workerId: number | null;
  enquiryId: number | null;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: { value: string; label: string; tw: string; dot: string }[] = [
  { value: "new",            label: "New",            tw: "bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30",      dot: "bg-[#F5A623]" },
  { value: "assigned",       label: "Assigned",       tw: "bg-sky-500/15 text-sky-400 border-sky-500/30",            dot: "bg-sky-400" },
  { value: "in-progress",    label: "In Progress",    tw: "bg-blue-500/15 text-blue-400 border-blue-500/30",         dot: "bg-blue-400" },
  { value: "price-sent",     label: "Price Sent",     tw: "bg-violet-500/15 text-violet-400 border-violet-500/30",   dot: "bg-violet-400" },
  { value: "awaiting-reply", label: "Awaiting Reply", tw: "bg-amber-500/15 text-amber-400 border-amber-500/30",      dot: "bg-amber-400" },
  { value: "order-confirmed",label: "Order Confirmed",tw: "bg-teal-500/15 text-teal-400 border-teal-500/30",         dot: "bg-teal-400" },
  { value: "dispatched",     label: "Dispatched",     tw: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",   dot: "bg-indigo-400" },
  { value: "closed",         label: "Closed",         tw: "bg-gray-500/15 text-gray-400 border-gray-500/30",         dot: "bg-gray-500" },
];

function getStatus(value: string) {
  return STATUSES.find((s) => s.value === value) ?? { value, label: value, tw: "bg-gray-500/15 text-gray-400 border-gray-500/30", dot: "bg-gray-500" };
}

const PRIORITIES: { value: string; label: string; tw: string; icon: string }[] = [
  { value: "normal",  label: "Normal",  tw: "text-gray-400 bg-gray-500/10 border-gray-500/20",    icon: "●" },
  { value: "high",    label: "High",    tw: "text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/30", icon: "▲" },
  { value: "urgent",  label: "Urgent",  tw: "text-red-400 bg-red-500/10 border-red-500/25",        icon: "⚠" },
];

function getPriority(value: string) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[0]!;
}

function PriorityBadge({ priority }: { priority: string }) {
  if (!priority || priority === "normal") return null;
  const p = getPriority(priority);
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black border ${p.tw}`}>
      {p.icon} {p.label}
    </span>
  );
}

function formatFollowUp(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const day = new Date(d); day.setHours(0,0,0,0);
  if (day.getTime() === today.getTime()) return "Today";
  if (day.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (day < today) return "Overdue";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function isFollowUpOverdue(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso); d.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return d < today;
}

function isFollowUpToday(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso); d.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return d.getTime() === today.getTime();
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

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function exportCSV(enquiries: Enquiry[]) {
  const headers = ["ID", "Date", "Name", "Phone", "Email", "Machine", "Part", "Message", "Status", "Assigned To", "Source"];
  const rows = enquiries.map((e) => [
    e.id, formatDate(e.createdAt), e.name, e.phone, e.email ?? "",
    e.machine ?? "", e.part ?? "", (e.message ?? "").replace(/"/g, '""'),
    getStatus(e.status).label, e.assignedToName ?? "", e.source,
  ].map((v) => `"${v}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `ssi-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = getStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.tw} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
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
            <ShieldCheck className="w-8 h-8 text-[#F5A623]" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">SSI CRM</h1>
          <p className="text-gray-500 mt-2 text-sm">Shiv Shakti International — Restricted Access</p>
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

// ─── Notification Bell ─────────────────────────────────────────────────────────

function NotificationBell({ auth, onSelectEnquiry }: { auth: AuthInfo; onSelectEnquiry: (id: number) => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: authHeader(auth.token) });
      if (res.ok) setNotifications((await res.json()) as NotificationItem[]);
    } catch { /* ignore */ }
  }, [auth.token]);

  useEffect(() => {
    void fetchNotifs();
    const iv = setInterval(() => { void fetchNotifs(); }, 30000);
    return () => clearInterval(iv);
  }, [fetchNotifs]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    await fetch(`${API_BASE}/notifications/read-all`, { method: "POST", headers: authHeader(auth.token) });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = async (id: number) => {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH", headers: authHeader(auth.token) });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#F5A623] text-black text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#16181D] border border-[#2A2E37] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2E37]">
            <span className="text-sm font-black text-white">Notifications</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-[#F5A623] hover:underline font-semibold">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-[#2A2E37]/50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">No notifications yet</div>
            ) : notifications.slice(0, 20).map((n) => (
              <button key={n.id}
                onClick={() => { void markRead(n.id); if (n.enquiryId) { onSelectEnquiry(n.enquiryId); setOpen(false); } }}
                className={`w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors flex gap-3 items-start ${!n.isRead ? "bg-[#F5A623]/5" : ""}`}>
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? "bg-[#F5A623]" : "bg-transparent"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${!n.isRead ? "text-white font-semibold" : "text-gray-400"}`}>{n.message}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Enquiry Detail Panel ─────────────────────────────────────────────────────

function EnquiryDetailPanel({
  enquiry: initialEnquiry, auth, workers, allEnquiries, onClose, onUpdate,
}: {
  enquiry: Enquiry; auth: AuthInfo; workers: Worker[];
  allEnquiries: Enquiry[];
  onClose: () => void; onUpdate: (e: Enquiry) => void;
}) {
  const [enquiry, setEnquiry] = useState(initialEnquiry);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // Panel tabs
  const [activeTab, setActiveTab] = useState<"thread" | "history">("thread");

  // Customer history (same phone, different enquiry)
  const customerHistory = (allEnquiries ?? []).filter(
    (e) => e.phone === enquiry.phone && e.id !== enquiry.id
  );

  // Follow-up + priority
  const [followUpInput, setFollowUpInput] = useState<string>(
    enquiry.followUpDate ? new Date(enquiry.followUpDate).toISOString().slice(0,10) : ""
  );
  const [selectedPriority, setSelectedPriority] = useState(enquiry.priority ?? "normal");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [contactedSaving, setContactedSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Stock match for the enquired part
  const [stockMatch, setStockMatch] = useState<{ id: number; partNumber: string; name: string; quantity: number; unit: string; status: string; warehouse?: string | null; warehouseBreakdown?: Record<string, number> } | null | "loading">("loading");

  useEffect(() => {
    if (!enquiry.part) { setStockMatch(null); return; }
    setStockMatch("loading");
    void (async () => {
      try {
        const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(enquiry.part!)}&limit=5`);
        if (!res.ok) { setStockMatch(null); return; }
        const rows = (await res.json()) as { id: number; partNumber: string; name: string; unit: string }[];
        if (rows.length === 0) { setStockMatch(null); return; }
        // fetch stock quantities
        const stockRes = await fetch(`${API_BASE}/stock/products`, { headers: authHeader(auth.token) });
        const stock: { id: number; quantity: number; status: string }[] = stockRes.ok ? (await stockRes.json()) : [];
        const stockMap: Record<number, { quantity: number; status: string }> = {};
        for (const s of stock) stockMap[s.id] = { quantity: s.quantity, status: s.status };
        const best = rows[0]!;
        const info = stockMap[best.id] ?? { quantity: 0, status: "out-of-stock" };
        setStockMatch({ ...best, quantity: info.quantity, status: info.status });
      } catch { setStockMatch(null); }
    })();
  }, [enquiry.part, enquiry.id]);

  // Dispatch + inventory deduction modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchSearch, setDispatchSearch] = useState(enquiry.part ?? "");
  const [dispatchResults, setDispatchResults] = useState<{ id: number; partNumber: string; name: string; quantity: number; unit: string }[]>([]);
  const [dispatchProductId, setDispatchProductId] = useState<number | null>(null);
  const [dispatchQty, setDispatchQty] = useState(1);
  const [dispatchSearching, setDispatchSearching] = useState(false);
  const [dispatchSaving, setDispatchSaving] = useState(false);

  useEffect(() => {
    setEnquiry(initialEnquiry);
  }, [initialEnquiry]);

  useEffect(() => {
    setLoadingReplies(true);
    Promise.all([
      fetch(`${API_BASE}/enquiries/${enquiry.id}/replies`, { headers: authHeader(auth.token) }).then((r) => r.json()),
      fetch(`${API_BASE}/templates`, { headers: authHeader(auth.token) }).then((r) => r.json()),
    ]).then(([repData, tplData]) => {
      setReplies(Array.isArray(repData) ? repData as Reply[] : []);
      setTemplates(Array.isArray(tplData) ? tplData as Template[] : []);
    }).catch(() => {}).finally(() => setLoadingReplies(false));
  }, [enquiry.id, auth.token]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [replies]);

  const sendReply = async () => {
    if (!replyBody.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiry.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ body: replyBody.trim(), isInternal }),
      });
      if (res.ok) {
        const reply = (await res.json()) as Reply;
        setReplies((prev) => [...prev, reply]);
        setReplyBody("");
      }
    } finally { setSending(false); }
  };

  const updateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiry.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { const updated = (await res.json()) as Enquiry; setEnquiry(updated); onUpdate(updated); }
    } finally { setUpdatingStatus(false); }
  };

  const searchDispatchProduct = async (q: string) => {
    if (!q.trim()) { setDispatchResults([]); return; }
    setDispatchSearching(true);
    try {
      const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(q)}&limit=10`);
      if (res.ok) {
        const rows = (await res.json()) as { id: number; partNumber: string; name: string; unit: string }[];
        // fetch quantities via admin stock endpoint
        const stockRes = await fetch(`${API_BASE}/stock/products`, { headers: authHeader(auth.token) });
        const stock: { id: number; quantity: number }[] = stockRes.ok ? (await stockRes.json()) : [];
        const stockMap: Record<number, number> = {};
        for (const s of stock) stockMap[s.id] = s.quantity;
        setDispatchResults(rows.map((r) => ({ ...r, quantity: stockMap[r.id] ?? 0 })));
      }
    } finally { setDispatchSearching(false); }
  };

  const confirmDispatch = async () => {
    setDispatchSaving(true);
    try {
      if (dispatchProductId !== null && dispatchQty > 0) {
        await fetch(`${API_BASE}/stock/products/${dispatchProductId}/stock`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
          body: JSON.stringify({ action: "remove", amount: dispatchQty, reason: `Dispatched for enquiry #${enquiry.id} — ${enquiry.name}`, relatedEnquiryId: enquiry.id }),
        });
      }
      await updateStatus("dispatched");
      setShowDispatchModal(false);
    } finally { setDispatchSaving(false); }
  };

  const assignWorker = async (workerId: number | null, workerName: string | null) => {
    if (auth.role !== "admin") return;
    setAssigning(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiry.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ assignedToId: workerId, assignedToName: workerName }),
      });
      if (res.ok) { const updated = (await res.json()) as Enquiry; setEnquiry(updated); onUpdate(updated); }
    } finally { setAssigning(false); }
  };

  const markContacted = async () => {
    setContactedSaving(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiry.id}/contacted`, {
        method: "PATCH", headers: authHeader(auth.token),
      });
      if (res.ok) { const updated = (await res.json()) as Enquiry; setEnquiry(updated); onUpdate(updated); }
    } finally { setContactedSaving(false); }
  };

  const openWhatsApp = async () => {
    const parts = [enquiry.part, enquiry.machine].filter(Boolean).join(" for ");
    const msg = `Hello ${enquiry.name}, this is SSI Earthmovers. Regarding your enquiry about ${parts || "spare parts"} (Enquiry #${enquiry.id}) — how can we help?`;
    window.open(`https://wa.me/91${enquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    await markContacted();
  };

  const callCustomer = async () => {
    window.open(`tel:${enquiry.phone}`, "_self");
    await markContacted();
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(enquiry.phone).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const saveFollowUp = async () => {
    setSavingFollowUp(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiry.id}/followup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({
          priority: selectedPriority,
          followUpDate: followUpInput ? new Date(followUpInput).toISOString() : null,
        }),
      });
      if (res.ok) { const updated = (await res.json()) as Enquiry; setEnquiry(updated); onUpdate(updated); }
    } finally { setSavingFollowUp(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />
      <div
        className="w-full max-w-xl bg-[#13151A] border-l border-[#2A2E37] flex flex-col h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2E37] bg-[#16181D] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-black text-white text-base leading-none">{enquiry.name}</h2>
              <p className="text-gray-500 text-xs mt-0.5">Enquiry #{enquiry.id} · {formatDate(enquiry.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer info + controls */}
        <div className="px-5 py-4 border-b border-[#2A2E37] bg-[#16181D] shrink-0 space-y-3">
          {/* Contact action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-[#F5A623] font-semibold text-sm">{enquiry.phone}</span>
              {enquiry.lastContactedAt && (
                <span className="text-[10px] text-gray-600 ml-1">
                  · Last: {timeAgo(enquiry.lastContactedAt)}
                </span>
              )}
            </div>
            <button
              onClick={() => void openWhatsApp()}
              disabled={contactedSaving}
              title="Open WhatsApp & mark contacted"
              className="flex items-center gap-1 bg-[#25D366] text-white text-xs font-black px-2.5 py-1.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.556 4.116 1.527 5.845L0 24l6.335-1.504A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.865 0-3.614-.495-5.127-1.362l-.367-.218-3.76.893.924-3.663-.239-.381A9.945 9.945 0 012 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WA
            </button>
            <button
              onClick={() => void callCustomer()}
              disabled={contactedSaving}
              title="Call & mark contacted"
              className="flex items-center gap-1 bg-[#1A1D24] border border-[#2A2E37] text-gray-300 text-xs font-black px-2.5 py-1.5 rounded-lg hover:border-[#F5A623]/40 hover:text-[#F5A623] transition-all disabled:opacity-50"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </button>
            <button
              onClick={copyPhone}
              title="Copy phone number"
              className="flex items-center gap-1 bg-[#1A1D24] border border-[#2A2E37] text-gray-300 text-xs font-black px-2.5 py-1.5 rounded-lg hover:border-[#F5A623]/40 hover:text-[#F5A623] transition-all"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {enquiry.email && (
              <div className="flex items-center gap-2 col-span-2">
                <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <a href={`mailto:${enquiry.email}`} className="text-sky-400 hover:underline truncate text-xs">{enquiry.email}</a>
              </div>
            )}
            {enquiry.machine && (
              <div><span className="text-gray-500 text-xs uppercase tracking-wide block mb-0.5">Machine</span><span className="text-gray-200 text-xs">{enquiry.machine}</span></div>
            )}
            {enquiry.part && (
              <div><span className="text-gray-500 text-xs uppercase tracking-wide block mb-0.5">Part</span><span className="text-gray-200 text-xs">{enquiry.part}</span></div>
            )}
          </div>

          {/* Stock availability card */}
          {enquiry.part && (
            <div className={`rounded-lg border px-3 py-2.5 flex items-center gap-3 ${
              stockMatch === "loading"
                ? "border-[#2A2E37] bg-[#0D0F12]"
                : stockMatch === null
                ? "border-[#2A2E37]/50 bg-[#0D0F12]"
                : stockMatch.status === "in-stock"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : stockMatch.status === "low-stock"
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                stockMatch === "loading" ? "bg-gray-600 animate-pulse"
                : stockMatch === null ? "bg-gray-600"
                : stockMatch.status === "in-stock" ? "bg-emerald-400"
                : stockMatch.status === "low-stock" ? "bg-amber-400"
                : "bg-red-400"
              }`} />
              <div className="flex-1 min-w-0">
                {stockMatch === "loading" && <p className="text-gray-500 text-xs">Checking inventory…</p>}
                {stockMatch === null && <p className="text-gray-500 text-xs">Part not found in inventory</p>}
                {stockMatch && stockMatch !== "loading" && (
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#F5A623]">{stockMatch.partNumber}</span>
                      <span className="text-xs text-gray-300 truncate">{stockMatch.name}</span>
                      <span className={`ml-auto text-xs font-black shrink-0 ${
                        stockMatch.status === "in-stock" ? "text-emerald-400"
                        : stockMatch.status === "low-stock" ? "text-amber-400"
                        : "text-red-400"
                      }`}>
                        {stockMatch.status === "out-of-stock" ? "OUT OF STOCK" : `${stockMatch.quantity} ${stockMatch.unit} total`}
                      </span>
                    </div>
                    {stockMatch.warehouseBreakdown && Object.keys(stockMatch.warehouseBreakdown).length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {(["rai", "rohini", "mori-gate"] as const).map((wh) => {
                          const qty = (stockMatch.warehouseBreakdown as Record<string, number>)[wh];
                          if (qty === undefined) return null;
                          return (
                            <span key={wh} className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              wh === "rai" ? "text-violet-400 bg-violet-500/15 border-violet-500/30"
                              : wh === "rohini" ? "text-sky-400 bg-sky-500/15 border-sky-500/30"
                              : "text-teal-400 bg-teal-500/15 border-teal-500/30"
                            }`}>
                              {wh === "mori-gate" ? "Mori Gate" : wh === "rai" ? "Rai" : "Rohini"}: {qty}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {stockMatch && stockMatch !== "loading" && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  stockMatch.status === "in-stock" ? "bg-emerald-500/20 text-emerald-400"
                  : stockMatch.status === "low-stock" ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
                }`}>
                  {stockMatch.status === "in-stock" ? "IN STOCK" : stockMatch.status === "low-stock" ? "LOW STOCK" : "OUT OF STOCK"}
                </span>
              )}
            </div>
          )}

          {enquiry.message && (
            <div className="bg-[#0D0F12] rounded-lg px-3 py-2.5 text-gray-300 text-sm leading-relaxed border border-[#2A2E37]/50">
              {enquiry.message}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <select value={enquiry.status} disabled={updatingStatus} onChange={(e) => {
                if (e.target.value === "dispatched") {
                  setDispatchSearch(enquiry.part ?? "");
                  setDispatchResults([]);
                  setDispatchProductId(null);
                  setDispatchQty(1);
                  setShowDispatchModal(true);
                } else {
                  void updateStatus(e.target.value);
                }
              }}
                className="appearance-none bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-3 pr-8 py-2 text-white text-xs cursor-pointer font-semibold disabled:opacity-50">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>
            {auth.role === "admin" && (
              <div className="relative">
                <select value={enquiry.assignedToId !== null ? String(enquiry.assignedToId) : ""}
                  disabled={assigning}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) { void assignWorker(null, null); return; }
                    const w = workers.find((w) => String(w.id) === val);
                    if (w) void assignWorker(w.id, w.name);
                  }}
                  className="appearance-none bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-3 pr-8 py-2 text-white text-xs cursor-pointer disabled:opacity-50">
                  <option value="">Unassigned</option>
                  {workers.filter((w) => w.isActive).map((w) => <option key={w.id} value={String(w.id)}>{w.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
            )}
            <StatusBadge status={enquiry.status} />
          </div>

          {/* Priority + Follow-up row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority selector */}
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Priority:</span>
              <div className="flex gap-1">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setSelectedPriority(p.value)}
                    className={`px-2 py-0.5 rounded text-[11px] font-black border transition-all ${selectedPriority === p.value ? p.tw : "text-gray-600 bg-transparent border-transparent hover:border-[#2A2E37]"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-up date */}
            <div className="flex items-center gap-1.5 ml-auto">
              <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Follow-up:</span>
              <input
                type="date"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                className="bg-[#0D0F12] border border-[#2A2E37] text-white text-xs rounded-lg px-2 py-1 outline-none focus:border-[#F5A623] transition-colors"
              />
            </div>

            <button
              onClick={() => void saveFollowUp()}
              disabled={savingFollowUp}
              className="bg-[#F5A623] text-black text-[11px] font-black px-3 py-1.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {savingFollowUp ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Dispatch + Inventory Modal */}
        {showDispatchModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#16181D] border border-[#2A2E37] rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2E37] bg-[#1C1F26]">
                <div>
                  <p className="font-black text-white text-sm">Mark as Dispatched</p>
                  <p className="text-gray-500 text-xs mt-0.5">Optionally deduct from inventory</p>
                </div>
                <button onClick={() => setShowDispatchModal(false)} className="p-1.5 text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="px-5 py-5 flex flex-col gap-4">
                {/* Product search */}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-2">Search Inventory Product</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dispatchSearch}
                      onChange={(e) => setDispatchSearch(e.target.value)}
                      placeholder="Part number or name…"
                      className="flex-1 bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600"
                    />
                    <button
                      onClick={() => void searchDispatchProduct(dispatchSearch)}
                      disabled={dispatchSearching}
                      className="bg-[#F5A623] text-black px-4 py-2 rounded-lg font-bold text-xs hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {dispatchSearching ? "…" : "Search"}
                    </button>
                  </div>
                </div>

                {/* Results */}
                {dispatchResults.length > 0 && (
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                    {dispatchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setDispatchProductId(p.id)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${dispatchProductId === p.id ? "border-[#F5A623] bg-[#F5A623]/10 text-white" : "border-[#2A2E37] bg-[#0D0F12] text-gray-300 hover:border-[#F5A623]/40"}`}
                      >
                        <span className="font-bold text-[#F5A623] mr-2">{p.partNumber}</span>{p.name}
                        <span className="ml-2 text-gray-500">— {p.quantity} {p.unit} in stock</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quantity */}
                {dispatchProductId !== null && (
                  <div>
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-2">Quantity Dispatched</label>
                    <input
                      type="number"
                      min={0}
                      value={dispatchQty}
                      onChange={(e) => setDispatchQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-32 bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <p className="text-gray-600 text-xs mt-1">Set to 0 to skip inventory update.</p>
                  </div>
                )}
              </div>

              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={() => void confirmDispatch()}
                  disabled={dispatchSaving}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {dispatchSaving ? "Saving…" : dispatchProductId !== null && dispatchQty > 0 ? `Dispatch & Deduct ${dispatchQty} unit${dispatchQty !== 1 ? "s" : ""}` : "Mark Dispatched (no stock change)"}
                </button>
                <button onClick={() => setShowDispatchModal(false)} className="px-4 py-3 rounded-xl border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex border-b border-[#2A2E37] bg-[#13151A] shrink-0">
          <button
            onClick={() => setActiveTab("thread")}
            className={`flex items-center gap-1.5 px-5 py-3 text-xs font-black uppercase tracking-wide border-b-2 transition-colors ${activeTab === "thread" ? "border-[#F5A623] text-[#F5A623]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Thread
            {replies.length > 0 && <span className="bg-[#F5A623]/20 text-[#F5A623] text-[10px] px-1.5 py-0.5 rounded-full font-black">{replies.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 px-5 py-3 text-xs font-black uppercase tracking-wide border-b-2 transition-colors ${activeTab === "history" ? "border-[#F5A623] text-[#F5A623]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            <History className="w-3.5 h-3.5" /> History
            {customerHistory.length > 0 && <span className="bg-sky-500/20 text-sky-400 text-[10px] px-1.5 py-0.5 rounded-full font-black">{customerHistory.length}</span>}
          </button>
        </div>

        {/* Conversation thread */}
        {activeTab === "thread" && (
        <div ref={threadRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loadingReplies ? (
            <div className="flex justify-center py-8"><RefreshCw className="w-5 h-5 text-[#F5A623] animate-spin" /></div>
          ) : replies.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No messages yet. Start the conversation below.</p>
            </div>
          ) : replies.map((r) => (
            <div key={r.id} className={`rounded-xl px-4 py-3 border ${r.isInternal ? "bg-amber-500/5 border-amber-500/20" : "bg-[#1C1F26] border-[#2A2E37]"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${r.authorRole === "admin" ? "bg-[#F5A623]/20 text-[#F5A623]" : "bg-white/10 text-gray-300"}`}>
                  {initials(r.authorName)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white">{r.authorName}</span>
                  <span className="text-xs text-gray-600 ml-2 capitalize">{r.authorRole}</span>
                  {r.isInternal && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">Internal Note</span>}
                  {!r.isInternal && <span className="ml-2 text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-bold">To Customer</span>}
                </div>
                <span className="text-[10px] text-gray-600 shrink-0">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}
        </div>
        )}

        {/* Customer history tab */}
        {activeTab === "history" && (
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {customerHistory.length === 0 ? (
            <div className="text-center py-10">
              <History className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No other enquiries from {enquiry.name}.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{customerHistory.length} past enquir{customerHistory.length === 1 ? "y" : "ies"} from {enquiry.phone}</p>
              {customerHistory.map((h) => {
                const st = getStatus(h.status);
                return (
                  <div key={h.id} className="bg-[#1C1F26] border border-[#2A2E37] rounded-xl px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">#{h.id} · {formatDate(h.createdAt)}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${st.tw}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    {h.machine && <p className="text-xs text-gray-300"><span className="text-gray-600">Machine:</span> {h.machine}</p>}
                    {h.part && <p className="text-xs text-gray-300"><span className="text-gray-600">Part:</span> {h.part}</p>}
                    {h.message && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{h.message}</p>}
                    {h.priority && h.priority !== "normal" && <PriorityBadge priority={h.priority} />}
                  </div>
                );
              })}
            </>
          )}
        </div>
        )}

        {/* Reply composer — only on thread tab */}
        {activeTab === "thread" && <div className="px-5 pb-5 pt-3 border-t border-[#2A2E37] bg-[#16181D] shrink-0">
          <div className="flex gap-2 mb-2">
            <button onClick={() => setIsInternal(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!isInternal ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
              <Send className="w-3 h-3" /> To Customer
            </button>
            <button onClick={() => setIsInternal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isInternal ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
              <Lock className="w-3 h-3" /> Internal Note
            </button>
            <div className="flex-1" />
            <div className="relative">
              <button onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-[#F5A623] border border-[#2A2E37] hover:border-[#F5A623]/40 transition-colors">
                <Zap className="w-3 h-3" /> Templates
              </button>
              {showTemplates && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-[#1C1F26] border border-[#2A2E37] rounded-xl shadow-2xl z-10 overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#2A2E37]">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wide">Quick Templates</span>
                  </div>
                  {templates.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-gray-600 text-center">No templates yet</div>
                  ) : templates.map((t) => (
                    <button key={t.id}
                      onClick={() => { setReplyBody(t.body); setShowTemplates(false); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors border-b border-[#2A2E37]/50 last:border-0">
                      <p className="text-xs font-bold text-white">{t.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{t.body}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`rounded-xl border overflow-hidden transition-colors ${isInternal ? "border-amber-500/30" : "border-[#2A2E37] focus-within:border-[#F5A623]/50"}`}>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={isInternal ? "Write an internal note (only visible to team)…" : "Write a reply to the customer…"}
              rows={3}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { void sendReply(); } }}
              className={`w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none ${isInternal ? "bg-amber-500/5" : "bg-[#0D0F12]"}`}
            />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${isInternal ? "border-amber-500/20 bg-amber-500/5" : "border-[#2A2E37] bg-[#0D0F12]"}`}>
              <span className="text-[10px] text-gray-600">Ctrl+Enter to send</span>
              <button onClick={() => { void sendReply(); }} disabled={!replyBody.trim() || sending}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all disabled:opacity-40 ${isInternal ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "bg-[#F5A623] text-black hover:brightness-110"}`}>
                <Send className="w-3 h-3" />
                {sending ? "Sending…" : isInternal ? "Save Note" : "Send Reply"}
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

// ─── Add Worker Modal ──────────────────────────────────────────────────────────

function AddWorkerModal({ token, onCreated, onClose }: { token: string; onCreated: (w: Worker) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [customRole, setCustomRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = role === "custom" ? customRole.trim() : role;
    if (role === "custom" && !customRole.trim()) { setError("Please enter a custom role name."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/workers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify({ name, username, password, role: finalRole }),
      });
      const data = (await res.json()) as Worker & { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to create worker"); return; }
      onCreated(data); onClose();
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Add Team Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: "Full Name", value: name, set: setName, type: "text", ph: "e.g. Ramesh Kumar" },
            { label: "Username", value: username, set: setUsername, type: "text", ph: "e.g. ramesh (no spaces)" },
            { label: "Password", value: password, set: setPassword, type: "password", ph: "Set a password" },
          ].map(({ label, value, set, type, ph }) => (
            <div key={label}>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
              <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={ph} required
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 transition-colors text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white transition-colors text-sm cursor-pointer">
              <option value="worker">Worker</option>
              <option value="operator">Operator</option>
              <option value="sales">Sales</option>
              <option value="dispatch">Dispatch</option>
              <option value="admin">Admin</option>
              <option value="custom">Custom…</option>
            </select>
            {role === "custom" && (
              <input type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Type role name (e.g. Accountant)"
                className="mt-2 w-full bg-[#0D0F12] border border-[#F5A623]/50 focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 transition-colors text-sm" />
            )}
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm font-bold">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? "Creating…" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Workers Panel ─────────────────────────────────────────────────────────────

function WorkersPanel({ auth }: { auth: AuthInfo }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetch$ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workers`, { headers: authHeader(auth.token) });
      const data = (await res.json()) as Worker[];
      setWorkers(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, [auth.token]);

  useEffect(() => { void fetch$(); }, [fetch$]);

  const toggleActive = async (w: Worker) => {
    setTogglingId(w.id);
    try {
      const res = await fetch(`${API_BASE}/workers/${w.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ isActive: !w.isActive }),
      });
      if (res.ok) { const upd = (await res.json()) as Worker; setWorkers((prev) => prev.map((x) => (x.id === upd.id ? upd : x))); }
    } finally { setTogglingId(null); }
  };

  const deleteWorker = async (id: number) => {
    if (!confirm("Delete this team member? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/workers/${id}`, { method: "DELETE", headers: authHeader(auth.token) });
      setWorkers((prev) => prev.filter((w) => w.id !== id));
    } finally { setDeletingId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-white uppercase tracking-wide">Team Members</h2>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#F5A623] text-black px-4 py-2.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-[#F5A623] animate-spin" /></div>
      ) : workers.length === 0 ? (
        <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-12 text-center">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-bold">No team members yet</p>
          <p className="text-gray-500 text-sm mt-1">Add your first team member above.</p>
        </div>
      ) : (
        <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                  {["Name", "Username", "Role", "Status", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={w.id} className={`border-b border-[#2A2E37]/50 hover:bg-white/[0.02] ${i === workers.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-4 font-semibold text-white">{w.name}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">@{w.username}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize ${w.role === "admin" ? "bg-[#F5A623]/15 text-[#F5A623]" : "bg-white/5 text-gray-400"}`}>
                        {w.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${w.isActive ? "text-green-400" : "text-red-400"}`}>
                        {w.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {w.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(w.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { void toggleActive(w); }} disabled={togglingId === w.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 ${w.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                          {w.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => { void deleteWorker(w.id); }} disabled={deletingId === w.id}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-[#2A2E37]">
            {workers.map((w) => (
              <div key={w.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{w.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">@{w.username} · <span className="capitalize">{w.role}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { void toggleActive(w); }} disabled={togglingId === w.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 ${w.isActive ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                    {w.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => { void deleteWorker(w.id); }} disabled={deletingId === w.id}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showAdd && <AddWorkerModal token={auth.token} onCreated={(w) => setWorkers((p) => [...p, w])} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── Templates Panel ───────────────────────────────────────────────────────────

function TemplatesPanel({ auth }: { auth: AuthInfo }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    void fetch(`${API_BASE}/templates`, { headers: authHeader(auth.token) })
      .then((r) => r.json())
      .then((data) => { setTemplates(Array.isArray(data) ? data as Template[] : []); })
      .finally(() => setLoading(false));
  }, [auth.token]);

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/templates`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      if (res.ok) {
        const tpl = (await res.json()) as Template;
        setTemplates((prev) => [...prev, tpl]);
        setTitle(""); setBody(""); setShowForm(false);
      }
    } finally { setSaving(false); }
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/templates/${id}`, { method: "DELETE", headers: authHeader(auth.token) });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } finally { setDeletingId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Quick Reply Templates</h2>
          <p className="text-gray-500 text-sm mt-1">Save common replies to use when responding to enquiries.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#F5A623] text-black px-4 py-2.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>
      {showForm && (
        <form onSubmit={saveTemplate} className="bg-[#16181D] border border-[#F5A623]/30 rounded-xl p-5 mb-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Template Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Price Confirmation"
              required className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Message Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} required
              placeholder="Thank you for your enquiry. We have checked the availability…"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white text-sm font-bold">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 disabled:opacity-50">{saving ? "Saving…" : "Save Template"}</button>
          </div>
        </form>
      )}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-[#F5A623] animate-spin" /></div>
      ) : templates.length === 0 ? (
        <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-bold">No templates yet</p>
          <p className="text-gray-500 text-sm mt-1">Create your first template to speed up replies.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-4 flex flex-col gap-2 hover:border-[#F5A623]/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p className="font-black text-white text-sm">{t.title}</p>
                <button onClick={() => { void deleteTemplate(t.id); }} disabled={deletingId === t.id}
                  className="p-1 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{t.body}</p>
              <p className="text-gray-600 text-[10px]">{formatDate(t.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inventory helpers ────────────────────────────────────────────────────────

function parseImportText(text: string): { rows: ImportRow[]; error: string } {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], error: "Need at least a header row and one data row." };
  const first = lines[0];
  const delim = first.includes("\t") ? "\t" : ",";

  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { current += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === delim && !inQuote) {
        result.push(current.trim()); current = "";
      } else { current += ch; }
    }
    result.push(current.trim());
    return result;
  }

  const FIELD: Record<string, string> = {
    "partnumber": "partNumber", "part_number": "partNumber", "partno": "partNumber",
    "part no": "partNumber", "part": "partNumber", "ssi part no": "partNumber", "ssi part": "partNumber",
    "name": "name", "partname": "name", "part name": "name", "part_name": "name", "description": "description",
    "brand": "brand", "make": "brand", "oem brand": "brand",
    "model": "model", "machine": "model", "machine model": "model", "applicable model": "model",
    "category": "category", "cat": "category", "type": "category",
    "oem": "oemNumber", "oemnumber": "oemNumber", "oem number": "oemNumber", "oemno": "oemNumber",
    "oem no": "oemNumber", "oem part no": "oemNumber", "oem part number": "oemNumber",
    "unit": "unit", "uom": "unit",
    "rack": "rackLocation", "racklocation": "rackLocation", "rack location": "rackLocation",
    "rack_location": "rackLocation", "bin": "rackLocation", "shelf": "rackLocation",
    "quantity": "quantity", "qty": "quantity", "stock": "quantity", "stock qty": "quantity",
    "reorderlevel": "reorderLevel", "reorder level": "reorderLevel", "reorder": "reorderLevel",
    "reorder_level": "reorderLevel", "min stock": "reorderLevel", "min qty": "reorderLevel",
  };

  const rawH = parseLine(first);
  const headers = rawH.map((h) => {
    const k = h.toLowerCase().replace(/['"]/g, "").trim().replace(/\s+/g, " ");
    return FIELD[k] ?? k;
  });

  const rows: ImportRow[] = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = parseLine(line);
    const row: ImportRow = {};
    headers.forEach((f, i) => { if (cols[i] !== undefined && cols[i] !== "") row[f] = cols[i]; });
    if (Object.keys(row).length > 0) rows.push(row);
  }

  if (rows.length === 0) return { rows: [], error: "No valid data rows found." };
  if (!headers.includes("partNumber") && !headers.includes("name")) {
    return { rows, error: "Warning: Could not detect 'Part Number' column. Check your headers." };
  }
  return { rows, error: "" };
}

function stockStatusStyle(status: string) {
  if (status === "in-stock") return { tw: "bg-green-500/15 text-green-400 border-green-500/30", label: "In Stock", dot: "bg-green-400" };
  if (status === "low-stock") return { tw: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Low Stock", dot: "bg-amber-400" };
  if (status === "out-of-stock") return { tw: "bg-red-500/15 text-red-400 border-red-500/30", label: "Out of Stock", dot: "bg-red-400" };
  if (status === "reserved") return { tw: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30", label: "Reserved", dot: "bg-indigo-400" };
  if (status === "dispatched") return { tw: "bg-blue-500/15 text-blue-400 border-blue-500/30", label: "Dispatched", dot: "bg-blue-400" };
  return { tw: "bg-gray-500/15 text-gray-400 border-gray-500/30", label: status, dot: "bg-gray-400" };
}

function downloadImportTemplate() {
  const csv = [
    "Part Number,Name,Brand,Model,Category,OEM Number,Description,Unit,Rack Location,Quantity,Reorder Level",
    "CAT-1R0714,Engine Oil Filter,CAT,140H,Filters,1R-0714,Heavy duty oil filter for motor grader,pcs,A-12,10,3",
    "KOM-421-20-31100,Sprocket Assembly,Komatsu,GD555,Sprockets,421-20-31100,Drive sprocket for tandem,pcs,B-05,5,2",
    "GD140-RH-EB,Right Hand End Bit,Generic,GD140 Series,End Bits,,Bolt-on end bit for grader blade,pcs,C-08,20,5",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ssi-products-import-template.csv";
  a.click();
}

const PREVIEW_COLS = ["partNumber", "name", "brand", "model", "category", "quantity"] as const;

// ─── Inventory Panel ───────────────────────────────────────────────────────────

function InventoryPanel({ auth }: { auth: AuthInfo }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [subTab, setSubTab] = useState<"catalogue" | "rai" | "rohini" | "mori-gate" | "import" | "history">("catalogue");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Stock update modal
  const [stockModal, setStockModal] = useState<{
    product: Product; action: "add" | "remove" | "set"; amount: string; reason: string; warehouse: string;
  } | null>(null);
  const [stockSaving, setStockSaving] = useState(false);
  const [stockError, setStockError] = useState("");

  // Add product modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    partNumber: "", name: "", brand: "", model: "", category: "",
    oemNumber: "", description: "", unit: "pcs", rackLocation: "", warehouse: "", quantity: "0", reorderLevel: "5",
  });
  const activeWarehouse = (["rai", "rohini", "mori-gate"] as const).includes(subTab as "rai" | "rohini" | "mori-gate") ? subTab as "rai" | "rohini" | "mori-gate" : null;
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");

  // Import state
  const [importText, setImportText] = useState("");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    inserted: number; updated: number; skipped: number; errors: string[]; total: number;
  } | null>(null);
  const [importFileName, setImportFileName] = useState("paste-import");
  const [importWarehouse, setImportWarehouse] = useState("");

  // History state
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/stock/products`, { headers: authHeader(auth.token) });
      if (r.ok) setProducts((await r.json()) as Product[]);
    } finally { setLoading(false); }
  }, [auth.token]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const r = await fetch(`${API_BASE}/stock/import-history`, { headers: authHeader(auth.token) });
      if (r.ok) setImportHistory((await r.json()) as ImportHistoryItem[]);
    } finally { setHistoryLoading(false); }
  }, [auth.token]);

  useEffect(() => { void loadProducts(); }, [loadProducts]);
  useEffect(() => { if (subTab === "history") void loadHistory(); }, [subTab, loadHistory]);

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === "in-stock").length,
    lowStock: products.filter((p) => p.status === "low-stock").length,
    outOfStock: products.filter((p) => p.status === "out-of-stock").length,
  };

  const WAREHOUSES = [
    { value: "rai", label: "Rai", color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
    { value: "rohini", label: "Rohini", color: "text-sky-400 bg-sky-500/15 border-sky-500/30" },
    { value: "mori-gate", label: "Mori Gate", color: "text-teal-400 bg-teal-500/15 border-teal-500/30" },
  ];
  const warehouseStyle = (w: string | null) => WAREHOUSES.find((x) => x.value === w) ?? { label: "—", color: "text-gray-500 bg-transparent border-transparent" };

  const filtered = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (activeWarehouse && !((p.warehouseBreakdown ?? {})[activeWarehouse] ?? 0)) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      p.partNumber.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q) ||
      (p.oemNumber ?? "").toLowerCase().includes(q) ||
      (p.rackLocation ?? "").toLowerCase().includes(q)
    );
  });

  const handleStockSave = async () => {
    if (!stockModal) return;
    const amt = parseInt(stockModal.amount, 10);
    if (isNaN(amt) || amt < 0) { setStockError("Enter a valid non-negative number"); return; }
    setStockSaving(true); setStockError("");
    try {
      const r = await fetch(`${API_BASE}/stock/products/${stockModal.product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({
          action: stockModal.action, amount: amt,
          reason: stockModal.reason.trim() || undefined,
          warehouse: stockModal.warehouse || undefined,
        }),
      });
      if (!r.ok) { const d = (await r.json()) as { error?: string }; setStockError(d.error ?? "Failed"); return; }
      const updated = (await r.json()) as Product;
      setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
      setStockModal(null);
    } finally { setStockSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/stock/products/${id}`, { method: "DELETE", headers: authHeader(auth.token) });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally { setDeletingId(null); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setAddSaving(true); setAddError("");
    try {
      const r = await fetch(`${API_BASE}/stock/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({
          ...addForm,
          quantity: parseInt(addForm.quantity, 10) || 0,
          reorderLevel: parseInt(addForm.reorderLevel, 10) || 5,
        }),
      });
      if (!r.ok) { const d = (await r.json()) as { error?: string }; setAddError(d.error ?? "Failed"); return; }
      const created = (await r.json()) as Product;
      setProducts((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAdd(false);
      setAddForm({ partNumber: "", name: "", brand: "", model: "", category: "", oemNumber: "", description: "", unit: "pcs", rackLocation: "", warehouse: "", quantity: "0", reorderLevel: "5" });
    } finally { setAddSaving(false); }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
      const { rows, error } = parseImportText(text);
      setImportRows(rows); setImportError(error); setImportResult(null);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleParseText = () => {
    setImportResult(null);
    const { rows, error } = parseImportText(importText);
    setImportRows(rows); setImportError(error);
  };

  const handleImport = async () => {
    if (!importRows.length) return;
    setImporting(true); setImportResult(null);
    try {
      // Inject the selected warehouse into every row that doesn't already have one
      const rowsToSend = importWarehouse
        ? importRows.map((r) => ({ ...r, warehouse: (r["warehouse"] ?? r["location"] ?? r["Warehouse"] ?? "") || importWarehouse }))
        : importRows;
      const r = await fetch(`${API_BASE}/stock/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ rows: rowsToSend, fileName: importFileName }),
      });
      const result = (await r.json()) as { inserted: number; updated: number; skipped: number; errors: string[]; total: number };
      setImportResult(result);
      if (r.ok) { setImportText(""); setImportRows([]); void loadProducts(); }
    } finally { setImporting(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wide">Inventory Management</h2>
            <p className="text-gray-500 text-sm mt-0.5">Manage stock, import from Excel/CSV, track all changes.</p>
          </div>
          <button onClick={() => void loadProducts()} disabled={loading}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {([
            ["all", "Total Products", stats.total, Database, "text-[#F5A623]", "bg-[#F5A623]/10"],
            ["in-stock", "In Stock", stats.inStock, CheckCircle2, "text-green-400", "bg-green-500/10"],
            ["low-stock", "Low Stock", stats.lowStock, AlertTriangle, "text-amber-400", "bg-amber-500/10"],
            ["out-of-stock", "Out of Stock", stats.outOfStock, AlertCircle, "text-red-400", "bg-red-500/10"],
          ] as const).map(([filter, label, value, Icon, cls, bg]) => (
            <button key={filter}
              onClick={() => { setStatusFilter(statusFilter === filter && filter !== "all" ? "all" : filter); if (!["catalogue","rai","rohini","mori-gate"].includes(subTab)) setSubTab("catalogue"); }}
              className={`rounded-xl p-4 flex items-center gap-3 border transition-all text-left ${statusFilter === filter && filter !== "all" ? "border-[#F5A623]/40 bg-[#F5A623]/5" : "bg-[#16181D] border-[#2A2E37] hover:border-[#3A3E47]"}`}>
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${cls}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Low Stock Alert Banner */}
        {stats.lowStock > 0 && (subTab === "catalogue" || activeWarehouse !== null) && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-300">{stats.lowStock} product{stats.lowStock !== 1 ? "s" : ""} below reorder level — replenishment recommended.</span>
          </div>
        )}
      </div>

      {/* Sub Tabs — top row: main sections */}
      <div className="flex gap-1 mb-2 bg-[#16181D] border border-[#2A2E37] rounded-xl p-1">
        {([
          ["catalogue", "Catalogue", Package],
          ["import", "Import", Upload],
          ["history", "History", FileText],
        ] as const).map(([t, label, Icon]) => {
          const isActive = subTab === t || (t === "catalogue" && activeWarehouse !== null);
          return (
            <button key={t} onClick={() => setSubTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-[#F5A623] text-black" : "text-gray-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" /><span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
      {/* Location pages — only shown when in catalogue section */}
      {(subTab === "catalogue" || activeWarehouse !== null) && (
        <div className="flex gap-1 mb-6 bg-[#0D0F12] border border-[#2A2E37] rounded-xl p-1">
          {([
            ["catalogue", "All Products", "text-gray-300", "border-gray-400/40 bg-gray-400/10"],
            ["rai", "Rai", "text-violet-400", "border-violet-500/40 bg-violet-500/10"],
            ["rohini", "Rohini", "text-sky-400", "border-sky-500/40 bg-sky-500/10"],
            ["mori-gate", "Mori Gate", "text-teal-400", "border-teal-500/40 bg-teal-500/10"],
          ] as const).map(([t, label, textCls, activeCls]) => (
            <button key={t} onClick={() => setSubTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black border transition-all ${subTab === t ? `${activeCls} ${textCls}` : "border-transparent text-gray-600 hover:text-gray-400"}`}>
              {t !== "catalogue" && <span className={`w-2 h-2 rounded-full ${t === "rai" ? "bg-violet-400" : t === "rohini" ? "bg-sky-400" : "bg-teal-400"}`} />}
              {label}
              {t !== "catalogue" && (
                <span className={`ml-1 text-[10px] font-bold opacity-70`}>
                  {products.filter((p) => ((p.warehouseBreakdown ?? {})[t] ?? 0) > 0).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Catalogue / Location Tabs ─────────────────────────────────────── */}
      {(subTab === "catalogue" || activeWarehouse !== null) && (
        <div>
          {/* Location page header banner */}
          {activeWarehouse && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 ${
              activeWarehouse === "rai" ? "bg-violet-500/10 border-violet-500/30"
              : activeWarehouse === "rohini" ? "bg-sky-500/10 border-sky-500/30"
              : "bg-teal-500/10 border-teal-500/30"
            }`}>
              <span className={`w-3 h-3 rounded-full shrink-0 ${activeWarehouse === "rai" ? "bg-violet-400" : activeWarehouse === "rohini" ? "bg-sky-400" : "bg-teal-400"}`} />
              <div className="flex-1">
                <p className={`font-black text-sm ${activeWarehouse === "rai" ? "text-violet-300" : activeWarehouse === "rohini" ? "text-sky-300" : "text-teal-300"}`}>
                  {activeWarehouse === "rai" ? "Rai Warehouse" : activeWarehouse === "rohini" ? "Rohini Warehouse" : "Mori Gate Warehouse"}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{filtered.length} product{filtered.length !== 1 ? "s" : ""} stocked at this location</p>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search part number, name, brand, OEM…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 text-sm transition-colors" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="reserved">Reserved</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-[#F5A623] text-black px-4 py-2.5 rounded-lg font-black text-sm hover:brightness-110 transition-all whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><RefreshCw className="w-6 h-6 text-[#F5A623] animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 text-center">
              <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-white font-bold">{products.length === 0 ? "No products yet" : "No matching products"}</p>
              <p className="text-gray-500 text-sm mt-1">
                {products.length === 0
                  ? <button onClick={() => setSubTab("import")} className="text-[#F5A623] hover:underline">Import from Excel/CSV →</button>
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                      {["Part No", "Name / OEM", "Brand / Model", "Category", "Location", "Qty", "Reorder", "Status", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3.5 font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const s = stockStatusStyle(p.status);
                      return (
                        <tr key={p.id} className={`border-b border-[#2A2E37]/40 hover:bg-white/[0.025] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3 font-mono text-xs text-[#F5A623] whitespace-nowrap">{p.partNumber}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-white text-xs leading-tight">{p.name}</p>
                            {p.oemNumber && <p className="text-gray-600 text-[10px] mt-0.5 font-mono">OEM: {p.oemNumber}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-300 text-xs">{p.brand ?? "—"}</p>
                            {p.model && <p className="text-gray-500 text-[10px] mt-0.5">{p.model}</p>}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{p.category ?? "—"}</td>
                          <td className="px-4 py-3">
                            <select
                              value={p.warehouse ?? ""}
                              onChange={(e) => {
                                const val = e.target.value || null;
                                void fetch(`${API_BASE}/stock/products/${p.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
                                  body: JSON.stringify({ warehouse: val }),
                                }).then(async (r) => {
                                  if (r.ok) {
                                    const updated = (await r.json()) as Product;
                                    setProducts((prev) => prev.map((x) => x.id === p.id ? updated : x));
                                  }
                                });
                              }}
                              className={`appearance-none text-[10px] font-bold px-2 py-1 rounded border cursor-pointer outline-none bg-transparent ${warehouseStyle(p.warehouse ?? null).color}`}
                            >
                              <option value="">— None —</option>
                              <option value="rai">Rai</option>
                              <option value="rohini">Rohini</option>
                              <option value="mori-gate">Mori Gate</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-black text-sm ${p.quantity === 0 ? "text-red-400" : p.quantity <= p.reorderLevel ? "text-amber-400" : "text-white"}`}>
                              {p.quantity}
                            </span>
                            <span className="text-gray-600 text-[10px] ml-1">{p.unit}</span>
                            {Object.keys(p.warehouseBreakdown ?? {}).length > 0 && (
                              <div className="flex flex-col gap-0.5 mt-1">
                                {(["rai", "rohini", "mori-gate"] as const).map((wh) => {
                                  const qty = (p.warehouseBreakdown ?? {})[wh];
                                  if (qty === undefined) return null;
                                  return (
                                    <div key={wh} className="flex items-center gap-1">
                                      <span className={`text-[9px] font-bold px-1 py-px rounded ${wh === "rai" ? "text-violet-400 bg-violet-500/15" : wh === "rohini" ? "text-sky-400 bg-sky-500/15" : "text-teal-400 bg-teal-500/15"}`}>
                                        {wh === "mori-gate" ? "MG" : wh === "rai" ? "Rai" : "Roh"}
                                      </span>
                                      <span className="text-[9px] text-gray-500">{qty}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{p.reorderLevel}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${s.tw} whitespace-nowrap`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setStockModal({ product: p, action: "add", amount: "", reason: "", warehouse: "" })}
                                className="px-2.5 py-1.5 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold hover:bg-[#F5A623]/20 transition-colors whitespace-nowrap">
                                Stock
                              </button>
                              <button onClick={() => void handleDelete(p.id, p.name)} disabled={deletingId === p.id}
                                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-[#2A2E37] text-xs text-gray-600">
                Showing {filtered.length} of {products.length} products
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Import Tab ──────────────────────────────────────────────────────── */}
      {subTab === "import" && (
        <div className="space-y-5">
          {/* Instructions */}
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-black text-white text-sm mb-1">Import Stock from Excel or CSV</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Open your Excel file → select all rows (including header) → copy → paste below. Or export as CSV and upload the file.
                  The first row must be column headers. Columns can be in any order.
                  Existing part numbers will be <span className="text-sky-400 font-semibold">updated</span>; new ones will be <span className="text-green-400 font-semibold">inserted</span>.
                </p>
              </div>
              <button onClick={downloadImportTemplate}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-[#F5A623] hover:border-[#F5A623]/40 text-xs font-bold whitespace-nowrap transition-colors shrink-0">
                <Download className="w-3.5 h-3.5" /> Template
              </button>
            </div>
            <div className="bg-[#0D0F12] rounded-lg p-3 overflow-x-auto">
              <p className="font-mono text-[10px] text-gray-500 whitespace-nowrap">Part Number | Name | Brand | Model | Category | OEM Number | Description | Unit | Rack Location | Quantity | Reorder Level</p>
            </div>
          </div>

          {/* Upload + Paste */}
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A2E37] text-gray-300 hover:text-white hover:border-[#F5A623]/40 text-sm font-bold transition-colors">
                <Upload className="w-4 h-4" /> Upload CSV File
              </button>
              {importFileName !== "paste-import" && (
                <span className="text-xs text-[#F5A623] font-mono bg-[#F5A623]/10 px-2 py-1 rounded">{importFileName}</span>
              )}
              <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={handleFilePick} />
            </div>

            {/* Warehouse selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Assign to Warehouse <span className="text-gray-600 font-normal normal-case tracking-normal">(optional — overrides warehouse column in CSV)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {[{ value: "", label: "No default / use CSV column" }, ...WAREHOUSES].map((w) => (
                  <button key={w.value} type="button"
                    onClick={() => setImportWarehouse(w.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      importWarehouse === w.value
                        ? w.value === "" ? "border-[#F5A623]/60 bg-[#F5A623]/10 text-[#F5A623]" : `border-current ${"color" in w ? w.color : ""}`
                        : "border-[#2A2E37] text-gray-500 hover:border-[#3A3E47] hover:text-gray-300"
                    }`}>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Or paste rows directly from Excel / Google Sheets
              </label>
              <textarea
                value={importText}
                onChange={(e) => { setImportText(e.target.value); setImportRows([]); setImportResult(null); }}
                rows={9}
                placeholder={"Part Number\tName\tBrand\tModel\tQuantity\n4110001903072\tRetarder Hub\tSHANTUI\tSG21-3\t3\nCAT-1R0714\tEngine Oil Filter\tCAT\t140H\t10"}
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-700 text-xs font-mono resize-y transition-colors"
              />
            </div>

            {importError && (
              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {importError}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button onClick={handleParseText} disabled={!importText.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A2E37] text-gray-300 hover:text-white hover:border-[#F5A623]/40 text-sm font-bold transition-colors disabled:opacity-40">
                <Search className="w-4 h-4" /> Preview {importRows.length > 0 ? `(${importRows.length} rows)` : "Rows"}
              </button>
              <button onClick={() => void handleImport()} disabled={importing || importRows.length === 0}
                className="flex items-center gap-2 bg-[#F5A623] text-black px-5 py-2.5 rounded-lg font-black text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {importing ? "Importing…" : `Import ${importRows.length > 0 ? `${importRows.length} Rows` : "Now"}`}
              </button>
            </div>
          </div>

          {/* Preview Table */}
          {importRows.length > 0 && !importResult && (
            <div className="bg-[#16181D] border border-[#F5A623]/20 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-3">
                Preview — {importRows.length} rows detected
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#2A2E37] text-gray-500 uppercase tracking-wide">
                      {PREVIEW_COLS.map((c) => <th key={c} className="text-left px-3 py-2 font-semibold">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.slice(0, 8).map((row, i) => (
                      <tr key={i} className="border-b border-[#2A2E37]/40">
                        {PREVIEW_COLS.map((c) => (
                          <td key={c} className={`px-3 py-2 ${c === "partNumber" ? "font-mono text-[#F5A623]" : "text-gray-300"}`}>
                            {row[c] ?? <span className="text-gray-700">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importRows.length > 8 && (
                  <p className="text-gray-600 text-[10px] mt-2 text-center">…and {importRows.length - 8} more rows</p>
                )}
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`border rounded-xl p-5 ${importResult.errors.length > 0 ? "bg-amber-500/5 border-amber-500/30" : "bg-green-500/5 border-green-500/30"}`}>
              <div className="flex items-center gap-3 mb-4">
                {importResult.errors.length === 0
                  ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                <p className="font-black text-white">Import Complete</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {([
                  ["Total Rows", importResult.total, "text-white"],
                  ["Inserted", importResult.inserted, "text-green-400"],
                  ["Updated", importResult.updated, "text-sky-400"],
                  ["Skipped", importResult.skipped, "text-gray-400"],
                ] as const).map(([label, value, cls]) => (
                  <div key={label} className="bg-[#0D0F12] rounded-lg p-3 text-center">
                    <p className={`text-xl font-black ${cls}`}>{value}</p>
                    <p className="text-gray-600 text-xs">{label}</p>
                  </div>
                ))}
              </div>
              {importResult.errors.length > 0 && (
                <div className="bg-[#0D0F12] rounded-lg p-3 mb-3">
                  <p className="text-xs font-bold text-amber-400 mb-1">Errors:</p>
                  {importResult.errors.map((e, i) => <p key={i} className="text-xs text-gray-500 font-mono">{e}</p>)}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setImportResult(null); setImportRows([]); setImportText(""); }}
                  className="text-xs text-gray-500 hover:text-white transition-colors underline">
                  Import more
                </button>
                <button onClick={() => setSubTab("catalogue")}
                  className="text-xs text-[#F5A623] hover:underline transition-colors">
                  View Products →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── History Tab ─────────────────────────────────────────────────────── */}
      {subTab === "history" && (
        <div>
          {historyLoading ? (
            <div className="flex justify-center py-16"><RefreshCw className="w-6 h-6 text-[#F5A623] animate-spin" /></div>
          ) : importHistory.length === 0 ? (
            <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 text-center">
              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-white font-bold">No imports yet</p>
              <p className="text-gray-500 text-sm mt-1">Import history will appear here after your first import.</p>
            </div>
          ) : (
            <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                      {["Date", "File / Source", "Total", "Inserted", "Updated", "Skipped", "By"].map((h) => (
                        <th key={h} className="text-left px-4 py-3.5 font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((h, i) => (
                      <tr key={h.id} className={`border-b border-[#2A2E37]/40 ${i === importHistory.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(h.createdAt)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#F5A623] max-w-[180px] truncate">{h.fileName}</td>
                        <td className="px-4 py-3 text-white font-bold text-xs">{h.totalRows}</td>
                        <td className="px-4 py-3 text-green-400 font-bold text-xs">{h.inserted}</td>
                        <td className="px-4 py-3 text-sky-400 font-bold text-xs">{h.updated}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{h.skipped}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{h.actorName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Stock Update Modal ───────────────────────────────────────────────── */}
      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setStockModal(null)}>
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-black text-white">{stockModal.product.name}</p>
                <p className="font-mono text-xs text-[#F5A623] mt-0.5">{stockModal.product.partNumber}</p>
              </div>
              <button onClick={() => setStockModal(null)} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-[#0D0F12] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Total Stock</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {stockModal.product.quantity} <span className="text-sm text-gray-500 font-normal">{stockModal.product.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Reorder at</p>
                  <p className="text-lg font-black text-gray-400">{stockModal.product.reorderLevel}</p>
                </div>
              </div>
              {/* Per-warehouse breakdown */}
              {Object.keys(stockModal.product.warehouseBreakdown ?? {}).length > 0 && (
                <div className="flex gap-2 flex-wrap border-t border-[#2A2E37] pt-3">
                  {(["rai", "rohini", "mori-gate"] as const).map((wh) => {
                    const qty = (stockModal.product.warehouseBreakdown ?? {})[wh];
                    if (qty === undefined) return null;
                    const colors = wh === "rai" ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                      : wh === "rohini" ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
                      : "text-teal-400 bg-teal-500/10 border-teal-500/20";
                    return (
                      <div key={wh} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${colors}`}>
                        <span>{wh === "mori-gate" ? "Mori Gate" : wh === "rai" ? "Rai" : "Rohini"}</span>
                        <span className="opacity-70">·</span>
                        <span>{qty} {stockModal.product.unit}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Location selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Update at Location</label>
              <div className="grid grid-cols-4 gap-2">
                {([["", "All / Total"], ["rai", "Rai"], ["rohini", "Rohini"], ["mori-gate", "Mori Gate"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setStockModal((m) => m ? { ...m, warehouse: val } : null)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-black border transition-all ${stockModal.warehouse === val
                      ? val === "" ? "border-gray-400/40 bg-gray-400/15 text-gray-300"
                        : val === "rai" ? "border-violet-500/40 bg-violet-500/15 text-violet-400"
                        : val === "rohini" ? "border-sky-500/40 bg-sky-500/15 text-sky-400"
                        : "border-teal-500/40 bg-teal-500/15 text-teal-400"
                      : "bg-[#0D0F12] border-[#2A2E37] text-gray-500 hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
              {stockModal.warehouse && (
                <p className="text-[10px] text-gray-500 mt-1.5">
                  Current at {stockModal.warehouse === "mori-gate" ? "Mori Gate" : stockModal.warehouse === "rai" ? "Rai" : "Rohini"}:
                  <span className="text-white font-bold ml-1">{(stockModal.product.warehouseBreakdown ?? {})[stockModal.warehouse] ?? 0} {stockModal.product.unit}</span>
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {([
                ["add", "Add Stock", "border-green-500/30 bg-green-500/15 text-green-400"],
                ["remove", "Record Sale", "border-red-500/30 bg-red-500/15 text-red-400"],
                ["set", "Set Exact", "border-[#F5A623]/30 bg-[#F5A623]/15 text-[#F5A623]"],
              ] as const).map(([action, label, cls]) => (
                <button key={action}
                  onClick={() => setStockModal((m) => m ? { ...m, action } : null)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-black border transition-all ${stockModal.action === action ? cls : "bg-[#0D0F12] border-[#2A2E37] text-gray-500 hover:text-white"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  {stockModal.action === "add" ? "Quantity to Add" : stockModal.action === "remove" ? "Quantity Sold / Removed" : "Set Stock To"}
                </label>
                <input type="number" min="0" value={stockModal.amount}
                  onChange={(e) => setStockModal((m) => m ? { ...m, amount: e.target.value } : null)}
                  placeholder="0" autoFocus
                  className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white text-lg font-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Reason (optional)</label>
                <input type="text" value={stockModal.reason}
                  onChange={(e) => setStockModal((m) => m ? { ...m, reason: e.target.value } : null)}
                  placeholder="e.g. Sale to ABC Transport, Stock count…"
                  className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm transition-colors" />
              </div>
            </div>
            {stockError && <div className="text-red-400 text-xs mb-3 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{stockError}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStockModal(null)} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white font-bold text-sm">Cancel</button>
              <button onClick={() => void handleStockSave()} disabled={stockSaving || !stockModal.amount}
                className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {stockSaving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Product Modal ────────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white">Add New Product</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => void handleAddProduct(e)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Part Number *</label>
                  <input required value={addForm.partNumber} onChange={(e) => setAddForm((f) => ({ ...f, partNumber: e.target.value }))}
                    placeholder="CAT-1R0714" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">OEM Number</label>
                  <input value={addForm.oemNumber} onChange={(e) => setAddForm((f) => ({ ...f, oemNumber: e.target.value }))}
                    placeholder="1R-0714" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Part Name *</label>
                <input required value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Engine Oil Filter" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Brand</label>
                  <input value={addForm.brand} onChange={(e) => setAddForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="CAT, Komatsu…" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Model</label>
                  <input value={addForm.model} onChange={(e) => setAddForm((f) => ({ ...f, model: e.target.value }))}
                    placeholder="140H, GD555…" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Category</label>
                  <input value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Filters, Sprockets…" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Unit</label>
                  <input value={addForm.unit} onChange={(e) => setAddForm((f) => ({ ...f, unit: e.target.value }))}
                    placeholder="pcs, set, kg…" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Storage Location</label>
                <select value={addForm.warehouse} onChange={(e) => setAddForm((f) => ({ ...f, warehouse: e.target.value }))}
                  className="w-full appearance-none bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-xs cursor-pointer">
                  <option value="">— Not assigned —</option>
                  <option value="rai">Rai</option>
                  <option value="rohini">Rohini</option>
                  <option value="mori-gate">Mori Gate</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Rack / Bin</label>
                  <input value={addForm.rackLocation} onChange={(e) => setAddForm((f) => ({ ...f, rackLocation: e.target.value }))}
                    placeholder="A-12" className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Qty</label>
                  <input type="number" min="0" value={addForm.quantity} onChange={(e) => setAddForm((f) => ({ ...f, quantity: e.target.value }))}
                    className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Reorder At</label>
                  <input type="number" min="0" value={addForm.reorderLevel} onChange={(e) => setAddForm((f) => ({ ...f, reorderLevel: e.target.value }))}
                    className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-xs resize-none" />
              </div>
              {addError && <div className="text-red-400 text-xs flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{addError}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white font-bold text-sm">Cancel</button>
                <button type="submit" disabled={addSaving} className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 disabled:opacity-50">
                  {addSaving ? "Adding…" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [auth, setAuth] = useState<AuthInfo | null>(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null") as AuthInfo | null; }
    catch { return null; }
  });
  const [view, setView] = useState<"enquiries" | "workers" | "templates" | "inventory">("enquiries");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = useCallback(async (tok: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/enquiries`, { headers: authHeader(tok) });
      if (res.status === 401) { handleLogout(); return; }
      const data = (await res.json()) as Enquiry[];
      setEnquiries(Array.isArray(data) ? data : []);
    } catch { setError("Failed to load enquiries. Check your connection."); }
    finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWorkers = useCallback(async (tok: string) => {
    try {
      const res = await fetch(`${API_BASE}/workers`, { headers: authHeader(tok) });
      if (res.ok) setWorkers((await res.json()) as Worker[]);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (auth) {
      void fetchEnquiries(auth.token);
      if (auth.role === "admin") void fetchWorkers(auth.token);
    }
  }, [auth, fetchEnquiries, fetchWorkers]);

  const handleLogin = (info: AuthInfo) => setAuth(info);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null); setEnquiries([]); setWorkers([]);
  };

  const openEnquiry = useCallback((id: number) => {
    const enq = enquiries.find((e) => e.id === id);
    if (enq) setSelectedEnquiry(enq);
    else {
      fetch(`${API_BASE}/enquiries`, { headers: authHeader(auth!.token) })
        .then((r) => r.json())
        .then((data: unknown) => {
          if (Array.isArray(data)) {
            setEnquiries(data as Enquiry[]);
            const found = (data as Enquiry[]).find((e) => e.id === id);
            if (found) setSelectedEnquiry(found);
          }
        })
        .catch(() => {});
    }
    setView("enquiries");
  }, [enquiries, auth]);

  if (!auth) return <LoginScreen onLogin={handleLogin} />;

  const isAdmin = auth.role === "admin";

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned" && e.assignedToId !== null) return false;
      if (assigneeFilter !== "unassigned" && String(e.assignedToId) !== assigneeFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.email ?? "").toLowerCase().includes(q) ||
        (e.machine ?? "").toLowerCase().includes(q) ||
        (e.part ?? "").toLowerCase().includes(q) ||
        (e.message ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = STATUSES.map((s) => ({ ...s, count: enquiries.filter((e) => e.status === s.value).length }));

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="bg-[#16181D] border-b border-[#2A2E37] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
            <span className="font-black text-white tracking-wide">SSI CRM</span>
            <span className="hidden sm:inline text-gray-600 text-sm">— {auth.name}</span>
            <span className={`hidden sm:inline text-xs rounded px-2 py-0.5 font-bold capitalize ${isAdmin ? "bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30" : "bg-white/5 text-gray-400"}`}>
              {auth.role}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <>
                <button onClick={() => setView("enquiries")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "enquiries" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <ClipboardList className="w-4 h-4" /><span className="hidden sm:inline">Enquiries</span>
                </button>
                <button onClick={() => setView("workers")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "workers" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Users className="w-4 h-4" /><span className="hidden sm:inline">Team</span>
                </button>
                <button onClick={() => setView("templates")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "templates" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Zap className="w-4 h-4" /><span className="hidden sm:inline">Templates</span>
                </button>
                <button onClick={() => setView("inventory")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "inventory" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Package className="w-4 h-4" /><span className="hidden sm:inline">Inventory</span>
                </button>
              </>
            )}
            <NotificationBell auth={auth} onSelectEnquiry={openEnquiry} />
            <button onClick={() => auth && void fetchEnquiries(auth.token)} disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={handleLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {view === "workers" && isAdmin && <WorkersPanel auth={auth} />}
        {view === "templates" && isAdmin && <TemplatesPanel auth={auth} />}
        {view === "inventory" && isAdmin && <InventoryPanel auth={auth} />}

        {view === "enquiries" && (
          <>
            {/* Dashboard Summary */}
            {(() => {
              const today = new Date(); today.setHours(0,0,0,0);
              const todayStr = today.toDateString();
              const newToday = enquiries.filter(e => new Date(e.createdAt).toDateString() === todayStr).length;
              const openCount = enquiries.filter(e => !["closed", "dispatched"].includes(e.status)).length;
              const convRate = enquiries.length > 0 ? Math.round((enquiries.filter(e => e.status === "order-confirmed" || e.status === "dispatched").length / enquiries.length) * 100) : 0;
              const pendingFollowUps = enquiries.filter(e => {
                if (!e.followUpDate) return false;
                if (["closed","dispatched"].includes(e.status)) return false;
                const d = new Date(e.followUpDate); d.setHours(0,0,0,0);
                return d <= today;
              }).length;
              const contactedToday = enquiries.filter(e => e.lastContactedAt && new Date(e.lastContactedAt).toDateString() === todayStr).length;
              const urgentCount = enquiries.filter(e => e.priority === "urgent" && !["closed","dispatched"].includes(e.status)).length;
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                  <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl px-4 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-[#F5A623]" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white leading-none">{enquiries.length}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Total</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${newToday > 0 ? "border-[#F5A623]/40 bg-[#F5A623]/5" : "border-[#2A2E37]"}`}>
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <Inbox className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white leading-none">{newToday}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">New Today</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${openCount > 0 ? "border-amber-500/30" : "border-[#2A2E37]"}`}>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white leading-none">{openCount}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Open</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${pendingFollowUps > 0 ? "border-violet-500/30 bg-violet-500/5" : "border-[#2A2E37]"}`}>
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className={`text-xl font-black leading-none ${pendingFollowUps > 0 ? "text-violet-400" : "text-white"}`}>{pendingFollowUps}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Follow-ups Due</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${urgentCount > 0 ? "border-red-500/30 bg-red-500/5" : "border-[#2A2E37]"}`}>
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className={`text-xl font-black leading-none ${urgentCount > 0 ? "text-red-400" : "text-white"}`}>{urgentCount}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Urgent</p>
                    </div>
                  </div>
                  <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl px-4 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white leading-none">{contactedToday}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Contacted Today</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Status Breakdown */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
              {stats.map((s) => (
                <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? "all" : s.value)}
                  className={`rounded-xl p-3 text-left border transition-all ${statusFilter === s.value ? s.tw : "bg-[#16181D] border-[#2A2E37] hover:border-[#3A3E47]"}`}>
                  <div className={`text-xl font-black leading-none ${statusFilter === s.value ? "" : "text-white"}`}>{s.count}</div>
                  <div className={`text-[10px] mt-1 leading-tight font-semibold ${statusFilter === s.value ? "" : "text-gray-500"}`}>{s.label}</div>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search name, phone, machine, part…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 transition-colors text-sm" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
                    <option value="all">All Status</option>
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                {isAdmin && workers.length > 0 && (
                  <div className="relative">
                    <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}
                      className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
                      <option value="all">All Team</option>
                      <option value="unassigned">Unassigned</option>
                      {workers.map((w) => <option key={w.id} value={String(w.id)}>{w.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
                <button onClick={() => exportCSV(filtered)} title="Export CSV"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#16181D] border border-[#2A2E37] text-gray-400 hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors text-sm font-bold whitespace-nowrap">
                  <Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-2 mb-5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 flex flex-col items-center text-center gap-4">
                <Inbox className="w-12 h-12 text-gray-600" />
                <div>
                  <p className="text-white font-bold text-lg">{enquiries.length === 0 ? "No enquiries yet" : "No results"}</p>
                  <p className="text-gray-500 text-sm mt-1">{enquiries.length === 0 ? "New enquiries from the website will appear here." : "Try adjusting your search or filters."}</p>
                </div>
              </div>
            )}

            {/* Desktop Table */}
            {filtered.length > 0 && (
              <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                        {["#", "Date", "Customer", "Contact", "Machine / Part", "Status", isAdmin ? "Assigned" : "", ""].filter(Boolean).map((h) => (
                          <th key={h} className="text-left px-4 py-3.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e, i) => (
                        <tr key={e.id}
                          onClick={() => setSelectedEnquiry(e)}
                          className={`border-b border-[#2A2E37]/40 hover:bg-white/[0.025] transition-colors cursor-pointer ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">#{e.id}</td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{formatDate(e.createdAt)}</td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white whitespace-nowrap">{e.name}</p>
                            {e.message && <p className="text-gray-500 text-xs mt-0.5 max-w-[140px] truncate">{e.message}</p>}
                          </td>
                          <td className="px-4 py-3.5">
                            <a href={`tel:${e.phone}`} onClick={(ev) => ev.stopPropagation()} className="text-[#F5A623] hover:underline flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3" /> {e.phone}
                            </a>
                            {e.email && <p className="text-gray-600 text-xs mt-0.5 truncate max-w-[100px]">{e.email}</p>}
                          </td>
                          <td className="px-4 py-3.5">
                            {e.machine && <p className="text-gray-300 text-xs">{e.machine}</p>}
                            {e.part && <p className="text-gray-400 text-xs mt-0.5">{e.part}</p>}
                            {!e.machine && !e.part && <span className="text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-1">
                              <StatusBadge status={e.status} />
                              {e.priority && e.priority !== "normal" && <PriorityBadge priority={e.priority} />}
                              {e.followUpDate && !["closed","dispatched"].includes(e.status) && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${isFollowUpOverdue(e.followUpDate) ? "text-red-400" : isFollowUpToday(e.followUpDate) ? "text-violet-400" : "text-gray-600"}`}>
                                  <CalendarDays className="w-2.5 h-2.5" />{formatFollowUp(e.followUpDate)}
                                </span>
                              )}
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3.5">
                              {e.assignedToName
                                ? <span className="text-xs text-gray-300 font-semibold">{e.assignedToName}</span>
                                : <span className="text-xs text-gray-600">—</span>}
                            </td>
                          )}
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#F5A623] transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" /> Open <ChevronRight className="w-3 h-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-[#2A2E37]">
                  {filtered.map((e) => (
                    <button key={e.id} onClick={() => setSelectedEnquiry(e)} className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-bold text-white">{e.name}</p>
                            {e.priority && e.priority !== "normal" && <PriorityBadge priority={e.priority} />}
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">{timeAgo(e.createdAt)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={e.status} />
                          {e.followUpDate && !["closed","dispatched"].includes(e.status) && (
                            <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${isFollowUpOverdue(e.followUpDate) ? "text-red-400" : isFollowUpToday(e.followUpDate) ? "text-violet-400" : "text-gray-600"}`}>
                              <CalendarDays className="w-2.5 h-2.5" />{formatFollowUp(e.followUpDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        <span className="text-[#F5A623] font-semibold">{e.phone}</span>
                        {e.machine && <span className="text-gray-400">{e.machine}</span>}
                        {e.part && <span className="text-gray-500">{e.part}</span>}
                      </div>
                      {e.message && <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{e.message}</p>}
                      {e.assignedToName && <p className="text-xs text-gray-600 mt-1.5">Assigned → <span className="text-gray-400 font-semibold">{e.assignedToName}</span></p>}
                      {e.lastContactedAt && (
                        <p className="text-xs text-gray-700 mt-1">
                          Last contacted {timeAgo(e.lastContactedAt)}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                        <MessageSquare className="w-3 h-3" /> Tap to open conversation
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Enquiry Detail Panel */}
      {selectedEnquiry && (
        <EnquiryDetailPanel
          enquiry={selectedEnquiry}
          auth={auth}
          workers={workers}
          allEnquiries={enquiries}
          onClose={() => setSelectedEnquiry(null)}
          onUpdate={(updated) => {
            setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
            setSelectedEnquiry(updated);
          }}
        />
      )}
    </div>
  );
}
