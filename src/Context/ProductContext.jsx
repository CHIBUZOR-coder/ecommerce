import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    if (CartItems) {
      const totalCartItem = CartItems?.reduce(
        (acc, curr) => acc + curr?.quantity,
        0,
      );
      setCartCount(totalCartItem);
    }
  }, [CartItems]);

  const HandleGetProduct = async () => {
    try {
      const res = await fetch(`${baseURL}products/`, { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        const fixImage = (url) => {
          if (!url) return url;
          const embedded = url.match(/\/media\/(https?:\/\/.+)$/);
          if (embedded) return decodeURIComponent(embedded[1]);
          return url;
        };
        const normalized = data.map((p) => ({ ...p, image: fixImage(p.image) }));
        setProducts(normalized);
        toast.success("Products fetched successfully!");
      } else {
        toast.error("Unable to fetch products!");
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  useEffect(() => {
    HandleGetProduct();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    setCartItems((prevItems) => {
      if (prevItems.length === 0) return prevItems;
      const refreshed = prevItems.map((item) => {
        const fresh = products.find((p) => parseInt(p.id) === parseInt(item.id));
        return fresh ? { ...fresh, quantity: item.quantity, size: item.size } : item;
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

  // GET /store/getcart/
  const HandleGetCart = async () => {
    try {
      const currentToken = localStorage.getItem("access_token");
      if (!currentToken) return;

      const res = await fetch(`${baseURL}getcart/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        applyCartFromBackend(data.items);
      }
    } catch (error) {
      console.log("GetCart error:", error.message);
    }
  };

  // POST /store/addCartItem/
  const AddToCart = async (prod, quantity, size) => {
    // Use the selected size, or fall back to the product's default size
    const resolvedSize = size || prod.defaultSize;

    // --- GUEST PATH (no token): work entirely with localStorage, no API call ---
    if (!token) {
      const stored = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Check if the same product AND size is already in the cart
      const exists = stored.find(
        (item) => parseInt(item.id) === parseInt(prod.id) && item.size === resolvedSize,
      );

      const updated = exists
        // Already in cart: increment its quantity, leave everything else untouched
        ? stored.map((item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === resolvedSize
              ? { ...item, quantity: item.quantity + Number(quantity) }
              : item,
          )
        // Not in cart yet: append a new entry with the chosen quantity and size
        : [...stored, { ...prod, quantity: Number(quantity), size: resolvedSize }];

      setCartItems(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      exists ? toast.info("Item quantity updated!") : toast.success("Item added to cart!");
      return;
    }

    // --- AUTHENTICATED PATH: optimistic update first, then sync with backend ---

    // Snapshot current cart so we can roll back if the server rejects the request
    const prevItems = CartItems;

    // Check if the same product AND size is already in the cart
    const existingItem = CartItems.find(
      (item) => parseInt(item.id) === parseInt(prod.id) && item.size === resolvedSize,
    );

    const optimistic = existingItem
      // Already in cart: increment its quantity
      ? CartItems.map((item) =>
          parseInt(item.id) === parseInt(prod.id) && item.size === resolvedSize
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item,
        )
      // Not in cart yet: append a new entry
      : [...CartItems, { ...prod, quantity: Number(quantity), size: resolvedSize }];

    // Update the UI immediately — no await, so React re-renders before the request fires
    setCartItems(optimistic);
    toast.success("Item added to cart!");

    try {
      // Fire the API request in the background after the UI has already updated
      const res = await fetch(`${baseURL}addCartItem/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product: prod.id, quantity: Number(quantity), size: resolvedSize }),
      });
      const data = await res.json();

      if (res.ok) {
        // Replace optimistic entry with real server data — this adds cartItemId,
        // which the minus button and trash icon need to target the correct cart line
        applyCartFromBackend(data.cart.items);
      } else {
        // Server rejected the request — undo the optimistic update
        setCartItems(prevItems);
        toast.error(data?.detail || data?.[0] || "Failed to add item to cart.");
      }
    } catch (error) {
      // Network failure — undo the optimistic update
      setCartItems(prevItems);
      console.log("AddToCart error:", error.message);
      toast.error("Something went wrong. Try again.");
    }
  };

  // PATCH /store/decrementCartItem/{id}/ — minus button (quantity - 1, deletes at 0)
  const HandleDeleteCart = async (id) => {
    if (!token) {
      const stored = JSON.parse(localStorage.getItem("cartItems")) || [];
      const exists = stored.find((item) => parseInt(item?.id) === parseInt(id));
      if (exists) {
        const updated = stored.filter((item) => parseInt(item?.id) !== parseInt(id));
        setCartItems(updated);
        localStorage.setItem("cartItems", JSON.stringify(updated));
        toast.success("Item removed!");
      } else {
        toast.error("Item does not exist in cart!");
      }
      return;
    }

    // Optimistic update for authenticated users
    const prevItems = CartItems;
    const target = CartItems.find((item) => parseInt(item.cartItemId) === parseInt(id));
    if (target) {
      const optimistic =
        target.quantity <= 1
          ? CartItems.filter((item) => parseInt(item.cartItemId) !== parseInt(id))
          : CartItems.map((item) =>
              parseInt(item.cartItemId) === parseInt(id)
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            );
      setCartItems(optimistic);
    }

    try {
      const res = await fetch(`${baseURL}decrementCartItem/${parseInt(id)}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        applyCartFromBackend(data.cart.items);
      } else {
        setCartItems(prevItems);
        toast.error(data?.detail || "Failed to update cart.");
      }
    } catch (error) {
      setCartItems(prevItems);
      console.log(error);
    }
  };

  // DELETE /store/removeCartItem/{id}/ — trash icon (removes entire line immediately)
  const HandleRemoveFromCart = async (cartItemId) => {
    if (!token) {
      const stored = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updated = stored.filter((item) => parseInt(item.id) !== parseInt(cartItemId));
      setCartItems(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      toast.success("Item removed from cart!");
      return;
    }

    // Optimistic update for authenticated users
    const prevItems = CartItems;
    setCartItems(CartItems.filter((item) => item.cartItemId !== cartItemId));
    toast.success("Item removed from cart!");

    try {
      const res = await fetch(`${baseURL}removeCartItem/${cartItemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        applyCartFromBackend(data.cart.items);
      } else {
        setCartItems(prevItems);
        toast.error(data?.detail || "Failed to remove item.");
      }
    } catch (error) {
      setCartItems(prevItems);
      console.log("RemoveFromCart error:", error.message);
      toast.error("Something went wrong. Try again.");
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // POST /store/checkout/
  const HandleCheckout = async (navigate) => {
    try {
      if (!token) {
        toast.error("Please log in to checkout.");
        navigate("/login");
        return false;
      }

      const res = await fetch(`${baseURL}checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = data.link;
        return true;
      } else if (res.status === 400) {
        // Cart is empty on backend — sync frontend to match
        await HandleGetCart();
        toast.error("Your cart is empty. Please add items before checking out.");
        return false;
      } else {
        toast.error(data?.message || "Checkout failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.log("Checkout error:", error.message);
      toast.error("Something went wrong. Try again.");
      return false;
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
        HandleRemoveFromCart,
        HandleGetCart,
        HandleCheckout,
        applyCartFromBackend,
        clearCart,
        token,
        CartItems,
        baseURL,
        setIsUser,
        isUser,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };
