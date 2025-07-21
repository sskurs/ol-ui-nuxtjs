"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid activation link.");
      return;
    }
    fetch(`/api/auth/activate?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Account activated! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.message || "Activation failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Activation failed. Please try again later.");
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-20">
        <h1 className="text-2xl font-bold mb-4 text-center">Account Activation</h1>
        {status === "pending" && <p className="text-gray-600 text-center">Activating your account...</p>}
        {status !== "pending" && (
          <div className={status === "success" ? "text-green-600" : "text-red-600"}>
            <p className="text-center">{message}</p>
            {status === "success" && (
              <button
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 