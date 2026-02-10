import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [
  { id: 1, image: slide1, title: "Latest Gadgets", subtitle: "Discover the newest tech!" },
  { id: 2, image: slide2, title: "Exclusive Deals", subtitle: "Grab your favorites today!" },
  { id: 3, image: slide3, title: "Best Sellers", subtitle: "Check out our top gadgets!" },
];

// Categories with Unsplash / online images
const categories = [
  {
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Monitor",
    image: "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=400",
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

const Home = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const startX = useRef(null);

  // Category slider
  const [catIndex, setCatIndex] = useState(0);
  const visibleCategories = 4;

  // Auto slide for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [length]);

  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const goToSlide = (index) => setCurrent(index);

  const prevCategory = () =>
    setCatIndex(catIndex === 0 ? categories.length - visibleCategories : catIndex - 1);
  const nextCategory = () =>
    setCatIndex(catIndex + visibleCategories >= categories.length ? 0 : catIndex + 1);

  // Touch swipe for hero
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    startX.current = null;
  };

  return (
    <div className="mt-6">

      {/* Hero Slider */}
      <div
        className="w-full h-[650px] relative overflow-hidden rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="flex-shrink-0 w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-10 left-10 text-white bg-black bg-opacity-50 p-4 rounded">
                <h2 className="text-3xl font-bold">{slide.title}</h2>
                <p className="mt-2">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Hero Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-white" : "bg-gray-400"
              } hover:bg-white transition`}
            />
          ))}
        </div>
      </div>

      {/* Categories Slider */}
      <div className="mt-10 relative max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex items-center">
          <button
            onClick={prevCategory}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="overflow-hidden flex-1 mx-4">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(catIndex * 100) / visibleCategories}%)`,
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex-shrink-0 w-1/4 flex flex-col items-center gap-2 px-2"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-24 object-cover rounded-lg shadow-sm"
                  />
                  <span className="text-center font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextCategory}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
