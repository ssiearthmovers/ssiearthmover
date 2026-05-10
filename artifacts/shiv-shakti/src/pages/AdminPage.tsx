import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  LogOut, RefreshCw, Search, Phone, ShieldCheck, Eye, EyeOff,
  CheckCircle2, Clock, AlertCircle, Inbox, Users, ClipboardList,
  Plus, Trash2, UserCheck, UserX, Download, ChevronDown, X,
  Bell, MessageSquare, Lock, Send, FileText, ArrowLeft,
  Mail, Zap, Edit3, ChevronRight, Box,
  Package, Upload, AlertTriangle, Database,
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
  assignedToId: number | null;
  assignedToName: string | null;
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
  enquiry: initialEnquiry, auth, workers, onClose, onUpdate,
}: {
  enquiry: Enquiry; auth: AuthInfo; workers: Worker[];
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
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <a href={`tel:${enquiry.phone}`} className="text-[#F5A623] hover:underline font-semibold">{enquiry.phone}</a>
            </div>
            {enquiry.email && (
              <div className="flex items-center gap-2">
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
          {enquiry.message && (
            <div className="bg-[#0D0F12] rounded-lg px-3 py-2.5 text-gray-300 text-sm leading-relaxed border border-[#2A2E37]/50">
              {enquiry.message}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <select value={enquiry.status} disabled={updatingStatus} onChange={(e) => { void updateStatus(e.target.value); }}
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
        </div>

        {/* Conversation thread */}
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

        {/* Reply composer */}
        <div className="px-5 pb-5 pt-3 border-t border-[#2A2E37] bg-[#16181D] shrink-0">
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
        </div>
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

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [auth, setAuth] = useState<AuthInfo | null>(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null") as AuthInfo | null; }
    catch { return null; }
  });
  const [view, setView] = useState<"enquiries" | "workers" | "templates">("enquiries");
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
                <button onClick={() => navigate("/stock")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-gray-400 hover:text-white hover:bg-white/5">
                  <Box className="w-4 h-4" /><span className="hidden sm:inline">Stock</span>
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

        {view === "enquiries" && (
          <>
            {/* Dashboard Summary */}
            {(() => {
              const today = new Date().toDateString();
              const newToday = enquiries.filter(e => new Date(e.createdAt).toDateString() === today).length;
              const openCount = enquiries.filter(e => !["closed", "dispatched"].includes(e.status)).length;
              const closedCount = enquiries.filter(e => e.status === "closed" || e.status === "dispatched").length;
              const convRate = enquiries.length > 0 ? Math.round((enquiries.filter(e => e.status === "order-confirmed" || e.status === "dispatched").length / enquiries.length) * 100) : 0;
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl px-4 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-[#F5A623]" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{enquiries.length}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Total Enquiries</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${newToday > 0 ? "border-[#F5A623]/40 bg-[#F5A623]/5" : "border-[#2A2E37]"}`}>
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <Inbox className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{newToday}</p>
                      <p className="text-xs text-gray-500 mt-0.5">New Today</p>
                    </div>
                  </div>
                  <div className={`bg-[#16181D] border rounded-xl px-4 py-4 flex items-center gap-3 ${openCount > 0 ? "border-amber-500/30" : "border-[#2A2E37]"}`}>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{openCount}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Open Pipeline</p>
                    </div>
                  </div>
                  <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl px-4 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{convRate}%</p>
                      <p className="text-xs text-gray-500 mt-0.5">Conversion Rate</p>
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
                          <td className="px-4 py-3.5"><StatusBadge status={e.status} /></td>
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
                          <p className="font-bold text-white">{e.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{timeAgo(e.createdAt)}</p>
                        </div>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-[#F5A623]">{e.phone}</span>
                        {e.machine && <span className="text-gray-400">{e.machine}</span>}
                        {e.part && <span className="text-gray-500">{e.part}</span>}
                      </div>
                      {e.message && <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{e.message}</p>}
                      {e.assignedToName && <p className="text-xs text-gray-600 mt-1.5">Assigned → <span className="text-gray-400 font-semibold">{e.assignedToName}</span></p>}
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
