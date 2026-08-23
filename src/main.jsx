import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Men from "./pages/Men.jsx";
import Women from "./pages/Women.jsx";
import Kids from "./pages/Kids.jsx";
import ProductProvider from "./Context/ProductContext.jsx";
import SinglesProductPage from "./pages/SinglesProductPage/SinglesProductPage.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import VerifyAccount from "./pages/VerifyAccount.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import PaymentVerify from "./pages/PaymentVerify.jsx";
import Orders from "./pages/Orders.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      { element: <Home />, index: true },
      { element: <Men />, path: "men" },
      { element: <Women />, path: "women" },
      { element: <Kids />, path: "kids" },
      { element: <Register />, path: "register" },
      { element: <Login />, path: "login" },
      { element: <SinglesProductPage />, path: "singleproduct/:id" },
      { element: <Cart />, path: "cart" },
      { element: <VerifyAccount />, path: "verify-account" },
      { element: <ForgotPassword />, path: "forgot-password" },
      { element: <ResetPassword />, path: "reset-password" },
      { element: <PaymentVerify />, path: "payment/verify" },
      { element: <Orders />, path: "orders" },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ProductProvider>
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  </ProductProvider>,
);
