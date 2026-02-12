import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
  LayoutGrid,
  X,
  ClipboardList,
  Truck,
  CheckCircle,
  Filter,
  Bell,
  MessageSquare,
  Mail,
  User
} from "lucide-react";

const CATEGORIES = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [activeTab, setActiveTab] = useState("inventory");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message deleted");
      fetchMessages();
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchMessages();

    const orderSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: 'INSERT', table: 'orders' }, (payload) => {
        toast(`New Order from ${payload.new.customer_name}!`, {
          icon: '🛒',
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        });
        fetchOrders();
      })
      .on('postgres_changes', { event: 'INSERT', table: 'contact_messages' }, (payload) => {
        toast(`New Message from ${payload.new.name}!`, {
          icon: '📩',
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        });
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
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
        toast.success("Product updated successfully!");
      } else {
        const { error } = await supabase.from("products").insert([submissionData]);
        if (error) throw error;
        toast.success("New product added to inventory!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
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
    toast("Editing mode enabled", { icon: "📝" });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product removed");
      fetchProducts();
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const lowStockCount = products.filter((p) => p.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-blue-600 shrink-0" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center lg:text-left">Admin Dashboard</h1>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner w-full max-w-md overflow-x-auto">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 min-w-fit px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm transition whitespace-nowrap ${activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex-1 min-w-fit px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm transition whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={`flex-1 min-w-fit px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm transition whitespace-nowrap ${activeTab === 'messages' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Messages ({messages.length})
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <Boxes size={28} className="text-green-500 shrink-0" />
          <div>
            <p className="text-gray-500 text-xs font-medium">Total Inventory</p>
            <h2 className="text-xl md:text-2xl font-bold">{products.length} Items</h2>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <AlertTriangle size={28} className="text-red-500 shrink-0" />
          <div>
            <p className="text-gray-500 text-xs font-medium">Critical Stock</p>
            <h2 className="text-xl md:text-2xl font-bold">{lowStockCount} Low Items</h2>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <ClipboardList size={28} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-gray-500 text-xs font-medium">Total Orders</p>
            <h2 className="text-xl md:text-2xl font-bold">{orders.length} Placed</h2>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <MessageSquare size={28} className="text-purple-500 shrink-0" />
          <div>
            <p className="text-gray-500 text-xs font-medium">Inquiries</p>
            <h2 className="text-xl md:text-2xl font-bold">{messages.length} New</h2>
          </div>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <>
          <motion.div layout className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" />
                {editId ? "Edit Existing Product" : "Register New Product"}
              </h2>
              {editId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₱)</label>
                <input type="number" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Quantity</label>
                <input type="number" required value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL</label>
                <input type="text" required value={productForm.image_url} onChange={(e) => setProductForm({...productForm, image_url: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <textarea rows={3} required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm" />
              </div>
              <button type="submit" disabled={loading} className="sm:col-span-2 lg:col-span-3 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100">
                {loading ? "Saving..." : editId ? "Update Inventory" : "Add to Inventory"}
              </button>
            </form>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <LayoutGrid className="text-gray-400" /> All Products
              </h2>
              <p className="text-xs text-gray-500 mt-1">Manage and view your products</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter size={16} className="text-gray-400 shrink-0" />
              <button onClick={() => setSelectedCategory("All")} className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${selectedCategory === "All" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>All</button>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>{cat}</button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group">
                  <div className="h-44 relative overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">{p.category}</div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{p.name}</h3>
                    <p className="text-blue-600 font-bold text-lg">₱{Number(p.price).toLocaleString()}</p>
                    <div className="mt-2 mb-4">
                      {p.quantity <= 5 ? (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold border border-red-200">LOW STOCK ({p.quantity})</span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold border border-green-200">IN STOCK ({p.quantity})</span>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2 pt-4 border-t">
                      <button onClick={() => handleEdit(p)} className="flex-1 bg-gray-50 hover:bg-blue-50 p-2.5 rounded-xl transition flex justify-center items-center gap-1.5 border border-transparent hover:border-blue-100">
                        <Pencil size={14} className="text-blue-600" /> <span className="text-[10px] font-bold">EDIT</span>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex-1 bg-gray-50 hover:bg-red-50 p-2.5 rounded-xl transition flex justify-center items-center gap-1.5 border border-transparent hover:border-red-100 text-red-600">
                        <Trash2 size={14} /> <span className="text-[10px] font-bold">DELETE</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : activeTab === "orders" ? (
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-6">
            <ClipboardList className="text-blue-600" /> Pending Deliveries
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-16 bg-white rounded-2xl border">No orders placed yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded">#{order.id.slice(0,8).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{order.customer_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{order.customer_address}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-[11px] bg-gray-50 border px-2 py-1 rounded-lg font-medium text-gray-600">
                          {item.name} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:min-w-[200px] pt-4 md:pt-0 border-t md:border-t-0">
                    <p className="text-xl font-black text-gray-900">₱{order.total_price.toLocaleString()}</p>
                    <div className="flex gap-2 w-full max-w-[150px] md:max-w-none">
                      {order.status === "pending" && (
                        <button onClick={() => updateOrderStatus(order.id, "shipped")} className="flex-1 bg-blue-600 text-white p-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1 shadow-md"><Truck size={14}/> SHIP</button>
                      )}
                      {order.status === "shipped" && (
                        <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 bg-green-600 text-white p-2.5 rounded-xl text-xs font-bold hover:bg-green-700 transition flex items-center justify-center gap-1 shadow-md"><CheckCircle size={14}/> DELIVER</button>
                      )}
                      {order.status === "delivered" && (
                         <span className="text-green-600 text-xs font-black py-2 w-full text-right md:text-center">COMPLETED</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="text-purple-600" /> Customer Inquiries
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed flex flex-col items-center">
                <Mail className="text-gray-300 mb-2" size={40} />
                <p className="text-gray-400">Your inbox is empty.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-grow space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                          <User size={14} /> {msg.name}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">
                          <Mail size={14} /> {msg.email}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-700 text-sm leading-relaxed">
                        "{msg.message}"
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2 justify-end lg:justify-start lg:min-w-[120px]">
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="flex-1 lg:w-full bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={14}/> DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;