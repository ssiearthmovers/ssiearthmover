import { useState, useEffect, useCallback } from "react";
import {
  LogOut, RefreshCw, Search, Phone, ShieldCheck, Eye, EyeOff,
  CheckCircle2, Clock, AlertCircle, Inbox, Users, ClipboardList,
  Plus, Trash2, UserCheck, UserX, Download, ChevronDown, X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "/api";
const AUTH_KEY = "ssi_admin_auth";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthInfo {
  token: string;
  role: "admin" | "worker";
  name: string;
  workerId?: number;
}

interface Enquiry {
  id: number;
  name: string;
  phone: string;
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

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES: { value: string; label: string; tw: string; dot: string }[] = [
  { value: "new",           label: "New Inquiry",     tw: "bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30",        dot: "bg-[#F5A623]" },
  { value: "contacted",     label: "Contacted",       tw: "bg-sky-500/15 text-sky-400 border-sky-500/30",              dot: "bg-sky-400" },
  { value: "price-sent",    label: "Price Sent",      tw: "bg-violet-500/15 text-violet-400 border-violet-500/30",     dot: "bg-violet-400" },
  { value: "pending",       label: "Pending",         tw: "bg-amber-500/15 text-amber-400 border-amber-500/30",        dot: "bg-amber-400" },
  { value: "order-confirmed", label: "Order Confirmed", tw: "bg-teal-500/15 text-teal-400 border-teal-500/30",         dot: "bg-teal-400" },
  { value: "dispatched",    label: "Dispatched",      tw: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",     dot: "bg-indigo-400" },
  { value: "completed",     label: "Completed",       tw: "bg-green-500/15 text-green-400 border-green-500/30",        dot: "bg-green-400" },
];

function getStatus(value: string) {
  return STATUSES.find((s) => s.value === value) ?? STATUSES[0];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function exportCSV(enquiries: Enquiry[]) {
  const headers = ["ID", "Date", "Name", "Phone", "Machine", "Part", "Message", "Status", "Assigned To", "Source"];
  const rows = enquiries.map((e) => [
    e.id,
    formatDate(e.createdAt),
    e.name,
    e.phone,
    e.machine ?? "",
    e.part ?? "",
    (e.message ?? "").replace(/"/g, '""'),
    getStatus(e.status).label,
    e.assignedToName ?? "",
    e.source,
  ].map((v) => `"${v}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ssi-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json()) as { token?: string; role?: string; name?: string; workerId?: number; error?: string };
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      if (data.token) {
        const info: AuthInfo = {
          token: data.token,
          role: (data.role as AuthInfo["role"]) ?? "worker",
          name: data.name ?? username,
          workerId: data.workerId,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(info));
        onLogin(info);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 mb-5">
            <ShieldCheck className="w-8 h-8 text-[#F5A623]" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Admin Console</h1>
          <p className="text-gray-500 mt-2 text-sm">SSI Earthmovers — Restricted Access</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-8 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or worker username"
              required
              autoComplete="username"
              className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3.5 text-white placeholder-gray-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3.5 text-white placeholder-gray-600 transition-colors pr-12"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] text-black py-4 rounded-lg font-black uppercase tracking-wide hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/workers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify({ name, username, password, role }),
      });
      const data = (await res.json()) as Worker & { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to create worker"); return; }
      onCreated(data);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Add Worker</h2>
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
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#2A2E37] text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm font-bold">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#F5A623] text-black font-black text-sm hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? "Creating…" : "Create Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Workers Panel ────────────────────────────────────────────────────────────

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
    } finally {
      setLoading(false);
    }
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
      if (res.ok) {
        const updated = (await res.json()) as Worker;
        setWorkers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const deleteWorker = async (id: number) => {
    if (!confirm("Delete this worker? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/workers/${id}`, { method: "DELETE", headers: authHeader(auth.token) });
      setWorkers((prev) => prev.filter((w) => w.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-white uppercase tracking-wide">Worker Accounts</h2>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#F5A623] text-black px-4 py-2.5 rounded-lg font-black text-sm hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-[#F5A623] animate-spin" /></div>
      ) : workers.length === 0 ? (
        <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-12 text-center">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-bold">No workers yet</p>
          <p className="text-gray-500 text-sm mt-1">Add your first worker account above.</p>
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${w.role === "admin" ? "bg-[#F5A623]/15 text-[#F5A623]" : "bg-white/5 text-gray-400"}`}>
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
                        <button onClick={() => toggleActive(w)} disabled={togglingId === w.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 ${w.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                          {w.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => deleteWorker(w.id)} disabled={deletingId === w.id}
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
                  <p className="text-gray-500 text-xs mt-0.5">@{w.username} · {w.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(w)} disabled={togglingId === w.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 ${w.isActive ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                    {w.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => deleteWorker(w.id)} disabled={deletingId === w.id}
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

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthInfo | null>(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null") as AuthInfo | null; }
    catch { return null; }
  });
  const [view, setView] = useState<"enquiries" | "workers">("enquiries");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const fetchEnquiries = useCallback(async (tok: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/enquiries`, { headers: authHeader(tok) });
      if (res.status === 401) { handleLogout(); return; }
      const data = (await res.json()) as Enquiry[];
      setEnquiries(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load enquiries. Check your connection.");
    } finally {
      setLoading(false);
    }
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
    setAuth(null);
    setEnquiries([]);
    setWorkers([]);
  };

  const updateStatus = async (id: number, status: string) => {
    if (!auth) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = (await res.json()) as Enquiry;
        setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const assignWorker = async (enquiryId: number, workerId: number | null, workerName: string | null) => {
    if (!auth) return;
    setAssigningId(enquiryId);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${enquiryId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader(auth.token) },
        body: JSON.stringify({ assignedToId: workerId, assignedToName: workerName }),
      });
      if (res.ok) {
        const updated = (await res.json()) as Enquiry;
        setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } finally {
      setAssigningId(null);
    }
  };

  if (!auth) return <LoginScreen onLogin={handleLogin} />;

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
        (e.machine ?? "").toLowerCase().includes(q) ||
        (e.part ?? "").toLowerCase().includes(q) ||
        (e.message ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = STATUSES.map((s) => ({
    ...s,
    count: enquiries.filter((e) => e.status === s.value).length,
  }));

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-[#16181D] border-b border-[#2A2E37] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
            <span className="font-black text-white tracking-wide">SSI Admin</span>
            <span className="hidden sm:inline text-gray-600 text-sm">— {auth.name}</span>
            {auth.role === "admin" && (
              <span className="hidden sm:inline text-xs bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30 rounded px-2 py-0.5 font-bold">
                ADMIN
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {auth.role === "admin" && (
              <>
                <button onClick={() => setView("enquiries")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "enquiries" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Enquiries</span>
                </button>
                <button onClick={() => setView("workers")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${view === "workers" ? "bg-[#F5A623]/10 text-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Workers</span>
                </button>
              </>
            )}
            <button onClick={() => auth && fetchEnquiries(auth.token)} disabled={loading}
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

        {/* ── Workers View ──────────────────────────────────── */}
        {view === "workers" && auth.role === "admin" && (
          <WorkersPanel auth={auth} />
        )}

        {/* ── Enquiries View ────────────────────────────────── */}
        {view === "enquiries" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {stats.map((s) => (
                <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? "all" : s.value)}
                  className={`rounded-xl p-3 text-left border transition-all ${statusFilter === s.value ? s.tw : "bg-[#16181D] border-[#2A2E37] hover:border-[#2A2E37]/80"}`}>
                  <div className={`text-2xl font-black ${statusFilter === s.value ? "" : "text-white"}`}>{s.count}</div>
                  <div className={`text-xs mt-0.5 leading-tight ${statusFilter === s.value ? "" : "text-gray-500"}`}>{s.label}</div>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search name, phone, machine, part…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 transition-colors text-sm" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
                    <option value="all">All Status</option>
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                {auth.role === "admin" && workers.length > 0 && (
                  <div className="relative">
                    <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}
                      className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white text-sm cursor-pointer">
                      <option value="all">All Workers</option>
                      <option value="unassigned">Unassigned</option>
                      {workers.map((w) => <option key={w.id} value={String(w.id)}>{w.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
                <button onClick={() => exportCSV(filtered)} title="Export to CSV (opens in Excel)"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#16181D] border border-[#2A2E37] text-gray-400 hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors text-sm font-bold whitespace-nowrap">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-2 mb-5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 flex flex-col items-center text-center gap-4">
                <Inbox className="w-12 h-12 text-gray-600" />
                <div>
                  <p className="text-white font-bold text-lg">{enquiries.length === 0 ? "No enquiries yet" : "No results"}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {enquiries.length === 0 ? "New enquiries from the website will appear here." : "Try adjusting your search or filters."}
                  </p>
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
                        {["#", "Date", "Customer", "Phone", "Machine / Part", "Status", auth.role === "admin" ? "Assigned To" : "", "Actions"].filter(Boolean).map((h) => (
                          <th key={h} className="text-left px-4 py-3.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e, i) => (
                        <tr key={e.id} className={`border-b border-[#2A2E37]/40 hover:bg-white/[0.02] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">#{e.id}</td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{formatDate(e.createdAt)}</td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white whitespace-nowrap">{e.name}</p>
                            {e.message && <p className="text-gray-500 text-xs mt-0.5 max-w-[140px] truncate" title={e.message}>{e.message}</p>}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <a href={`tel:${e.phone}`} className="text-[#F5A623] hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {e.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5">
                            {e.machine && <p className="text-gray-300 text-xs">{e.machine}</p>}
                            {e.part && <p className="text-gray-400 text-xs mt-0.5">{e.part}</p>}
                            {!e.machine && !e.part && <span className="text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <select value={e.status} disabled={updatingId === e.id}
                              onChange={(ev) => updateStatus(e.id, ev.target.value)}
                              className="appearance-none bg-transparent border-0 outline-none cursor-pointer disabled:opacity-50 text-xs w-full">
                              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <StatusBadge status={e.status} />
                          </td>
                          {auth.role === "admin" && (
                            <td className="px-4 py-3.5">
                              <div className="relative">
                                <select
                                  value={e.assignedToId !== null ? String(e.assignedToId) : ""}
                                  disabled={assigningId === e.id}
                                  onChange={(ev) => {
                                    const val = ev.target.value;
                                    if (!val) { assignWorker(e.id, null, null); return; }
                                    const w = workers.find((w) => String(w.id) === val);
                                    if (w) assignWorker(e.id, w.id, w.name);
                                  }}
                                  className="appearance-none bg-[#1A1D24] border border-[#2A2E37] rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-[#F5A623] cursor-pointer disabled:opacity-50 pr-6 max-w-[120px]">
                                  <option value="">Unassigned</option>
                                  {workers.filter((w) => w.isActive).map((w) => (
                                    <option key={w.id} value={String(w.id)}>{w.name}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                              </div>
                            </td>
                          )}
                          <td className="px-4 py-3.5">
                            <a
                              href={`https://wa.me/${e.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.name}, regarding your enquiry for ${e.part ?? "motor grader parts"} — `)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-xs font-bold">
                              <FaWhatsapp className="w-3.5 h-3.5" /> Reply
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-[#2A2E37]">
                  {filtered.map((e) => (
                    <div key={e.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-white">{e.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{formatDate(e.createdAt)}</p>
                        </div>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Phone</p>
                          <a href={`tel:${e.phone}`} className="text-[#F5A623] font-semibold text-sm">{e.phone}</a>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Machine</p>
                          <p className="text-gray-300 text-sm">{e.machine || "—"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Part</p>
                          <p className="text-gray-300 text-sm">{e.part || "—"}</p>
                        </div>
                      </div>
                      {e.message && (
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Message</p>
                          <p className="text-gray-400 text-sm">{e.message}</p>
                        </div>
                      )}
                      {e.assignedToName && (
                        <p className="text-xs text-gray-500">Assigned to <span className="text-gray-300 font-semibold">{e.assignedToName}</span></p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select value={e.status} disabled={updatingId === e.id}
                          onChange={(ev) => updateStatus(e.id, ev.target.value)}
                          className="bg-[#1A1D24] border border-[#2A2E37] rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-[#F5A623] cursor-pointer disabled:opacity-50 flex-1">
                          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <a
                          href={`https://wa.me/${e.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.name}, regarding your enquiry for ${e.part ?? "motor grader parts"} — `)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">
                          <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      </div>
                      {auth.role === "admin" && workers.length > 0 && (
                        <div className="relative">
                          <select
                            value={e.assignedToId !== null ? String(e.assignedToId) : ""}
                            disabled={assigningId === e.id}
                            onChange={(ev) => {
                              const val = ev.target.value;
                              if (!val) { assignWorker(e.id, null, null); return; }
                              const w = workers.find((w) => String(w.id) === val);
                              if (w) assignWorker(e.id, w.id, w.name);
                            }}
                            className="w-full appearance-none bg-[#1A1D24] border border-[#2A2E37] rounded-lg px-3 py-2 text-xs text-gray-300 outline-none focus:border-[#F5A623] cursor-pointer disabled:opacity-50">
                            <option value="">Unassigned</option>
                            {workers.filter((w) => w.isActive).map((w) => (
                              <option key={w.id} value={String(w.id)}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-gray-700 text-xs mt-6">
              {filtered.length} of {enquiries.length} enquiries &nbsp;·&nbsp; SSI Earthmovers Admin
            </p>
          </>
        )}
      </main>
    </div>
  );
}
