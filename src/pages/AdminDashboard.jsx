import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
} from "lucide-react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!name || !price || !category || !quantity || !description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    if (id) {
      await supabase
        .from("products")
        .update({
          name,
          price: parseFloat(price),
          category,
          quantity: parseInt(quantity),
          description,
          image_url,
        })
        .eq("id", id);
      alert("Product updated!");
    } else {
      await supabase.from("products").insert([
        {
          name,
          price: parseFloat(price),
          category,
          quantity: parseInt(quantity),
          description,
          image_url,
        },
      ]);
      alert("Product added!");
    }

    setId(null);
    setName("");
    setPrice("");
    setCategory("");
    setQuantity("");
    setDescription("");
    setImageUrl("");
    fetchProducts();
    setLoading(false);
  };

  const handleEdit = (product) => {
    setId(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setQuantity(product.quantity);
    setDescription(product.description);
    setImageUrl(product.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await supabase.from("products").delete().eq("id", productId);
    fetchProducts();
  };

  const lowStock = products.filter((p) => p.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Package size={32} className="text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <Boxes size={28} className="text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {products.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <AlertTriangle size={28} className="text-red-500" />
            <div>
              <p className="text-gray-500 text-sm">Low Stock (≤5)</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {lowStock}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <PlusCircle className="text-blue-600" />
          {id ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Processing..." : id ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        All Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition duration-300 flex flex-col"
            >
              <div className="h-40 w-full overflow-hidden rounded-t-xl">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>

                <p className="text-blue-600 font-bold mb-1">
                  ₱{Number(product.price).toLocaleString("en-PH")}
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  {product.category}
                </p>

                <div className="mb-3">
                  {product.quantity <= 5 ? (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Low Stock ({product.quantity})
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      In Stock ({product.quantity})
                    </span>
                  )}
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-sm py-2 rounded-lg transition"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
