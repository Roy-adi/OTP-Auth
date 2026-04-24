import { useState } from "react";
import {
  Tag,
  MapPin,
  CheckCircle2,
  XCircle,
  Calendar,
  Handshake,
  Tractor,
  ShieldCheck,
  Hash,
  User,
  BadgeInfo,
  Clock,
  FileX,
} from "lucide-react";

const CATEGORY_META = {
  1: { label: "Tractor", icon: Tractor },
};

function formatPrice(price) {
  const n = parseFloat(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DocPill({ label, available }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
        available
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-400 border-slate-200"
      }`}
    >
      {available ? (
        <CheckCircle2 size={12} strokeWidth={2.5} />
      ) : (
        <XCircle size={12} strokeWidth={2} />
      )}
      {label}
    </span>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
      <Icon size={11} strokeWidth={2} />
      {children}
    </span>
  );
}

function DetailCell({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">
        {label}
      </p>
      <p className={`text-sm font-semibold text-slate-700 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function ProductCard({ product }) {
  const meta = CATEGORY_META[product.category_id] ?? CATEGORY_META[1];
  const CategoryIcon = meta.icon;

  const images = [
    { src: product.front_image, label: "Front" },
    { src: product.back_image, label: "Back" },
    { src: product.left_image, label: "Left" },
    { src: product.right_image, label: "Right" },
    { src: product.meter_image, label: "Meter" },
    { src: product.tyre_image, label: "Tyre" },
  ].filter((img) => !!img.src);

  const [activeIdx, setActiveIdx] = useState(0);

  const isNew = product.type_new_or_old === "new";
  const isRent = product.set_sell_or_rent === "rent";
  const priceStr = formatPrice(product.price);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col max-w-lg">

      {/* ── Main image ── */}
      <div className="relative h-52 bg-slate-100 overflow-hidden flex-shrink-0">
        {images.length > 0 ? (
          <img
            key={activeIdx}
            src={images[activeIdx].src}
            alt={`${product.brand_name} ${product.model_name} – ${images[activeIdx].label}`}
            className="w-full h-full object-cover transition-opacity duration-200"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon size={52} className="text-slate-300" strokeWidth={1} />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/70 text-white">
            {isNew ? "New" : "Used"} · {product.year_of_purchase}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              isRent
                ? "bg-amber-400/90 text-amber-900"
                : "bg-emerald-500/90 text-white"
            }`}
          >
            {isRent ? (
              <span className="flex items-center gap-1">
                <Clock size={10} strokeWidth={3} /> {product.rent_type}
              </span>
            ) : (
              "For Sale"
            )}
          </span>
        </div>

        {/* Price bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1 bg-white/95 rounded-xl px-3 py-1.5 border border-white/60">
            <span className="text-xs text-slate-400">₹</span>
            <span className="text-base font-bold text-slate-800">
              {priceStr.replace("₹", "")}
            </span>
          </div>
          {product.is_negotiable === 1 && (
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-xl bg-amber-400/90 text-amber-900">
              <Handshake size={11} strokeWidth={2} />
              Negotiable
            </span>
          )}
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="flex gap-1.5 px-3 py-2.5 bg-white border-b border-slate-100 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="flex flex-col items-center gap-1 flex-shrink-0 focus:outline-none"
            >
              <img
                src={img.src}
                alt={img.label}
                className={`w-14 h-11 object-cover rounded-md border-[1.5px] transition-all duration-150 ${
                  activeIdx === i
                    ? "border-emerald-500 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="text-[10px] text-slate-400 font-medium leading-none">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-4">

        {/* Title + reg */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-bold text-slate-800 leading-snug">
            {product.brand_name} {product.model_name}
          </h2>
          {product.registration_no && (
            <span className="font-mono text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
              {product.registration_no}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-xs text-slate-400 leading-relaxed -mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5">
          <Chip icon={Tag}>{meta.label}</Chip>
          {product.year_of_purchase && (
            <Chip icon={Calendar}>{product.year_of_purchase}</Chip>
          )}
          {(product.city_name || product.district_name) && (
            <Chip icon={MapPin}>
              {product.city_name || product.district_name}
              {product.state_name ? `, ${product.state_name}` : ""}
            </Chip>
          )}
          {product.pincode && (
            <Chip icon={Hash}>{product.pincode}</Chip>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Details grid */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2">
            Listing details
          </p>
          <div className="grid grid-cols-2 gap-2">
            <DetailCell label="Brand" value={product.brand_name} />
            <DetailCell label="Model" value={product.model_name} />
            <DetailCell label="Condition" value={isNew ? "New" : "Used (Old)"} />
            <DetailCell label="Mode" value={isRent ? `Rent · ${product.rent_type}` : "For Sale"} />
            <DetailCell label="State" value={product.state_name} />
            <DetailCell label="District" value={product.district_name} />
            <DetailCell label="Pincode" value={product.pincode} mono />
            <DetailCell label="Area" value={product.locality_name} />
            <DetailCell label="Listing ID" value={`#${product.id}`} mono />
            <DetailCell label="User ID" value={`#${product.user_id}`} mono />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Documents */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2">
            Documents
          </p>
          <div className="flex flex-wrap gap-2">
            <DocPill label="RC Book" available={product.rc_available === 1} />
            <DocPill label="NOC" available={product.noc_available === 1} />
            <DocPill label="Tax Docs" available={!!product.tax_documents} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            Listed {formatDate(product.created_at)}
          </div>
          {product.slug && (
            <span className="font-mono text-[10px] text-slate-300 truncate max-w-[180px]">
              {product.slug}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}