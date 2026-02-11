import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { supabase } from "../supabase-client";
import GreenhillsLogo from "../assets/greenhills.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);

      if (data.session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", data.session.user.id)
          .single();
        setProfile(prof);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and navigation */}
        <div className="flex items-center gap-6">
          <img
            src={GreenhillsLogo}
            alt="Greenhills Logo"
            className="h-24 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <Link to="/" className="text-gray-800 font-semibold hover:text-green-600 transition">
            Home
          </Link>
          <Link to="/products" className="text-gray-800 font-semibold hover:text-green-600 transition">
            Products
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search gadgets..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          />
        </div>

        {/* Profile / Cart */}
        <div className="flex items-center gap-4 relative">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                  <User size={20} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                    <p className="px-4 py-2 text-gray-700 border-b">
                      {profile?.full_name || "User"}
                    </p>

                    {/* Admin link */}
                    {profile?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 text-gray-700 transition rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Cart icon */}
              <ShoppingCart
                className="cursor-pointer text-gray-800"
                size={24}
                onClick={() => navigate("/cart")}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
