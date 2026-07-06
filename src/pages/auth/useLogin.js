// src/pages/auth/useLogin.js
import { useState, useCallback, useRef } from "react";
import { supabase } from "../../services/supabase/supabase";
import { useAuthStore } from "../../store/authStore";

function sanitize(str) {
  return String(str)
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, 256);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function createRateLimiter() {
  const timestamps = [];
  return {
    attempt() {
      const now = Date.now();
      while (timestamps.length && now - timestamps[0] > RATE_LIMIT_WINDOW_MS) {
        timestamps.shift();
      }
      if (timestamps.length >= RATE_LIMIT_MAX) return false;
      timestamps.push(now);
      return true;
    },
    remaining() {
      const now = Date.now();
      while (timestamps.length && now - timestamps[0] > RATE_LIMIT_WINDOW_MS) {
        timestamps.shift();
      }
      return Math.max(0, RATE_LIMIT_WINDOW_MS - (now - (timestamps[0] ?? now)));
    },
  };
}

const rateLimiter = createRateLimiter();

function validate(fields) {
  const errors = {};
  if (!fields.email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(fields.password)) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoadingState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitting = useRef(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  }, []);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting.current) return;

      setGlobalError("");

      const fieldErrors = validate(fields);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
        return;
      }

      if (!rateLimiter.attempt()) {
        const wait = Math.ceil(rateLimiter.remaining() / 1000);
        setGlobalError(
          `Too many attempts. Please wait ${wait}s before trying again.`,
        );
        return;
      }

      submitting.current = true;
      setLoadingState(true);

      try {
        const email = sanitize(fields.email);
        const { password } = fields;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("invalid") ||
            error.message.toLowerCase().includes("credentials")
          ) {
            setGlobalError("Incorrect email or password.");
          } else if (
            error.message.toLowerCase().includes("email not confirmed")
          ) {
            setGlobalError("Please verify your email before logging in.");
          } else {
            setGlobalError("Login failed. Please try again.");
          }
          return;
        }

        const user = data.user;
        if (!user?.email) {
          setGlobalError("No email associated with this account.");
          return;
        }

        // ── Check if this email exists in admins table ──
        const { data: admin, error: adminError } = await supabase
          .from("admins")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (adminError) {
          console.error("Admin lookup error:", adminError);
          setGlobalError("Unable to verify access. Please try again.");
          return;
        }

        if (!admin) {
          // Not an admin – sign out and deny access
          await supabase.auth.signOut();
          setGlobalError(
            "Your email is not registered as an administrator. Please contact support.",
          );
          return;
        }

        // ── If the admin is pending or auth_user_id is null, link and activate ──
        if (!admin.auth_user_id || admin.status === "pending") {
          const { error: updateError } = await supabase
            .from("admins")
            .update({
              auth_user_id: user.id,
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", admin.id);

          if (updateError) {
            console.error("Admin update error:", updateError);
            setGlobalError(
              "Failed to activate account. Please contact support.",
            );
            await supabase.auth.signOut();
            return;
          }

          const { data: updatedAdmin, error: fetchError } = await supabase
            .from("admins")
            .select("*")
            .eq("id", admin.id)
            .single();

          if (fetchError) {
            console.error("Failed to fetch updated admin:", fetchError);
          }

          setProfile(updatedAdmin || admin);
        } else {
          setProfile(admin);
        }

        // ── Update Zustand store with user ──
        setUser(user);
        setLoading(false);

        // ✅ Navigation removed – GuestRoute will automatically redirect to /admin
      } catch (err) {
        console.error("Login error:", err);
        setGlobalError("An unexpected error occurred. Please try again.");
      } finally {
        setLoadingState(false);
        submitting.current = false;
      }
    },
    [fields, setUser, setProfile, setLoading],
  );

  const handleGoogleLogin = useCallback(async () => {
    setGlobalError("");
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        setGlobalError("Google sign-in failed. Please try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setGlobalError("An unexpected error occurred.");
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleForgotPassword = useCallback(async () => {
    const email = sanitize(fields.email);
    if (!email || !isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter your email above to reset password.",
      }));
      return;
    }
    setLoadingState(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (!error) {
        setGlobalError("");
        alert(`Password reset link sent to ${email}`);
      } else {
        setGlobalError("Could not send reset email. Try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setGlobalError("An unexpected error occurred.");
    } finally {
      setLoadingState(false);
    }
  }, [fields.email]);

  return {
    fields,
    errors,
    globalError,
    loading,
    googleLoading,
    showPassword,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
    handleForgotPassword,
    togglePassword,
  };
}