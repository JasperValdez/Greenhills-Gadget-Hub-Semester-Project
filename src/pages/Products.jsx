import { Link } from "react-router-dom";

const categories = [
  {
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Monitor",
    image: "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=400"

  },
  {
    name: "Phone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Keyboard",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",

  },
  {
    name: "Mouse",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80",
  },
];

const products = [
  {
    id: 1,
    name: "iPhone 12 Pro",
    price: "₱32,000",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    price: "₱28,500",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "MacBook Air M1",
    price: "₱45,000",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: "₱9,500",
    image: "https://images.pexels.com/photos/373945/pexels-photo-373945.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
];

const Products = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HERO */}
      <div className="bg-green-600 text-white rounded-2xl p-12 mb-10 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-3">
          Shop Quality Gadgets
        </h1>
        <p className="text-lg opacity-90">
          Affordable, reliable, and quality-checked devices.
        </p>
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-14">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md border group-hover:scale-105 transition">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 font-semibold text-gray-700 group-hover:text-green-600 transition">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-green-600 font-bold mt-1">
                {product.price}
              </p>
              <Link
                to={`/products/${product.id}`}
                className="block text-center mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Products;
