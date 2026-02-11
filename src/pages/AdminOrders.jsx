import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mark order as completed
  const markCompleted = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update order.");
    } else {
      alert("Order marked as completed!");
      fetchOrders(); // refresh orders
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Total Price</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.customer_name}</td>
                  <td className="border px-4 py-2">{order.customer_email}</td>
                  <td className="border px-4 py-2">{order.customer_address}</td>
                  <td className="border px-4 py-2">
                    {order.items
                      ? order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.name} x {item.quantity}
                          </div>
                        ))
                      : "No items"}
                  </td>
                  <td className="border px-4 py-2">${order.total_price}</td>
                  <td className="border px-4 py-2 capitalize">{order.status}</td>
                  <td className="border px-4 py-2">
                    {order.status !== "completed" && (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => markCompleted(order.id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
