import { useContext, useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { ProductContext } from "../Context/ProductContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { AddToCart, CartItems, HandleDeleteCart, HandleRemoveFromCart, HandleCheckout, HandleGetCart, token } =
    useContext(ProductContext);
  const navigate = useNavigate();
  const [Total, setTotal] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (token) {
      HandleGetCart();
    }
  }, []);

  useEffect(() => {
    const total = CartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    if (total) {
      setTotal(total);
    }
  }, [CartItems]);

  const handleCheckoutClick = async () => {
    setCheckoutLoading(true);
    const success = await HandleCheckout(navigate);
    if (!success) {
      setCheckoutLoading(false);
    }
    // On success, window.location.href redirects away — no need to reset
  };

  return (
    <Layout>
      {/* Flutterwave redirect overlay */}
      {checkoutLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
          {/* Spinner */}
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-white text-lg font-semibold">Redirecting to Flutterwave...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait, do not close this page.</p>
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Cart{" "}
          <span className="text-sm font-normal text-gray-400">
            ({CartItems.length} items)
          </span>
        </h1>

        {CartItems?.length === 0 ? (
          <p className="text-gray-400 text-center py-16">Your cart is empty.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                    <th className="text-left pb-3 pr-4">Item</th>
                    <th className="text-center pb-3 px-4">Size</th>
                    <th className="text-center pb-3 px-4">Price</th>
                    <th className="text-center pb-3 px-4">Qty</th>
                    <th className="text-center pb-3 px-4">Total</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {CartItems?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Item */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-3 px-4 text-center">
                        <span className="border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-500">
                          {item.size || item.defaultSize}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-center text-gray-500">
                        N{item.price}
                      </td>

                      {/* Qty stepper */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              HandleDeleteCart(
                                token ? Number(item?.cartItemId) : Number(item.id),
                              )
                            }
                            className="w-7 h-7 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center border-x border-gray-200 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => AddToCart(item, Number(item.quantity) + 1)}
                            className="w-7 h-7 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-center font-semibold text-gray-900">
                        {Number(item.price * item.quantity)}
                      </td>

                      {/* Delete */}
                      <td className="py-3 text-center">
                        <button
                          onClick={() =>
                            HandleRemoveFromCart(token ? item.cartItemId : item.id)
                          }
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M1 3h12M5 3V2h4v1M3 3l.7 9h6.6L11 3"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-6 mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-500">
                Total:{" "}
                <span className="text-lg font-bold text-gray-900">N{Total}</span>
              </p>
              <button
                onClick={handleCheckoutClick}
                disabled={checkoutLoading}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${checkoutLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
              >
                {checkoutLoading ? "Redirecting..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
