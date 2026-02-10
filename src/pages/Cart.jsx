import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">iPhone 12 Pro</h3>
            <p className="text-gray-500">₱32,000</p>
          </div>
          <span className="font-bold">₱32,000</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
