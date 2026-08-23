import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import { toast } from "react-toastify";
import { ProductContext } from "../Context/ProductContext";

const PaymentVerify = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { clearCart } = useContext(ProductContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get("transaction_id");
    const token = localStorage.getItem("access_token");

    if (!transactionId) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${baseURL}payment/verify/?transaction_id=${transactionId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();

        if (res.ok && data.success) {
          clearCart();
          setStatus("success");
          setOrder(data.order);
          toast.success("Payment successful!");
        } else {
          setStatus("failed");
          toast.error(data?.message || "Payment verification failed.");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, []);

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <div className="text-center flex flex-col gap-4 max-w-md w-full p-6">
          {status === "verifying" && (
            <p className="text-gray-300">Verifying your payment...</p>
          )}

          {status === "success" && (
            <>
              <p className="text-green-400 text-2xl font-bold">Payment Successful!</p>
              {order && (
                <div className="border border-white rounded-md p-4 text-left text-sm flex flex-col gap-1">
                  <p>Order ID: <span className="font-semibold">#{order.id}</span></p>
                  <p>Total: <span className="font-semibold">N{order.total_price}</span></p>
                  <p>Status: <span className="font-semibold text-green-400">{order.status}</span></p>
                </div>
              )}
              <button
                onClick={() => navigate("/orders")}
                className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
              >
                View My Orders
              </button>
            </>
          )}

          {status === "failed" && (
            <>
              <p className="text-red-400 text-2xl font-bold">Payment Failed</p>
              <p className="text-gray-400 text-sm">
                Something went wrong with your payment. Please try again.
              </p>
              <button
                onClick={() => navigate("/cart")}
                className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
              >
                Back to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentVerify;
