import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        toast.success("Registration successful! Check your email.", {
          duration: 5000,
          icon: '📩',
        });
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100 via-slate-50 to-emerald-100 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Join Us</h2>
          <p className="text-gray-500 mt-2 font-medium">Create your account in seconds</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Full Name</label>
            <div className="relative">
              <AiOutlineUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 px-12 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Email Address</label>
            <div className="relative">
              <AiOutlineMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="hello@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 px-12 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 px-12 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-600"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition-all font-bold shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-sm text-center mt-8 text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-green-600 font-bold hover:text-green-700 underline decoration-2 underline-offset-4">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;