import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);

    // fetch profile role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") navigate("/admin"); // admin redirect
    else navigate("/"); // customer redirect
  };

  const handleGoogleLogin = async () => {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:5173" },
    });
    if (oauthError) return setError(oauthError.message);

    // Google login check handled in useEffect
  };

  useEffect(() => {
    const checkGoogleProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return;

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        // default Google signup as customer
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata.full_name || user.email,
          role: "customer",
        });
        navigate("/");
      } else {
        // redirect based on role
        if (existingProfile.role === "admin") navigate("/admin");
        else navigate("/");
      }
    };

    checkGoogleProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <p className="text-red-600 mb-3 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
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
            <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
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
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
            Login
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <hr className="border-gray-300 flex-grow" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="border-gray-300 flex-grow" />
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
      </div>
    </div>
  );
};

export default Login;
