import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";
import { Tag, Box, ShoppingCart } from "lucide-react"; // icons

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("Error fetching products:", error);
      else setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10 text-xl animate-pulse">Loading products...</p>;
  if (products.length === 0) return <p className="text-center mt-10 text-xl">No products found.</p>;

  return (
    <div className="mt-6">

      {/* Big Hero Container */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-12 flex flex-col items-center text-center text-white animate-fadeIn">
        <ShoppingCart size={64} className="mb-4 animate-bounce"/>
        <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">Our Latest Gadgets</h1>
        <p className="text-xl text-white/90">Discover, explore, and shop the best tech products in our store!</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 mt-10">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                className="h-48 w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            )}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-800">{p.name}</h2>
              <p className="text-gray-600 mb-2 flex-1">{p.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={18} className="text-gray-500"/>
                <span className="font-semibold text-gray-800">₱{parseFloat(p.price).toLocaleString("en-PH")}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Box size={18} className="text-gray-500"/>
                <span className="text-gray-700">Stock: {p.quantity}</span>
              </div>
              <Link
                to={`/products/${p.id}`}
                className="mt-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl text-center hover:scale-105 hover:shadow-lg transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
