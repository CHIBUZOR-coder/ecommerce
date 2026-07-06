import { createContext, useEffect, useState } from "react";
// import Products from "../../data/data";
import { toast } from "react-toastify";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    console.log("baseurl:", baseURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [products, setProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isUser, setIsUser] = useState(false);

  const [CartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || [],
  );

  const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   console.log("prod:", products);
  // }, [products]);
  useEffect(() => {
    console.log("cartItems:", CartItems);

    if (CartItems) {
      const totalCartItem = CartItems?.reduce(
        (acc, curr) => acc + curr?.quantity,
        0,
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartCount(totalCartItem);
    }
  }, [CartItems]);

  useEffect(() => {
    console.log("count:", cartCount);
  }, [cartCount]);

  const HandleGetProduct = async () => {
    try {
      const res = await fetch(`${baseURL}products/`, {
        method: "GET",
      });

      const data = await res.json();
      console.log("data:", data);
      if (res.ok) {
        console.log("data:", data);

        setProducts(data);
        toast.success("Products fetched successfully!");
      } else {
        console.log("Something went wrong!");
        toast.error("unable to fetch data!");
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    HandleGetProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddToCart = async (prod, quantity, size) => {
    try {
      // Check if user is logged in by looking for access token
      const token = localStorage.getItem("access_token");

      if (!token) {
        // =============================================
        // GUEST USER — store cart in localStorage
        // No account needed, cart lives in the browser
        // =============================================

        // 1. Get existing cart from localStorage
        // If nothing stored yet, start with empty array
        let storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        // 2. Check if this exact product+size combination already exists in cart
        // We check BOTH id AND size because:
        // Same product in size M and size L = two different cart items!
        const existingItem = storedCartItems.find(
          (item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === size,
        );

        if (existingItem) {
          // 3A. Product+size already in cart → just increase quantity
          const updatedCartItems = storedCartItems.map((item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === size
              ? {
                  ...item,
                  quantity: item.quantity + Number(quantity),
                }
              : item,
          );

          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.info("Item quantity updated!");
        } else {
          // 3B. New product+size combination → add as new cart item
          const updatedCartItems = [
            ...storedCartItems,
            {
              ...prod,
              quantity: Number(quantity),
              size: size || prod.defaultSize,
            },
          ];

          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.success("Item added to cart!");
        }
      } else {
        // =============================================
        // LOGGED IN USER — send to Django backend
        // Cart lives in the database, not localStorage
        // =============================================

        const res = await fetch("http://127.0.0.1:9000/store/addCartItem/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Attach JWT token so Django knows who this user is
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product: prod.id,
            quantity: Number(quantity),
            size: size || prod.defaultSize,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Item added to cart!");
          // Optionally update local cart state with server response
          console.log("cart item:", data.cart_item);
        } else {
          // Django returns errors like:
          // "Cannot add 2 more items. Stock is only 3."
          const message =
            data?.detail ||
            data?.non_field_errors?.[0] ||
            "Failed to add item to cart.";
          toast.error(message);
        }
      }
    } catch (error) {
      console.log("AddToCart error:", error.message);
      toast.error("Something went wrong. Try again.");
    }
  };

  const HandleUpdateCart = async (prod, quantity) => {
    try {
      if (!isUser) {
        const storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingCartItem = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(prod?.id),
        );

        if (existingCartItem) {
          const updatedCartItem = storedCartItems.map((item) =>
            parseInt(item?.id) === parseInt(prod?.id)
              ? { ...item, quantity }
              : item,
          );

          setCartItems(updatedCartItem);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItem));
          toast.success("Item updated successfully!");
        } else {
          toast.error("Item does not exist in cart!");
        }
      } else {
        console.log("Is uaser");
      }
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const HandleDeleteCart = async (id) => {
    try {
      if (!isUser) {
        const storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingCartItem = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(id),
        );

        if (existingCartItem) {
          const updatedCartItem = storedCartItems.filter(
            (item) => parseInt(item?.id) !== parseInt(id),
          );

          setCartItems(updatedCartItem);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItem));
          toast.success("Item Deleted successfully!");
        } else {
          toast.error("Item does not exist in cart!");
        }
      } else {
        console.log("this is a user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        AddToCart,
        HandleGetProduct,
        cartCount,
        HandleDeleteCart,
        HandleUpdateCart,
        CartItems,
        baseURL
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
export { ProductContext };
