import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = window.location.origin;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    navigate(profile?.role === "admin" ? "/admin" : "/");
  };

  const handleGoogleLogin = async () => {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (oauthError) setError(oauthError.message);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="relative">
            <AiOutlineLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <FcGoogle size={24} /> Continue with Google
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account? <Link to="/register" className="text-green-600 font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;