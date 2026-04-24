import { Tractor, Truck, Wrench, Plane } from "lucide-react";
import ProductCard from "./ProductCard";

const CATEGORY_META = {
  1: { label: "Tractors", icon: Tractor, accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", count: "bg-emerald-600 text-white" },
};

export default function CategorySection({ categoryId, products }) {
  console.log(categoryId)
  console.log(products)
  const meta =  CATEGORY_META[1];
  const Icon = meta.icon;

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${meta.bg} ${meta.border}`}>
        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
          <Icon size={16} className={meta.accent} strokeWidth={2.5} />
        </div>
        <h3 className={`font-black text-[15px] tracking-tight ${meta.accent}`}>
          {meta.label}
        </h3>
        <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${meta.count}`}>
          {products.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ju">
        {products.map((product) => (
          <ProductCard key={`${product.category_id}-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
}