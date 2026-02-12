import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { ArrowRight, Zap, ShieldCheck, Globe, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [
  { id: 1, image: slide1, title: "Next-Gen Tech", subtitle: "Experience the future of performance." },
  { id: 2, image: slide2, title: "Elite Precision", subtitle: "Designed for those who demand more." },
  { id: 3, image: slide3, title: "Pure Innovation", subtitle: "Unmatched quality in every detail." },
];

const categories = [
  { name: "Laptop", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" },
  { name: "Monitor", image: "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Phone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" },
  { name: "Keyboard", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80" },
  { name: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
  { name: "Mouse", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80" },
];

const Home = () => {
  const navigate = useNavigate(); // Navigation hook
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [length]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/40 to-[#0a0a0a] z-10" />
            <img
              src={slides[current].image}
              alt="hero"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-green-500 font-mono tracking-widest uppercase text-sm mb-4 block">Premium Collection 2026</span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              {slides[current].title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              {slides[current].subtitle}
            </p>
            <div className="flex gap-4">
              {/* Navigate to Products on Click */}
              <button 
                onClick={() => navigate("/products")}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                Shop Now <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-300 cursor-pointer ${current === i ? "w-12 bg-green-500" : "w-4 bg-gray-600"}`} 
            />
          ))}
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-10 relative z-30">
        {[
          { icon: <Zap className="text-green-500" />, title: "Ultra Fast Delivery", desc: "Same day shipping on all orders" },
          { icon: <ShieldCheck className="text-green-500" />, title: "2 Year Warranty", desc: "Full coverage for every gadget" },
          { icon: <Globe className="text-green-500" />, title: "Global Support", desc: "24/7 technical assistance" },
        ].map((item, i) => (
          <div key={i} className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="p-3 bg-white/5 rounded-xl">{item.icon}</div>
            <div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- CATEGORIES --- */}
      <section className="max-w-7xl mx-auto px-8 mt-24">
        <div className="mb-10">
          <h2 className="text-4xl font-bold">Categories</h2>
          <div className="h-1 w-20 bg-green-500 mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -10 }}
              onClick={() => navigate("/products")}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <span className="absolute bottom-4 left-0 right-0 text-center font-bold text-lg">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- TRENDING SECTION --- */}
      <section className="max-w-7xl mx-auto px-8 mt-32">
        <h2 className="text-4xl font-bold mb-12 text-center">Trending Gear</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((cat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/10 p-2 transition-all hover:border-green-500/50">
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <img src={cat.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-green-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">New Arrival</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Pro {cat.name} Series</h3>
                <p className="text-gray-400 text-sm mb-6">Optimized for high-performance workflows and professional setups.</p>
                {/* Navigate to Products on Click */}
                <button 
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Explore Now <Zap size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;