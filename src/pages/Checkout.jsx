const Checkout = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white p-8 rounded-xl shadow space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg px-4 py-3"
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full border rounded-lg px-4 py-3"
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="w-full border rounded-lg px-4 py-3"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
