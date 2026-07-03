import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useCancelAppointment(token) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      if (!token) {
        if (isMounted) {
          setError("Missing cancellation token.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/validate-token?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json();
        if (!res.ok) {
          if (isMounted) {
            setError(data.error || "Invalid or expired link.");
            setLoading(false);
          }
          return;
        }
        if (isMounted) {
          setAppointment(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Unable to validate your request. Please try again later.");
          setLoading(false);
        }
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const cancelAppointment = useCallback(async () => {
    if (!appointment) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/cancel-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel appointment.");
        setCancelling(false);
        return;
      }
      navigate("/cancel-confirmation");
    } catch {
      setError("An error occurred. Please try again.");
      setCancelling(false);
    }
  }, [appointment, token, navigate]);

  return { loading, appointment, error, cancelling, cancelAppointment };
}
