const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Total Products</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">24</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Orders</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">58</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
