import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import GreenhillsLogo from "../assets/greenhills.png";

const Footer = () => {
  const categories = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & description */}
        <div className="flex flex-col gap-4">
          <img
            src={GreenhillsLogo}
            alt="Greenhills Logo"
            className="h-24 w-auto object-contain"
          />
          <p className="text-gray-400">
            Greenhills Gadget Hub is your one-stop shop for the latest and greatest tech gadgets.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-green-500 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-green-500 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-green-500 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-green-500 transition"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className="hover:text-green-500 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-green-500 transition">Products</Link></li>
            <li><Link to="/contact" className="hover:text-green-500 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold mb-4">Categories</h3>
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/products?category=${cat}`}
                  className="hover:text-green-500 transition"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold mb-4">Subscribe to Newsletter</h3>
          <p className="text-gray-400 mb-2">Get the latest updates and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 hover:bg-gray-700 transition"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-6 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Greenhills Gadget Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
