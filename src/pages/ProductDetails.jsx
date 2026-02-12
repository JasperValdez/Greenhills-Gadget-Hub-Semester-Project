import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Tag } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      setLoading(true);
      // Fetch Main Product
      const { data: mainProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProduct(mainProduct);
        
        // Fetch Similar Products (Same category, excluding current ID)
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category", mainProduct.category)
          .neq("id", id)
          .limit(4);
        setSimilarProducts(related || []);
      }
      setLoading(false);
    };

    fetchProductAndSimilar();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("Please login to add items to your cart.");
      return;
    }

    const userId = userData.user.id;
    setAdding(true);

    try {
      const { data: existingCart } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", id)
        .single();

      if (existingCart) {
        await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);
      } else {
        await supabase.from("cart").insert([
          { user_id: userId, product_id: id, quantity },
        ]);
      }
      alert("Added to cart successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Store
        </Link>

        {/* Main Product Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="flex flex-col md:row lg:flex-row">
            {/* Image Wrap */}
            <div className="lg:w-1/2 p-4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
            </div>

            {/* Details Wrap */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.category}
                </span>
                <div className="flex text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} />
                </div>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">₱{parseFloat(product.price).toLocaleString()}</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-lg ${product.quantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded-xl transition shadow-sm disabled:opacity-30"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="p-2 hover:bg-white rounded-xl transition shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm italic">Max available: {product.quantity}</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.quantity === 0}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 disabled:opacity-50"
              >
                <ShoppingCart size={22} />
                {adding ? "Adding to Cart..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Tag className="text-blue-500" /> You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <Link 
                  to={`/products/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 line-clamp-1">{p.name}</h3>
                  <p className="text-blue-600 font-bold">₱{parseFloat(p.price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;