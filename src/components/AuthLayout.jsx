import { Shield } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative circles */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c33ef0 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a41fd0 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-2xl page-enter">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 shadow-glow mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-2">
            {title}
          </h1>

          {subtitle && (
            <p className="text-ink/50 text-sm font-body">{subtitle}</p>
          )}
        </div>

        {/* Card */}
        <div className="card p-8 shadow-card-hover">{children}</div>

        {/* Footer */}
        <p className="text-center text-ink/30 text-xs mt-6 font-body">
          © {new Date().getFullYear()} OTP Auth · Secure login
        </p>
      </div>
    </div>
  );
}
