import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import Input from "../shared/Input";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ new_password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  // Keeps the passwords state in sync as the user types in either field
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    // 1. Ensure both fields are filled before sending anything to the server
    if (!passwords.new_password || !passwords.confirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    // 2. Client-side match check to give instant feedback without a round trip
    if (passwords.new_password !== passwords.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    // 3. Read uid and token that Flutterwave put in the URL when they clicked the email link
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    if (!uid || !token) {
      toast.error("Invalid reset link.");
      return;
    }

    try {
      setLoading(true);
      // 4. Send uid, token, and the new password to the backend for verification and update
      const res = await fetch(`${baseURL}password-reset-confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: passwords.new_password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful! Please log in.");
        navigate("/login");
      } else {
        // Backend rejects if token is expired or already used
        toast.error(data?.detail || "Reset failed. Link may have expired.");
      }
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
          <p className="text-white font-semibold text-2xl text-center">Reset Password</p>
          <Input
            type="password"
            value={passwords.new_password}
            placeholder="New Password"
            name="new_password"
            change={HandleChange}
          />
          <Input
            type="password"
            value={passwords.confirm}
            placeholder="Confirm Password"
            name="confirm"
            change={HandleChange}
          />
          <span
            onClick={HandleSubmit}
            className={`w-full inline-block text-center font-semibold px-4 py-2 rounded-md cursor-pointer border-[1px] border-white transition duration-500
              ${loading ? "bg-gray-500 text-white cursor-not-allowed" : "bg-white text-black hover:bg-black hover:text-white"}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
