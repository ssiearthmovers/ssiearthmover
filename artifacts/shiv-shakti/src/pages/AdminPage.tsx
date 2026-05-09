import { useState, useEffect, useCallback } from "react";
import {
  LogOut,
  RefreshCw,
  Search,
  Phone,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "/api";
const TOKEN_KEY = "ssi_admin_token";

interface Enquiry {
  id: number;
  name: string;
  phone: string;
  machine: string | null;
  part: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "new")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30">
        <AlertCircle className="w-3 h-3" /> New
      </span>
    );
  if (status === "in-progress")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
        <Clock className="w-3 h-3" /> In Progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/30">
      <CheckCircle2 className="w-3 h-3" /> Completed
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token);
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
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">
            Admin Console
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            SSI Earthmovers — Restricted Access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-8 flex flex-col gap-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-[#0D0F12] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg px-4 py-3.5 text-white placeholder-gray-600 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] text-black py-4 rounded-lg font-black uppercase tracking-wide hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchEnquiries = useCallback(async (tok: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        return;
      }
      const data = (await res.json()) as Enquiry[];
      setEnquiries(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load enquiries. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchEnquiries(token);
  }, [token, fetchEnquiries]);

  const handleLogin = (tok: string) => setToken(tok);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setEnquiries([]);
  };

  const updateStatus = async (id: number, status: string) => {
    if (!token) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = (await res.json()) as Enquiry;
        setEnquiries((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e)),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      (e.machine ?? "").toLowerCase().includes(q) ||
      (e.part ?? "").toLowerCase().includes(q) ||
      (e.message ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    inProgress: enquiries.filter((e) => e.status === "in-progress").length,
    completed: enquiries.filter((e) => e.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="bg-[#16181D] border-b border-[#2A2E37] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#F5A623]" />
            <div>
              <span className="font-black text-white text-lg tracking-wide">
                Admin Console
              </span>
              <span className="hidden sm:inline text-gray-500 text-sm ml-2">
                — SSI Earthmovers
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => token && fetchEnquiries(token)}
              disabled={loading}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/5 disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Enquiries", value: stats.total, color: "text-white", bg: "bg-[#16181D]", border: "border-[#2A2E37]" },
            { label: "New", value: stats.new, color: "text-[#F5A623]", bg: "bg-[#F5A623]/5", border: "border-[#F5A623]/20" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/20" },
            { label: "Completed", value: stats.completed, color: "text-green-400", bg: "bg-green-500/5", border: "border-green-500/20" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-5`}>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, phone, machine, part…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 transition-colors text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#16181D] border border-[#2A2E37] focus:border-[#F5A623] outline-none rounded-lg pl-4 pr-9 py-2.5 text-white transition-colors text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl p-16 flex flex-col items-center text-center gap-4">
            <Inbox className="w-12 h-12 text-gray-600" />
            <div>
              <p className="text-white font-bold text-lg">
                {enquiries.length === 0 ? "No enquiries yet" : "No results found"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {enquiries.length === 0
                  ? "Enquiries from the contact form will appear here."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div className="bg-[#16181D] border border-[#2A2E37] rounded-xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2E37] text-gray-500 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-4 font-semibold">#</th>
                    <th className="text-left px-5 py-4 font-semibold">Date</th>
                    <th className="text-left px-5 py-4 font-semibold">Name</th>
                    <th className="text-left px-5 py-4 font-semibold">Phone</th>
                    <th className="text-left px-5 py-4 font-semibold">Machine</th>
                    <th className="text-left px-5 py-4 font-semibold">Part</th>
                    <th className="text-left px-5 py-4 font-semibold">Message</th>
                    <th className="text-left px-5 py-4 font-semibold">Status</th>
                    <th className="text-left px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr
                      key={e.id}
                      className={`border-b border-[#2A2E37]/50 hover:bg-white/[0.02] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                        #{e.id}
                      </td>
                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(e.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                        {e.name}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <a
                          href={`tel:${e.phone}`}
                          className="text-[#F5A623] hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {e.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-gray-300">
                        {e.machine || <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-300">
                        {e.part || <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-400 max-w-[200px]">
                        <span
                          className="block truncate"
                          title={e.message ?? ""}
                        >
                          {e.message || <span className="text-gray-600">—</span>}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={e.status}
                            disabled={updatingId === e.id}
                            onChange={(ev) => updateStatus(e.id, ev.target.value)}
                            className="appearance-none bg-transparent border-0 outline-none cursor-pointer text-xs pr-5 disabled:opacity-50"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <StatusBadge status={e.status} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${e.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.name}, regarding your enquiry for ${e.part ?? "motor grader parts"} — `)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-xs font-semibold"
                          >
                            <FaWhatsapp className="w-3.5 h-3.5" />
                            Reply
                          </a>
                          <button
                            onClick={() =>
                              updateStatus(
                                e.id,
                                e.status === "new"
                                  ? "in-progress"
                                  : e.status === "in-progress"
                                    ? "completed"
                                    : "new",
                              )
                            }
                            disabled={updatingId === e.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-xs disabled:opacity-40"
                            title="Cycle status"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-[#2A2E37]">
              {filtered.map((e) => (
                <div key={e.id} className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{e.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {formatDate(e.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Phone</p>
                      <a
                        href={`tel:${e.phone}`}
                        className="text-[#F5A623] font-semibold"
                      >
                        {e.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Machine</p>
                      <p className="text-gray-300">{e.machine || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Part</p>
                      <p className="text-gray-300">{e.part || "—"}</p>
                    </div>
                  </div>
                  {e.message && (
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-0.5">Message</p>
                      <p className="text-gray-400 text-sm">{e.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/${e.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.name}, regarding your enquiry for ${e.part ?? "motor grader parts"} — `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      Reply on WhatsApp
                    </a>
                    <div className="relative">
                      <select
                        value={e.status}
                        disabled={updatingId === e.id}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        className="bg-[#1A1D24] border border-[#2A2E37] rounded-lg text-xs text-white px-3 py-1.5 outline-none focus:border-[#F5A623] cursor-pointer disabled:opacity-50"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <p className="text-center text-gray-700 text-xs mt-8">
          Showing {filtered.length} of {enquiries.length} enquiries &nbsp;·&nbsp; SSI Earthmovers Admin Console
        </p>
      </main>

      {/* Floating WhatsApp helper */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919953105738"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-lg hover:brightness-110 transition-all text-sm font-bold"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span className="hidden sm:inline">Open WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
