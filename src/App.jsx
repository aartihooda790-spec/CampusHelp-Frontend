
import { useEffect, useState } from "react";
import TicketDashboard from "./TicketDashboard";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  async function loadProfile(accessToken) {
    const response = await fetch(`${API_BASE}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Campus profile not found. Please contact your administrator."
        );
      }

      throw new Error(
        `Profile verification failed (${response.status}).`
      );
    }

    const data = await response.json();
    setProfile(data);
    return data;
  }

  // Restore existing Supabase session
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setMessage("Supabase is not configured. Check your .env file.");
          setCheckingSession(false);
        }
        return;
      }

      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.access_token) {
          try {
            const response = await fetch(`${API_BASE}/api/users/me`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json"
              }
            });

            if (response.ok) {
              const userProfile = await response.json();

              if (mounted) {
                setProfile(userProfile);
              }
            } else {
              // Keep the user on login screen.
              // Do not show a session error during page loading.
              console.warn(
                "Campus profile verification returned:",
                response.status
              );
            }
          } catch (error) {
            console.error("Profile restoration failed:", error);
          }
        }
      } catch (error) {
        console.error("Session restoration error:", error);
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    restoreSession();

    const {
      data: { subscription }
    } = supabase?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && mounted) {
        setProfile(null);
        setPassword("");
      }
    }) || { data: { subscription: null } };

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in
  async function handleSignIn(e) {
    e.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

      if (error) throw error;

      if (!data.session?.access_token) {
        throw new Error("Access token is missing.");
      }

      await loadProfile(data.session.access_token);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(error.message || "Unable to sign in.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Forgot password
  async function handlePasswordReset() {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your registered email first.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const { error } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin
        });

      if (error) throw error;

      setMessage("Password reset link sent. Please check your email.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Unable to send reset link.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Sign out
  async function handleSignOut() {
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setProfile(null);
      setEmail("");
      setPassword("");
      setMessage("");
    } catch (error) {
      console.error("Sign out error:", error);
      alert(error.message || "Unable to sign out.");
    }
  }

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #f4f6fb, #e9edf7)",
    fontFamily: "Arial, sans-serif"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "36px",
    borderRadius: "18px",
    boxShadow: "0 12px 40px rgba(20, 35, 70, 0.12)"
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #d9deea",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none"
  };

  const buttonStyle = {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#173b70",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  if (checkingSession) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#173b70" }}>CampusHelp</h2>
          <p>Checking your login session...</p>
        </div>
      </div>
    );
  }

  if (profile) {
    return (
      <TicketDashboard
        profile={profile}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "38px" }}>🎓</div>
          <h1 style={{ color: "#173b70", margin: "12px 0 6px", fontSize: "28px" }}>
            CampusHelp
          </h1>
          <p style={{ color: "#68758b", margin: 0 }}>
            Sign in to your campus account
          </p>
        </div>

        {message && (
          <div
            role="alert"
            style={{
              padding: "12px",
              marginBottom: "18px",
              borderRadius: "8px",
              background: messageType === "success" ? "#e8f7ed" : "#fff0f0",
              color: messageType === "success" ? "#176b35" : "#b42318",
              fontSize: "14px"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSignIn}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#26364d" }}>
            Email Address
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ ...inputStyle, marginBottom: "20px" }}
          />

          <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#26364d" }}>
            Password
          </label>

          <div style={{ position: "relative", marginBottom: "12px" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "75px" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#173b70",
                cursor: "pointer"
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div style={{ textAlign: "right", marginBottom: "22px" }}>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loading}
              style={{
                border: "none",
                background: "transparent",
                color: "#173b70",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#8490a3", fontSize: "12px", marginTop: "26px", marginBottom: 0 }}>
          CampusHelp | Smart Campus Support System
        </p>
      </div>
    </div>
  );
}
