import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OTPInput from "../components/OTPInput";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { sendOtp, loginUser } from "../api/services";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const STEP = { MOBILE: "MOBILE", OTP: "OTP" };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(STEP.MOBILE);
  const [mobile, setMobile] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.mobile) {
      setMobile(location.state.mobile);
    }
  }, [location.state]);

  const decodeOtp = (encodedOtp) => {
    try {
      return atob(encodedOtp); // Base64 decode
    } catch (e) {
      console.error("Invalid OTP encoding", e);
      return "";
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const data = await sendOtp(mobile);

      const encodedOtp =
        data?.result?.response?.otp || data?.otp || data?.data?.otp || "";

      const decodedOtp = decodeOtp(encodedOtp);

      setServerOtp(decodedOtp); // store decoded OTP
      setStep(STEP.OTP);
      setSuccess("OTP sent successfully!");
      toast.success("OTP sent successfully!");
    } catch (err) {
      if (err.message.includes("503")) {
        setError(
          "503 Server is temporarily unavailable. Please try again later.",
        );
        toast.error("503 Server is temporarily unavailable. Please try again later!");
      } else {
        setError(err.message);
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otpValue.length < 4) {
      setError("Please enter the complete OTP.");
      return;
    }

    if (serverOtp && otpValue !== serverOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(mobile);
      const token = data?.result?.response?.token;

      if (token) {
        // User exists
        const userData = data?.result?.response?.data || null;
        login(token, userData);
        toast.success("Login successful!");
        navigate("/");
      } else {
        // User not registered
        navigate("/register", { state: { mobile } });
      }
    } catch (err) {
      // If error implies user not found, go to register
      const msg = err.message.toLowerCase();
      if (
        msg.includes("not found") ||
        msg.includes("not exist") ||
        msg.includes("no user") ||
        msg.includes("register")
      ) {
        navigate("/register", { state: { mobile } });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account with your mobile number"
    >
      {step === STEP.MOBILE ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="label">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 text-sm font-mono">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="input-field pl-12"
                autoFocus
              />
            </div>
          </div>

          {error && <Alert type="error" message={error} />}

          <button
            type="submit"
            disabled={loading || mobile.length < 10}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner /> Sending OTP…
              </>
            ) : (
              "Send OTP →"
            )}
          </button>

          <p className="text-center text-sm text-ink/40">
            New user?{" "}
            <Link to="/register" className="btn-ghost text-sm">
              Create account
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setStep(STEP.MOBILE);
              setError("");
              setSuccess("");
              setOtpValue("");
            }}
            className="flex items-center gap-1 text-sm text-ink/40 hover:text-ink/70 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Change number
          </button>

          <div className="text-center">
            <p className="text-sm text-ink/50">OTP sent to</p>
            <p className="font-mono font-semibold text-ink text-lg">
              +91 {mobile}
            </p>
          </div>

          <OTPInput length={6} value={otpValue} onChange={setOtpValue} />

          {/* Dev helper: show OTP from API if present */}
          {serverOtp && (
            <p className="text-xs text-center font-mono text-brand-500 bg-brand-50 rounded-lg py-1.5">
              Dev mode OTP, Remove in Prod: <strong>{serverOtp}</strong>
            </p>
          )}

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <button
            type="submit"
            disabled={loading || otpValue.length < 4}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner /> Verifying…
              </>
            ) : (
              "Verify & Sign In →"
            )}
          </button>

          <p className="text-center text-xs text-ink/30">
            Didn't receive OTP?{" "}
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-brand-500 hover:text-brand-700 underline underline-offset-2"
            >
              Resend
            </button>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
