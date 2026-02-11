import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert("You must be logged in to checkout.");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("cart")
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            quantity,
            description
          )
        `)
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart. Check console.");
      } else {
        const items = data.map((c) => ({
          cart_id: c.id,
          quantity: c.quantity,
          id: c.products?.id,
          name: c.products?.name,
          price: c.products?.price,
          image_url: c.products?.image_url,
          stock: c.products?.quantity,
          description: c.products?.description,
        }));
        setCartItems(items);
      }

      setLoading(false);
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !address) return alert("Please fill all fields");
    if (cartItems.length === 0) return alert("Your cart is empty");

    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not logged in");

      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Insert order
      const { error: orderError } = await supabase.from("orders").insert([
        {
          user_id: userData.user.id,
          customer_name: name,
          customer_email: email,
          customer_address: address,
          items: orderItems,
          total_price: total,
          status: "pending",
        },
      ]);
      if (orderError) throw orderError;

      // Clear cart
      const cartIds = cartItems.map((item) => item.cart_id);
      const { error: deleteError } = await supabase
        .from("cart")
        .delete()
        .in("id", cartIds);
      if (deleteError) throw deleteError;

      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error placing order. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (cartItems.length === 0) return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.cart_id} className="flex justify-between mb-2 border-b pb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₱{(item.price * item.quantity).toLocaleString("en-PH")}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4">
          <span>Total:</span>
          <span>₱{total.toLocaleString("en-PH")}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
