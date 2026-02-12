import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import GreenhillsLogo from "../assets/greenhills.png";

const Footer = () => {
  const categories = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
          <img src={GreenhillsLogo} alt="Logo" className="h-20 md:h-24 w-auto object-contain" />
          <p className="text-gray-400 text-sm md:text-base">
            Greenhills Gadget Hub is your one-stop shop for the latest and greatest tech gadgets.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-green-500 transition-colors"><Facebook size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors"><Twitter size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors"><Instagram size={22} /></a>
            <a href="#" className="hover:text-green-500 transition-colors"><Linkedin size={22} /></a>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="hover:text-green-500 transition-colors text-gray-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-green-500 transition-colors text-gray-400">Products</Link></li>
            <li><Link to="/contact" className="hover:text-green-500 transition-colors text-gray-400">Contact</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Categories</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            {categories.map((cat) => (
              <li key={cat}>
                {/* Clicking this will update the URL, which the Products page will detect */}
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

        <div className="text-center md:text-left">
          <h3 className="font-bold mb-5 text-white uppercase tracking-wider text-sm">Subscribe</h3>
          <p className="text-gray-400 mb-4 text-sm">Get the latest updates delivered to your inbox.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-green-600 outline-none"
            />
            <button className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;