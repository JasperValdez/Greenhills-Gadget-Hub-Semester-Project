import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
  LayoutGrid,
  X
} from "lucide-react";

const CATEGORIES = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Consolidated state to prevent "undefined" errors
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Laptop",
    quantity: "",
    description: "",
    image_url: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...productForm,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity)
    };

    try {
      if (editId) {
        const { error } = await supabase.from("products").update(submissionData).eq("id", editId);
        if (error) throw error;
        alert("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert([submissionData]);
        if (error) throw error;
        alert("Product added!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setProductForm({
      name: "",
      price: "",
      category: "Laptop",
      quantity: "",
      description: "",
      image_url: ""
    });
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      description: product.description,
      image_url: product.image_url || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) alert(error.message);
    else fetchProducts();
  };

  const lowStockCount = products.filter((p) => p.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <Boxes size={32} className="text-green-500" />
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Inventory</p>
            <h2 className="text-2xl font-bold">{products.length} Items</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <AlertTriangle size={32} className="text-red-500" />
          <div>
            <p className="text-gray-500 text-sm font-medium">Critical Stock</p>
            <h2 className="text-2xl font-bold">{lowStockCount} Low Items</h2>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <motion.div layout className="bg-white p-6 rounded-2xl shadow-sm border mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle size={20} className="text-blue-600" />
            {editId ? "Edit Existing Product" : "Register New Product"}
          </h2>
          {editId && (
            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition">
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
            <input 
              type="text" 
              required
              value={productForm.name}
              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
            <select 
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Price (₱)</label>
            <input 
              type="number" 
              required
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Stock Quantity</label>
            <input 
              type="number" 
              required
              value={productForm.quantity}
              onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
            <input 
              type="text" 
              required
              value={productForm.image_url}
              onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-1 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea 
              rows={3} 
              required
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="lg:col-span-3 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Inventory" : "Add to Inventory"}
          </button>
        </form>
      </motion.div>

      {/* Product List */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutGrid className="text-gray-400" /> Live Catalog
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group"
            >
              <div className="h-40 relative">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-black uppercase">
                  {p.category}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold truncate">{p.name}</h3>
                <p className="text-blue-600 font-bold">₱{Number(p.price).toLocaleString()}</p>
                <div className="mt-2 mb-4">
                  {p.quantity <= 5 ? (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">LOW STOCK ({p.quantity})</span>
                  ) : (
                    <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">IN STOCK ({p.quantity})</span>
                  )}
                </div>
                <div className="mt-auto flex gap-2 pt-4 border-t">
                  <button onClick={() => handleEdit(p)} className="flex-1 bg-gray-100 hover:bg-blue-100 p-2 rounded-lg transition flex justify-center items-center gap-1">
                    <Pencil size={14} /> <span className="text-xs font-bold">EDIT</span>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 bg-gray-100 hover:bg-red-100 p-2 rounded-lg transition flex justify-center items-center gap-1 text-red-600">
                    <Trash2 size={14} /> <span className="text-xs font-bold">DELETE</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminDashboard;