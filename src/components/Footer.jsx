import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import GreenhillsLogo from "../assets/greenhills.png";

const Footer = () => {
  const categories = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">

        {/* Logo & description - Centered on mobile */}
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
          <img
            src={GreenhillsLogo}
            alt="Greenhills Logo"
            className="h-20 md:h-24 w-auto object-contain"
          />
          <p className="text-gray-400 text-sm md:text-base">
            Greenhills Gadget Hub is your one-stop shop for the latest and greatest tech gadgets.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-green-500 transition-colors p-1"><Facebook size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors p-1"><Twitter size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors p-1"><Instagram size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors p-1"><Linkedin size={22} /></a>
          </div>
        </div>

        {/* Quick Links - Two-column layout on tiny screens if needed, otherwise stacked */}
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="hover:text-green-500 transition-colors text-gray-400 hover:translate-x-1 inline-block transform">Home</Link></li>
            <li><Link to="/products" className="hover:text-green-500 transition-colors text-gray-400 hover:translate-x-1 inline-block transform">Products</Link></li>
            <li><Link to="/contact" className="hover:text-green-500 transition-colors text-gray-400 hover:translate-x-1 inline-block transform">Contact</Link></li>
          </ul>
        </div>

        {/* Categories - Hidden or collapsed on mobile could be an option, but stacking works best here */}
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Categories</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/products?category=${cat}`}
                  className="hover:text-green-500 transition-colors text-gray-400 hover:translate-x-1 inline-block transform"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter - Full width on small screens */}
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Subscribe</h3>
          <p className="text-gray-400 mb-4 text-sm">Get the latest updates and offers delivered to your inbox.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
            <button className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Copyright area */}
      <div className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-500 text-xs md:text-sm">
            © {new Date().getFullYear()} Greenhills Gadget Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;