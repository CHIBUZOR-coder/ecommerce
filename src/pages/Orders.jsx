import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import { toast } from "react-toastify";

const statusColors = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-gray-100 text-gray-700",
};

const Orders = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please log in to view orders.");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${baseURL}orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          toast.error("Failed to load orders.");
        }
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-16">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No orders yet.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-gray-900">N{order.total_price}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm text-gray-600">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-9 h-9 rounded-md object-cover border border-gray-100"
                      />
                      <span className="flex-1 font-medium text-gray-800">{item.product?.name}</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                      <span className="font-semibold text-gray-900">N{item.price_at_purchase}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
