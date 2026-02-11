import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase-client";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("You must be logged in to add to cart.");
      return;
    }

    const userId = userData.user.id;
    setAdding(true);

    try {
      // Check if product already in cart
      const { data: existingCart, error: existingError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", id)
        .single();

      if (existingError && existingError.code !== "PGRST116") throw existingError;

      if (existingCart) {
        // Update quantity
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);
        if (updateError) throw updateError;
      } else {
        // Insert new cart item
        const { error: insertError } = await supabase.from("cart").insert([
          {
            user_id: userId,
            product_id: id,
            quantity,
          },
        ]);
        if (insertError) throw insertError;
      }

      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart. Check console.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full md:w-1/2 h-auto rounded"
      />
      <div className="flex flex-col justify-between md:w-1/2 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-lg font-semibold mb-2">
            Price: ₱{parseFloat(product.price).toLocaleString("en-PH")}
          </p>
          <p className="mb-4">Stock: {product.quantity}</p>
          <div className="flex gap-2 items-center">
            <label>Quantity:</label>
            <input
              type="number"
              min={1}
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-1 rounded w-20"
            />
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
