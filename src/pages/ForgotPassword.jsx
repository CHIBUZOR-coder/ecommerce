import { useState } from "react";
import Layout from "../shared/Layout";
import Input from "../shared/Input";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${baseURL}password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      await res.json();
      setSent(true);
      toast.success("If that email exists, a reset link has been sent.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md flex flex-col gap-6 border-white border-[4px] rounded-md p-6">
          <p className="text-white font-semibold text-2xl text-center">Forgot Password</p>
          {sent ? (
            <p className="text-green-400 text-center text-sm">
              Check your email for a reset link.
            </p>
          ) : (
            <>
              <Input
                type="text"
                value={email}
                placeholder="Email Address"
                name="email"
                change={(e) => setEmail(e.target.value)}
              />
              <span
                onClick={HandleSubmit}
                className={`w-full inline-block text-center font-semibold px-4 py-2 rounded-md cursor-pointer border-[1px] border-white transition duration-500
                  ${loading ? "bg-gray-500 text-white cursor-not-allowed" : "bg-white text-black hover:bg-black hover:text-white"}`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </span>
            </>
          )}
          <p className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <span
              className="text-white cursor-pointer underline hover:text-gray-300"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
