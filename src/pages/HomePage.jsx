import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchPostDetails } from "../api/services";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { Shield, LogOut, Image, Building2 } from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["post-details"],
    queryFn: () => fetchPostDetails(90344),
    staleTime: 5 * 60 * 1000,
  });

  // Normalize profile and products from various possible API shapes
  const profile = data?.data?.user || data?.user || data?.data || user || null;
  const products =
    data?.data?.products ||
    data?.products ||
    data?.data?.posts ||
    data?.posts ||
    [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <header className="bg-white border-b border-ink/5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-ink text-lg">
              OTP Auth
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-red-500 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 page-enter">
        {/* Profile Card */}
        <section>
          <h2 className="text-xs font-semibold text-ink/30 uppercase tracking-widest mb-3">
            Profile
          </h2>
          {isLoading ? (
            <ProfileSkeleton />
          ) : isError ? (
            <div className="card p-6 space-y-3">
              <Alert
                type="error"
                message={error?.message || "Failed to load profile"}
              />
              <button
                onClick={() => refetch()}
                className="text-sm text-brand-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <ProfileCard profile={profile} />
          )}
        </section>

        {/* Posts */}
        <section>
          <h2 className="text-xs font-semibold text-ink/30 uppercase tracking-widest mb-3">
            {products.length > 0
              ? `Products & Posts (${products.length})`
              : "Products & Posts"}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id || i} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        {/* Raw data for debugging */}
        {/* {data && (
          <section>
            <details className="card p-4">
              <summary className="text-xs text-ink/30 cursor-pointer hover:text-ink/50 font-mono select-none">
                Raw API Response (dev)
              </summary>
              <pre className="mt-3 text-xs text-ink/60 overflow-auto max-h-64 font-mono leading-relaxed">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </section>
        )} */}
      </main>
    </div>
  );
}

function ProfileCard({ profile }) {
  if (!profile) {
    return (
      <div className="card p-6 text-center text-ink/30 text-sm">
        No profile data available.
      </div>
    );
  }

  const avatar =
    profile.profile_image || profile.avatar || profile.image || null;

  const fields = [
    { label: "Name", value: profile.name || profile.full_name },
    { label: "Mobile", value: profile.mobile || profile.phone },
    { label: "Email", value: profile.email },
    { label: "Company", value: profile.company_name },
    { label: "GST No", value: profile.gst_no },
    { label: "PAN No", value: profile.pan_no },
    { label: "User Type", value: profile.user_type_id },
    { label: "Location", value: profile.location_id || profile.location },
  ].filter((f) => f.value);

  return (
    <div className="card p-6">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover border border-ink/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-2xl font-display font-bold shadow-glow-sm">
              {(profile.name || profile.full_name || "U")[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-bold text-ink mb-1">
            {profile.name || profile.full_name || "User"}
          </h3>
          {(profile.mobile || profile.phone) && (
            <p className="text-sm text-ink/50 font-mono mb-3">
              +91 {profile.mobile || profile.phone}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {fields.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-ink/30 font-semibold">
                  {label}
                </p>
                <p className="text-sm text-ink/80 font-body truncate">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const image =
    product.image || product.product_image || product.thumbnail || null;
  const title =
    product.name || product.title || product.product_name || "Untitled";
  const description =
    product.description || product.details || product.body || "";
  const price = product.price || product.mrp || product.amount || null;
  const category = product.category || product.type || null;

  return (
    <div className="card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 group">
      {image ? (
        <div className="h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
          <Image className="w-10 h-10 text-brand-300" strokeWidth={1.5} />
        </div>
      )}

      <div className="p-4">
        {category && (
          <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 mb-2">
            {category}
          </span>
        )}
        <h4 className="font-semibold text-ink text-sm mb-1 line-clamp-1">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-ink/40 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        {price && (
          <p className="mt-2 text-sm font-semibold text-brand-600">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-ink/5 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-ink/5 rounded" />
          <div className="h-3 w-24 bg-ink/5 rounded" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-ink/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-40 bg-ink/5" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-ink/5 rounded-full" />
        <div className="h-4 w-3/4 bg-ink/5 rounded" />
        <div className="h-3 w-full bg-ink/5 rounded" />
        <div className="h-3 w-2/3 bg-ink/5 rounded" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-brand-300" strokeWidth={1.5} />
      </div>
      <h4 className="font-semibold text-ink/60 mb-1">No products yet</h4>
      <p className="text-sm text-ink/30">
        Products and posts will appear here.
      </p>
    </div>
  );
}
