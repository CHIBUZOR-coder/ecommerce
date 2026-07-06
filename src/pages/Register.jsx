import { useContext, useEffect, useState } from "react";
import Layout from "../shared/Layout";
import Input from "../shared/Input";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductContext } from "../Context/ProductContext";

const Register = () => {
  const { baseURL } = useContext(ProductContext);
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  const HandleChange = (e) => {
    const { value, name, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setUserData((prev) => ({ ...prev, [name]: file }));
      // Turn file into a temporary URL for preview
      setImagePreview(URL.createObjectURL(file));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate required fields
    if (
      !userData.name ||
      !userData.email ||
      !userData.phone ||
      !userData.password
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    // 2. Check passwords match
    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // 3. Build FormData — required because we're sending an image
      // JSON.stringify() cannot carry file data, FormData can
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("username", userData.username);
      formData.append("password", userData.password);

      // Only append image if user selected one (it's optional)
      if (userData.image) {
        formData.append("image", userData.image);
      }

      // 4. Send request to Django
      // No Content-Type header! Browser sets it automatically with FormData
      const res = await fetch(`${baseURL}register/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // 5. Handle response
      if (res.ok) {
        toast.success(
          "Registration successful! Check your email to verify your account.",
        );
        window.location.href = "/login";
      } else {
        // Django returns different error shapes — check each one
        const message =
          data?.detail ||
          data?.email?.[0] ||
          data?.password?.[0] ||
          data?.phone?.[0] ||
          "Registration failed. Please try again.";
        toast.error(message);
      }
    } catch (error) {
      // Only fires for network errors (server down, no internet)
      console.log("error:", error.message);
      toast.error("Something went wrong. Check your connection.");
    } finally {
      // Always runs — resets loading whether success or failure
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen p-4">
        <div className="w-1/2 flex justify-center items-center flex-col border-white border-[4px] rounded-md mx-auto">
          <p className="text-white font-semibold text-lg text-center">
            Register
          </p>

          <div className="w-full flex flex-col gap-4 p-3">
            <Input
              type="text"
              value={userData.name}
              placeholder={"Full Name"}
              name={"name"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.email}
              placeholder={"Email"}
              name={"email"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.phone}
              placeholder={"Phone"}
              name={"phone"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.username}
              placeholder={"Username"}
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
            <Input
              type="password"
              value={userData.confirmPassword}
              placeholder={"Confirm Password"}
              name={"confirmPassword"}
              change={HandleChange}
            />

            {/* Image upload */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm">
                Profile Image (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={HandleChange}
                className="text-white"
              />
              {/* Only shows after user picks an image */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover mt-2"
                />
              )}
            </div>
          </div>

          <div className="w-full p-3">
            <span
              onClick={HandleSubmit}
              className={`w-full inline-block text-center font-semibold px-4 py-2 rounded-md cursor-pointer border-[1px] border-white transition duration-500
                ${
                  loading
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
            >
              {loading ? "Registering..." : "Submit"}
            </span>
          </div>

          <p className="pb-3 text-sm text-gray-400">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-white underline hover:text-gray-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
