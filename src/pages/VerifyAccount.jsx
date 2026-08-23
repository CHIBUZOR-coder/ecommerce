import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import { toast } from "react-toastify";

const VerifyAccount = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    // 1. Extract uid and token that Django embedded in the verification email link
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    // 2. If either is missing the URL is malformed — show error immediately
    if (!uid || !token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        // 3. POST both values to Django — it decodes the uid, finds the user,
        //    and checks the token signature before marking the account as verified
        const res = await fetch(`${baseURL}verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          toast.success(data.message || "Account verified!");
          // 4. Give the user 2 seconds to read the success message, then redirect to login
          setTimeout(() => navigate("/login"), 2000);
        } else {
          // Token is expired or already used
          setStatus("error");
          toast.error(data.detail || "Verification failed.");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, []);

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <div className="text-center p-6">
          {status === "verifying" && <p className="text-gray-300">Verifying your account...</p>}
          {status === "success" && (
            <p className="text-green-400 text-lg font-semibold">
              Account verified! Redirecting to login...
            </p>
          )}
          {status === "error" && (
            <>
              <p className="text-red-400 text-lg font-semibold">Invalid or expired verification link.</p>
              <button
                onClick={() => navigate("/login")}
                className="mt-4 bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyAccount;
