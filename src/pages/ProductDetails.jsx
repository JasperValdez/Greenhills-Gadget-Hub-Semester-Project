import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Tag, Zap } from "lucide-react";
import toast from "react-hot-toast"; 

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
      const { data: mainProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Could not load product.");
      } else {
        setProduct(mainProduct);
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
      toast.error("Please login to continue", { icon: '🔑' });
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
        .maybeSingle();

      if (existingCart) {
        await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);
      } else {
        await supabase.from("cart").insert([{ user_id: userId, product_id: id, quantity }]);
      }
      
      // Clean, light-themed toast
      toast.success(`${product.name} added!`, {
        style: {
          borderRadius: '12px',
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
      });

    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 pb-12">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-all group font-medium">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Explore All Products
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Area */}
            <div className="lg:w-1/2 p-8 bg-gray-50/50">
              <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider border border-emerald-100">
                  {product.category}
                </span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />)}
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">{product.name}</h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">{product.description}</p>
              
              <div className="flex items-center gap-4 mb-10">
                <span className="text-4xl font-extrabold text-gray-900">₱{parseFloat(product.price).toLocaleString()}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                   {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-white shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 rounded-xl transition disabled:opacity-20"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="p-3 hover:bg-gray-50 rounded-xl transition disabled:opacity-20"
                    disabled={quantity >= product.quantity}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.quantity === 0}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:bg-gray-400"
              >
                <ShoppingCart size={22} />
                {adding ? "Updating Cart..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Similar Items */}
        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
              <Zap className="text-emerald-500" size={24} /> Similar Gadgets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <Link 
                  to={`/products/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-700" />
                  </div>
                  <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                  <p className="text-emerald-600 font-bold mt-1">₱{parseFloat(p.price).toLocaleString()}</p>
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