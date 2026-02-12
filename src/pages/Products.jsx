import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Link, useSearchParams } from "react-router-dom";
import { Tag, Box, ShoppingCart, Laptop, Monitor, Smartphone, Keyboard, Headphones, Mouse, LayoutGrid, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "All", icon: <LayoutGrid size={24} /> },
  { name: "Laptop", icon: <Laptop size={24} /> },
  { name: "Monitor", icon: <Monitor size={24} /> },
  { name: "Phone", icon: <Smartphone size={24} /> },
  { name: "Keyboard", icon: <Keyboard size={24} /> },
  { name: "Headphones", icon: <Headphones size={24} /> },
  { name: "Mouse", icon: <Mouse size={24} /> },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || ""; 

  useEffect(() => {
    if (categoryQuery) {
      setActiveCategory(categoryQuery);
    } else {
      setActiveCategory("All");
    }
  }, [categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (searchQuery || categoryQuery) {
        setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setActiveCategory("All");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid"></div>
      <p className="mt-4 text-xl font-medium text-gray-600 animate-pulse">Loading Products...</p>
    </div>
  );

  return (
    <div className="mt-6 px-2 md:px-4">
      {/* Updated Big Container to Green Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center text-center text-white"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ShoppingCart size={48} className="md:size-16 mb-4 text-white/90" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-md">Premium Tech Store</h1>
        <p className="text-base md:text-xl text-emerald-50 max-w-2xl font-light">Elevate your setup with our handpicked collection of high-performance gadgets.</p>
      </motion.div>

      {searchQuery && (
        <div className="max-w-6xl mx-auto mt-8 flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-emerald-800 font-medium">
            Showing results for: <span className="font-bold underline">"{searchQuery}"</span>
          </p>
          <button onClick={clearSearch} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-bold text-sm transition">
            <XCircle size={18} /> Clear Search
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">Browse by Category</h2>
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilter(cat.name)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                activeCategory === cat.name 
                ? "bg-emerald-600 text-white ring-4 ring-emerald-100" 
                : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
              }`}>
                {cat.icon}
              </div>
              <span className={`mt-2 font-bold text-[10px] md:text-sm transition-colors ${
                activeCategory === cat.name ? "text-emerald-600" : "text-gray-500"
              }`}>
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-1 md:px-2 py-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-20 flex flex-col items-center"
            >
              <XCircle size={64} className="text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No products found for your criteria.</p>
              <button onClick={clearSearch} className="mt-4 text-emerald-600 font-bold hover:underline">Reset filters</button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8"
            >
              {filteredProducts.map((p) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key={p.id}
                  className="bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col group"
                >
                  <div className="relative overflow-hidden h-36 md:h-52 bg-white">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-contain p-2 md:p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-emerald-50/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black text-emerald-700 uppercase tracking-widest shadow-sm">
                      {p.category}
                    </div>
                  </div>

                  <div className="p-3 md:p-6 flex flex-col flex-1 border-t border-gray-50">
                    <h2 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">{p.name}</h2>
                    
                    <p className="text-gray-500 text-[10px] md:text-sm mb-4 line-clamp-2 flex-1">
                      {p.description}
                    </p>
                    
                    <div className="flex flex-col gap-2 mb-4 md:mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Tag size={14} className="text-emerald-500 md:size-[18px]"/>
                          <span className="text-sm md:text-2xl font-black text-gray-900">₱{parseFloat(p.price).toLocaleString("en-PH")}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg border border-gray-100">
                          <Box size={10} className="text-gray-400 md:size-3.5"/>
                          <span className="text-[9px] md:text-xs font-bold text-gray-500">{p.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/products/${p.id}`}
                      className="w-full bg-slate-900 text-white py-2 md:py-3 rounded-xl md:rounded-2xl text-center text-xs md:text-base font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-gray-200"
                    >
                      View Product
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Products;