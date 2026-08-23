import { useContext, useState } from "react";
import Layout from "../shared/Layout";
import Input from "../shared/Input";
import { toast } from "react-toastify";
import { ProductContext } from "../Context/ProductContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { baseURL, CartItems, applyCartFromBackend, HandleGetCart } = useContext(ProductContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "", // ← Django uses email as username field
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation before hitting the API
    if (!userData.username || !userData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseURL}login/`, {
        method: "POST",
        // ← tell Django we're sending JSON
        headers: {
          "Content-Type": "application/json",
        },
        // ← convert JS object to JSON string
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("data:", data);

        // Save tokens to localStorage
        // so future requests can attach them automatically
        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (CartItems?.length > 0) {
          let lastData = null;
          for (const item of CartItems) {
            const syncRes = await fetch(`${baseURL}addCartItem/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                product: item.id,
                quantity: item.quantity,
                size: item.size,
              }),
            });
            lastData = await syncRes.json();
          }
          if (lastData?.cart?.items) {
            applyCartFromBackend(lastData.cart.items);
          }
          toast.success("Cart items synced successfully!");
        } else {
          await HandleGetCart();
        }

        toast.success("Login successful!");

        // Redirect to home page
        navigate("/");
      } else {
        // Django returns error in different shapes:
        // { detail: "Invalid email or password." }
        // { non_field_errors: ["..."] }
        const message =
          data?.detail ||
          data?.non_field_errors?.[0] ||
          "Login failed. Please try again.";

        toast.error(message);
      }
    } catch (error) {
      // This catches network errors (server down, no internet)
      console.log("error:", error.message);
      toast.error("Something went wrong. Check your connection.");
    } finally {
      // Always runs — success or failure
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md flex flex-col gap-6 border-white border-[4px] rounded-md p-6">
          <p className="text-white font-semibold text-2xl text-center">Login</p>

          <div className="flex flex-col gap-4">
            <Input
              type="text"
              value={userData.username}
              placeholder={"Email Address"}
              name={"username"}
              change={HandleChange}
            />
            <Input
              type="password"
              value={userData.password}
              placeholder={"Password"}
              name={"password"}
              change={HandleChange}
            />
          </div>

          {/* Forgot password link */}
          <p
            className="text-sm text-gray-400 text-right cursor-pointer hover:text-white transition duration-300"
            onClick={() => (window.location.href = "/forgot-password")}
          >
            Forgot Password?
          </p>

          {/* Submit button */}
          <span
            onClick={HandleSubmit}
            className={`w-full inline-block text-center font-semibold px-4 py-2 rounded-md cursor-pointer border-[1px] border-white transition duration-500
              ${
                loading
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </span>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-white cursor-pointer underline hover:text-gray-300"
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
