import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, User, Package, LayoutDashboard, LogOut, ChevronDown, Search, Menu, X } from "lucide-react"; 
import { supabase } from "../supabase-client";
import GreenhillsLogo from "../assets/greenhills.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false); // Close mobile menu if searching from there
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", currentUser.id)
          .single();
        setProfile(prof);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session) {
        setProfile(null);
      } else {
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

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
    <nav className="bg-white shadow-sm border-b border-gray-100 px-4 md:px-8 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <img
            src={GreenhillsLogo}
            alt="Greenhills Logo"
            className="h-10 md:h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          />
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 font-bold hover:text-green-600 transition text-sm uppercase tracking-wider">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 font-bold hover:text-green-600 transition text-sm uppercase tracking-wider">
              Shop
            </Link>
          </div>
        </div>

        {/* Search Bar - Desktop & Tablet */}
        <div className="hidden md:flex flex-1 mx-4 lg:mx-12">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search gadgets or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-12 pr-6 py-2.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition text-sm outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Mobile Search Toggle (Optional - for very small screens) */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(true)}>
            <Search size={20} />
          </button>

          {!user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={() => navigate("/login")} className="text-gray-700 font-bold text-xs md:text-sm hover:text-green-600 px-2">
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-black transition shadow-lg shadow-green-100"
              >
                Join
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-6">
              <button 
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
              >
                <ShoppingCart size={22} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 md:pr-3 bg-gray-50 rounded-full border border-gray-100 hover:border-green-200 transition"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-inner">
                    <User size={16} />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700 hidden sm:block">
                    {profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{profile?.full_name}</p>
                    </div>
                    <Link to="/my-orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition font-medium">
                      <Package size={18} /> My Orders
                    </Link>
                    {profile?.role === "admin" && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition font-medium">
                        <LayoutDashboard size={18} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-50 mt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition font-bold">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 p-4 animate-in slide-in-from-top duration-300">
          <div className="relative w-full mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-12 pr-6 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-4 px-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-bold uppercase tracking-widest text-sm">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-bold uppercase tracking-widest text-sm">Shop</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;