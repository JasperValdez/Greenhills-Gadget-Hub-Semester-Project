import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = window.location.origin;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    toast.success("Welcome back!");
    navigate(profile?.role === "admin" ? "/admin" : "/");
  };

  const handleGoogleLogin = async () => {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (oauthError) toast.error(oauthError.message);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (profile) navigate(profile.role === "admin" ? "/admin" : "/");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-100 via-slate-50 to-emerald-100 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white/80 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Please enter your details</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Email</label>
            <div className="relative">
              <AiOutlineMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 px-12 py-3.5 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 px-12 py-3.5 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-emerald-600"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01, translateY: -2 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="mt-10 flex items-center gap-4">
          <hr className="flex-grow border-gray-200" />
          <span className="text-gray-400 text-xs font-black tracking-widest uppercase">Or continue with</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-6 flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold shadow-sm"
        >
          <FcGoogle size={24} /> Google
        </button>

        <p className="text-sm text-center mt-10 text-gray-500 font-medium">
          New here? <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-2 underline-offset-4">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;