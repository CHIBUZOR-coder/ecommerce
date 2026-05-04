import { createContext, useEffect, useState } from "react";
// import Products from "../../data/data";
import { toast } from "react-toastify";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
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
      const res = await fetch("http://localhost:8000/products", {
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
  }, []);

  const AddToCart = async (prod, quantity, size) => {
    try {
      if (!isUser) {
        //get the local cart
        let storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || []; //localStorage Cart
        let updatedCartItems;

        //find existing cart
        const existingCartItems = storedCartItems.find(
          (item) =>
            parseInt(item.id) === parseInt(prod.id) && item.size === size,
        );

        if (existingCartItems) {
          //add quantity if  existing

          console.log("exsit:", existingCartItems);

          updatedCartItems = storedCartItems.map((item) =>
            parseInt(item.id) === parseInt(prod.id)
              ? {
                  ...item,
                  quantity: item.quantity + Number(quantity),
                  size: size || item.defaultSize,
                }
              : item,
          );
          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.info("Item quantity added");
        } else {
          //Add new product

          updatedCartItems = [
            ...storedCartItems,
            {
              ...prod,
              quantity: Number(quantity),
              size: size || prod.size,
            },
          ];

          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          toast.success("Item added to cart Successfully");
        }
      } else {
        console.log("this is a user");
      }
    } catch (error) {
      console.log(error);
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
export { ProductContext };
