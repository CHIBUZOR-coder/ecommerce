import { useContext } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";

const Navbar = () => {
  const { cartCount } = useContext(ProductContext);
  const links = [
    {
      title: "Men",
      path: "/men",
    },
    {
      title: "Women",
      path: "/women",
    },
    {
      title: "Kids",
      path: "/kids",
    },
  ];
  return (
    <div className=" text-white bg-black p-5 flex justify-between items-center sticky top-0 ">
      {/* Logo */}
      <Link to={"/"} className="logo">
        Zappos
      </Link>

      {/* links */}
      <div className="links flex justify-between items-center gap-10">
        {links.map((item, i) => (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              ` ${isActive ? "text-red-600" : "text-white"}  `
            }
            key={i}
          >
            {item.title}
          </NavLink>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center gap-3">
        <Link to={"/register"}>
          <IoPersonCircleOutline />
        </Link>
        <Link
          to={"/cart"}
          className="flex justify-center items-center h-4 w-4 rounded-full relative "
        >
          <MdOutlineShoppingBag className="text-white" />
          <span className=" font-semibold absolute top-[-10px] right-[-8px] text-white">
            {cartCount && cartCount}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
