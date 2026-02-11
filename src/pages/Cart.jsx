import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // track which item is being updated
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert("You must be logged in to see your cart.");
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
          id: c.id,
          quantity: c.quantity,
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

  const updateQuantity = async (cartId, newQuantity) => {
    setUpdatingId(cartId);

    try {
      const item = cartItems.find((i) => i.id === cartId);
      if (!item) return;

      if (newQuantity < 1 || newQuantity > item.stock) return;

      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("id", cartId);

      if (error) throw error;

      setCartItems((prev) =>
        prev.map((i) =>
          i.id === cartId ? { ...i, quantity: newQuantity } : i
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (cartId) => {
    setRemoving(true);
    const { error } = await supabase.from("cart").delete().eq("id", cartId);
    if (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    } else {
      setCartItems(cartItems.filter((item) => item.id !== cartId));
    }
    setRemoving(false);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (cartItems.length === 0) return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border p-4 rounded">
            <div className="flex gap-4 items-center">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>Price: ₱{parseFloat(item.price).toLocaleString("en-PH")}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingId === item.id}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock || updatingId === item.id}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <p>Stock Available: {item.stock}</p>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              disabled={removing}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-bold mt-6">
        Total: ₱{total.toLocaleString("en-PH")}
      </h3>
      <Link
        to="/checkout"
        className={`inline-block mt-4 py-3 px-6 rounded text-white ${
          cartItems.some(i => i.stock === 0) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {cartItems.some(i => i.stock === 0) ? "Remove out-of-stock items" : "Proceed to Checkout"}
      </Link>
    </div>
  );
}

export default Cart;
