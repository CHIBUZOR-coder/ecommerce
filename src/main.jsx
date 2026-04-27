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


const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Men />,
        path: "men",
      },
      {
        element: <Women />,
        path: "women",
      },
      {
        element: <Kids />,
        path: "kids",
      },
      {
        element: <SinglesProductPage />,
        path: "singleproduct/:id",
      },
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
