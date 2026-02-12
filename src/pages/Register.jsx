import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

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
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          role: "customer",
        });

        if (profileError) throw profileError;
        
        alert("Registration successful! Please check your email for confirmation or login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <AiOutlineUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-green-600 font-medium hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;