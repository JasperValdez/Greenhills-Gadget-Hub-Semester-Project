import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Tag, Zap, ChevronDown, Info } from "lucide-react";
import toast from "react-hot-toast"; 

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false); // State for collapse

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
        
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-all group font-medium text-sm">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Shop
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Area */}
            <div className="lg:w-1/2 p-6 md:p-12 bg-gray-50/30">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-white shadow-sm flex items-center justify-center border border-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-1/2 p-8 md:p-14 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                  {product.category}
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl md:text-4xl font-black text-gray-900">₱{parseFloat(product.price).toLocaleString()}</span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${product.quantity > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   {product.quantity > 0 ? `IN STOCK: ${product.quantity}` : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Collapsible Description Section */}
              <div className="mb-10 border-t border-b border-gray-50 py-4">
                <button 
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="w-full flex items-center justify-between py-2 text-gray-900 group"
                >
                  <span className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                    <Info size={16} className="text-emerald-500" /> Product Details
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-300 ${isDescOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {isDescOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 text-sm leading-relaxed pt-4 pb-2">
                        {product.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isDescOpen && (
                   <p className="text-gray-400 text-sm line-clamp-1 mt-1 opacity-60">
                     {product.description}
                   </p>
                )}
              </div>

              {/* Quantity & Action */}
              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-gray-50/50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition disabled:opacity-20"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition disabled:opacity-20"
                      disabled={quantity >= product.quantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.quantity === 0}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold text-base hover:bg-emerald-600 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:bg-gray-400"
                >
                  <ShoppingCart size={20} />
                  {adding ? "Updating Cart..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Items */}
        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-black mb-8 text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <Link 
                  to={`/products/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded-[2rem] p-4 border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-50">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors px-1">{p.name}</h3>
                  <p className="text-gray-400 font-medium text-xs mt-1 px-1">₱{parseFloat(p.price).toLocaleString()}</p>
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