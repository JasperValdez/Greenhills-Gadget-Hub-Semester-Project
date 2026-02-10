import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-green-600 font-medium"
      >
        ← Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow">
        <img
          src="https://images.unsplash.com/photo-1603898037225-6c7b84f8e9d2"
          alt="Product"
          className="rounded-xl object-cover w-full h-96"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">Product #{id}</h1>
          <p className="text-green-600 text-2xl font-semibold mb-6">
            ₱32,000
          </p>

          <p className="text-gray-600 mb-6">
            This is a high-quality pre-owned gadget, fully tested and guaranteed
            to work perfectly.
          </p>

          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
