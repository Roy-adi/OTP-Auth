import {
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  FileText,
  Layers,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Badge({ children, color = "emerald" }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${map[color]}`}
    >
      {children}
    </span>
  );
}

function StatPill({ value, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-3">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-emerald-500" />
        <span className="text-xl font-black text-slate-800 leading-none">
          {value}
        </span>
      </div>
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
        {label}
      </span>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, mono = false, wide = false }) {
  if (!value) return null;
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 transition-colors ${wide ? "col-span-2 sm:col-span-3" : ""}`}
    >
      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-emerald-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-slate-700 break-words ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfileCard() {
  const { user } = useAuth();
  const profile = user || null;

  console.log(profile,'profile')

  if (!profile) return null;

  const initials = (profile.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const totalProducts = profile.related_data
    ? Object.values(profile.related_data).reduce((a, b) => a + b.length, 0)
    : 0;

  const categoryCount = profile.related_data
    ? Object.keys(profile.related_data).length
    : 0;

  const details = [
    { icon: Phone, label: "Mobile", value: profile.mobile, mono: true },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: CreditCard, label: "GST No", value: profile.gst_no, mono: true },
    { icon: FileText, label: "PAN No", value: profile.pan_no, mono: true },
    { icon: MapPin, label: "Address", value: profile.address, wide: true },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Banner */}

      <div className="px-6 pb-6 mt-10">
        {/* Header row */}
        <div className="flex flex-wrap items-end gap-4 -mt-10 mb-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-black select-none">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
            </span>
          </div>

          {/* Name block */}
          <div className="flex-1 min-w-0 pb-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {profile.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 size={12} className="text-slate-400" />
              <span className="text-sm text-slate-400 font-medium">
                {profile.company_name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge color="emerald">Active</Badge>
              {profile.state_name && (
                <Badge color="sky">{profile.state_name}</Badge>
              )}
              {profile.district_name && (
                <Badge color="violet">{profile.district_name}</Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
            <StatPill value={totalProducts} label="Listings" icon={Package} />
            <div className="w-px bg-slate-200" />
            <StatPill value={categoryCount} label="Categories" icon={Layers} />
          </div>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          {details.map((d) => (
            <DetailItem key={d.label} {...d} />
          ))}
        </div>
      </div>
    </div>
  );
}
