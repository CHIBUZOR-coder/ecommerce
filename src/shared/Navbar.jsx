import { useContext } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { cartCount, setIsUser } = useContext(ProductContext);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setIsUser(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const links = [
    { title: "Men", path: "/men" },
    { title: "Women", path: "/women" },
    { title: "Kids", path: "/kids" },
  ];

  return (
    <div className="text-white bg-black p-5 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to={"/"} className="logo font-bold text-lg">
        Zappos
      </Link>

      {/* Nav links */}
      <div className="links flex justify-between items-center gap-10">
        {links.map((item, i) => (
          <NavLink
            to={item.path}
            className={({ isActive }) => (isActive ? "text-red-600" : "text-white")}
            key={i}
          >
            {item.title}
          </NavLink>
        ))}
        {isLoggedIn && (
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "text-red-600" : "text-white")}
          >
            Orders
          </NavLink>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Logout
          </button>
        ) : (
          <Link to={"/login"}>
            <IoPersonCircleOutline className="text-xl" />
          </Link>
        )}

        <Link
          to={"/cart"}
          className="flex justify-center items-center h-4 w-4 rounded-full relative"
        >
          <MdOutlineShoppingBag className="text-white text-xl" />
          {cartCount > 0 && (
            <span className="font-semibold absolute top-[-10px] right-[-8px] text-white text-xs">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
