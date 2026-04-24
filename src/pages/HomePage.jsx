import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchPostDetails } from "../api/services";
import { LogOut, Sprout, AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

import ProfileCard from "../components/ProfileCard";
import CategorySection from "../components/CategorySection";
import EmptyState from "../components/EmptyState";
import { ProfileSkeleton, ProductGridSkeleton } from "../components/LoadingState";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractData(data) {
  const response = data?.result?.response ?? data?.response ?? data?.data ?? null;
  const relatedData = response?.related_data ?? {};
  const categoryEntries = Object.entries(relatedData).map(([catId, products]) => ({
    categoryId: Number(catId),
    products,
  }));
  const totalProducts = categoryEntries.reduce((acc, { products }) => acc + products.length, 0);
  return { profile: response, categoryEntries, totalProducts };
}



// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ children, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
        {children}
      </span>
      {count != null && (
        <span className="text-[10px] font-bold bg-slate-800 text-white px-2.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 p-10 rounded-2xl bg-red-50 border border-red-100 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <div>
        <p className="font-bold text-red-700 text-sm">{message || "Something went wrong."}</p>
        <p className="text-xs text-red-400 mt-0.5">Please try again.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <RefreshCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, logout } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["post-details", user?.id],
    queryFn: () => fetchPostDetails(90344),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { profile, categoryEntries, totalProducts } = data
    ? extractData(data)
    : { profile: null, categoryEntries: [], totalProducts: 0 };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Navbar ───────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Sprout size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black text-slate-800 tracking-tight">
              KrishiVikas
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user?.name && (
              <span className="hidden sm:block text-xs font-semibold text-slate-400">
                {user.name}
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-150"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Bar ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-tight leading-none">
              Dealer Dashboard
            </h1>
            <p className="text-emerald-100 text-xs mt-0.5 font-medium">
              {isLoading
                ? "Loading your data..."
                : `${totalProducts} equipment listing${totalProducts !== 1 ? "s" : ""} across ${categoryEntries.length} categories`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Profile section */}
        <section>
          <SectionLabel>Dealer Profile</SectionLabel>
          {isLoading ? (
            <ProfileSkeleton />
          ) : isError ? (
            <ErrorCard message={error?.message} onRetry={refetch} />
          ) : (
            <ProfileCard />
          )}
        </section>

        {/* Products section */}
        <section>
          <SectionLabel count={!isLoading ? totalProducts : undefined}>
            Equipment Listings
          </SectionLabel>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <ErrorCard message={error?.message} onRetry={refetch} />
          ) : categoryEntries.length === 0 ? (
            <EmptyState onRetry={refetch} />
          ) : (
            <div className="flex flex-col gap-10">
              {categoryEntries.map(({ categoryId, products }) => (
                <CategorySection
                  key={categoryId}
                  categoryId={categoryId}
                  products={products}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-slate-200 mt-16 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sprout size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-slate-400">KrishiVikas</span>
          </div>
          <span className="text-xs text-slate-300">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>
      </footer>
    </div>
  );
}