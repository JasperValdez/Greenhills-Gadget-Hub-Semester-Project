import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from "../supabase-client";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Message sent to Greenhills Center!");
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto-reset success view after 10 seconds
      setTimeout(() => setSubmitted(false), 10000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-widest"
          >
            Contact Us
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Let's Start a <span className="text-blue-600">Conversation</span>
          </motion.h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
            Need help with your order or have a technical question? Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Sidebar: Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 order-2 lg:order-1"
          >
            <ContactInfoIcon 
              icon={<Phone className="text-blue-600" size={24} />} 
              title="Quick Call" 
              detail="+63 991 3938 316" 
              bg="bg-blue-50"
            />
            <ContactInfoIcon 
              icon={<Mail className="text-indigo-600" size={24} />} 
              title="Email Support" 
              detail="support@greenhills.com" 
              bg="bg-indigo-50"
            />
            <ContactInfoIcon 
              icon={<MapPin className="text-red-600" size={24} />} 
              title="Main Office" 
              detail="Greenhills Center, San Juan, Manila" 
              bg="bg-red-50"
            />

            {/* Business Hours Mini-Card */}
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-2">Store Hours</h4>
                <p className="text-slate-400 text-sm">Mon - Fri: 9:00 AM - 8:00 PM</p>
                <p className="text-slate-400 text-sm">Sat - Sun: 10:00 AM - 6:00 PM</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle size={120} />
              </div>
            </div>
          </motion.div>

          {/* Main Content: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-blue-100/50 border border-gray-100 order-1 lg:order-2"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 md:py-20"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Message Received!</h2>
                  <p className="text-gray-500 text-lg max-w-sm mx-auto">
                    Thanks for reaching out. We've received your inquiry and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-blue-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" 
                        placeholder="Ex. Juan Dela Cruz" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" 
                        placeholder="juan@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      required 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" 
                      placeholder="What is this regarding?" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      required 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5" 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 resize-none" 
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full md:w-max px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    {loading ? (
                      <>Processing <Loader2 className="animate-spin" size={20} /></>
                    ) : (
                      <>Send Message <Send size={18} /></>
                    )}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactInfoIcon = ({ icon, title, detail, bg }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-6 transition-all"
  >
    <div className={`p-4 ${bg} rounded-2xl flex-shrink-0`}>{icon}</div>
    <div className="min-w-0">
      <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h4>
      <p className="text-slate-900 font-bold truncate">{detail}</p>
    </div>
  </motion.div>
);

export default Contact;