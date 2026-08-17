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

  const [CartItems, setCartItems] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("cartItems")) || [];
    const valid = stored.filter((item) => item.name && item.price != null);
    if (valid.length !== stored.length) {
      localStorage.setItem("cartItems", JSON.stringify(valid));
    }
    return valid;
  });

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
        const fixImage = (url) => {
          if (!url) return url;
          const embedded = url.match(/\/media\/(https?:\/\/.+)$/);
          if (embedded) return decodeURIComponent(embedded[1]);
          return url;
        };
        const normalized = data.map((p) => ({
          ...p,
          image: fixImage(p.image),
        }));
        setProducts(normalized);
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

  useEffect(() => {
    if (products.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems((prevItems) => {
      if (prevItems.length === 0) return prevItems;
      const refreshed = prevItems.map((item) => {
        const fresh = products.find(
          (p) => parseInt(p.id) === parseInt(item.id),
        );
        return fresh
          ? { ...fresh, quantity: item.quantity, size: item.size }
          : item;
      });
      const changed = refreshed.some((r, i) => r.image !== prevItems[i]?.image);
      if (changed) {
        localStorage.setItem("cartItems", JSON.stringify(refreshed));
        return refreshed;
      }
      return prevItems;
    });
  }, [products]);
  const token = localStorage.getItem("access_token");

  const applyCartFromBackend = (items) => {
    const cart = items.map((item) => ({
      ...item.product,
      quantity: item.quantity,
      size: item.size,
      cartItemId: item.id,
    }));
    setCartItems(cart);
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const AddToCart = async (prod, quantity, size) => {
    try {
      if (!token) {
        let storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingItem = storedCartItems.find(
          (item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === size,
        );

        if (existingItem) {
          const updatedCartItems = storedCartItems.map((item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === size
              ? { ...item, quantity: item.quantity + Number(quantity) }
              : item,
          );
          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.info("Item quantity updated!");
        } else {
          const updatedCartItems = [
            ...storedCartItems,
            { ...prod, quantity: Number(quantity), size: size || prod.defaultSize },
          ];
          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.success("Item added to cart!");
        }
      } else {
        const res = await fetch(`${baseURL}addCartItem/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          applyCartFromBackend(data.cart.items);
        } else {
          toast.error(data?.detail || "Failed to add item to cart.");
        }
      }
    } catch (error) {
      console.log("AddToCart error:", error.message);
      toast.error("Something went wrong. Try again.");
    }
  };

  const HandleDeleteCart = async (id) => {
    try {
      if (!token) {
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
        const res = await fetch(
          `${baseURL}decrementCartItem/${parseInt(id)}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          toast.success("Item Deleted successfully!");
          applyCartFromBackend(data.cart.items);
        } else {
          toast.error(data?.detail || "Failed to delete item.");
        }
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
        applyCartFromBackend,
        token,
        CartItems,
        baseURL,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
export { ProductContext };
