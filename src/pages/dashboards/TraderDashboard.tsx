import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Plus,
  Package,
  ShoppingBag,
  TrendingUp,
  Trash2,
  Edit,
  LogOut,
  ChevronRight,
  Sparkles,
  FileText,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sales: number;
}

export default function TraderDashboard() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  
  // State for inventory list
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Classic Street Oversized Tee", price: 45, category: "Apparel", stock: 120, sales: 84 },
    { id: "2", name: "Amber Blaze Cargo Pants", price: 85, category: "Pants", stock: 45, sales: 31 },
    { id: "3", name: "Retro Windbreaker Jacket", price: 120, category: "Outerwear", stock: 18, sales: 15 },
    { id: "4", name: "Acid Wash Street Beanie", price: 25, category: "Accessories", stock: 5, sales: 50 },
  ]);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Apparel",
    stock: "",
  });

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error("Please fill in all fields");
      return;
    }

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Please enter a valid stock level");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: priceNum,
      category: newProduct.category,
      stock: stockNum,
      sales: 0,
    };

    setProducts([product, ...products]);
    setNewProduct({ name: "", price: "", category: "Apparel", stock: "" });
    setShowAddForm(false);
    toast.success("Product listed successfully!");
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast.success("Product removed from listings");
  };

  return (
    <div className="min-h-screen bg-dark-background text-white font-['Inter'] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Store className="text-lime-300" size={28} />
            <span className="font-extrabold font-['Montserrat'] text-xl tracking-wider">
              TRADER<span className="text-lime-300">HUB</span>
            </span>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-lime-300/10 text-lime-300 rounded-xl font-medium text-sm text-left">
              <Package size={18} />
              <span>Inventory Manager</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <ShoppingBag size={18} />
              <span>Orders Received</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <TrendingUp size={18} />
              <span>Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <FileText size={18} />
              <span>Shop Profile</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl mb-4">
            <div className="w-9 h-9 rounded-full bg-lime-300 flex items-center justify-center font-bold text-dark-background text-sm">
              TR
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "Trader"}</p>
              <span className="text-xs text-lime-300 font-semibold tracking-wider uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 hover:border-lime-500/30 hover:bg-lime-500/10 text-gray-text hover:text-lime-300 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Montserrat']">Trader Console</h1>
            <p className="text-gray-text text-sm mt-1">Manage listings, edit pricing, and restock goods</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 border border-neutral-800 hover:border-neutral-700 font-semibold rounded-xl text-sm transition-all"
            >
              Storefront
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-lime-300 text-dark-background hover:bg-lime-400 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                My Store Sales
              </span>
              <DollarSign className="text-lime-300" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat']">$7,510</p>
            <div className="flex items-center gap-1 mt-2 text-lime-300 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+12.4% this month</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                Active Listings
              </span>
              <Package className="text-purple-400" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat']">{products.length}</p>
            <span className="text-xs text-gray-text block mt-2">All styles active</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                Units Sold
              </span>
              <ShoppingBag className="text-emerald-400" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat']">
              {products.reduce((acc, curr) => acc + curr.sales, 0)}
            </p>
            <span className="text-xs text-emerald-400 font-semibold block mt-2">High demand</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                Low Inventory
              </span>
              <Sparkles className="text-amber-400" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat']">
              {products.filter((p) => p.stock <= 10).length}
            </p>
            <span className="text-xs text-amber-400 font-semibold block mt-2">Needs restocking</span>
          </div>
        </section>

        {/* Modal-style Add Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-dark-card border border-neutral-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
              <h3 className="text-2xl font-extrabold font-['Montserrat'] text-white mb-6">
                Publish New Style
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Core GenZ Tech Vest"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white outline-none focus:border-lime-300 transition-all text-sm"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-300 font-medium block mb-1">Price (USD)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white outline-none focus:border-lime-300 transition-all text-sm"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 font-medium block mb-1">Initial Stock</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white outline-none focus:border-lime-300 transition-all text-sm"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white outline-none focus:border-lime-300 transition-all text-sm"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Apparel">Apparel & Tops</option>
                    <option value="Pants">Cargo & Pants</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 border border-neutral-800 text-sm font-semibold rounded-xl hover:bg-neutral-900 text-gray-text hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-lime-300 text-dark-background text-sm font-bold rounded-xl hover:bg-lime-400 transition-all"
                  >
                    List Style
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listings Directory */}
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
          <h3 className="text-xl font-bold font-['Montserrat'] mb-6">Store Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-text text-xs uppercase font-semibold">
                  <th className="py-4 px-2">Style Name</th>
                  <th className="py-4 px-2">Category</th>
                  <th className="py-4 px-2">Price</th>
                  <th className="py-4 px-2">Stock Level</th>
                  <th className="py-4 px-2">Units Sold</th>
                  <th className="py-4 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-sm">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/20 transition-all">
                    <td className="py-4 px-2 font-semibold text-white">{p.name}</td>
                    <td className="py-4 px-2 text-gray-text">{p.category}</td>
                    <td className="py-4 px-2 font-semibold text-lime-300">${p.price}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.stock <= 5
                              ? "bg-red-500 animate-pulse"
                              : p.stock <= 20
                              ? "bg-amber-500"
                              : "bg-emerald-400"
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            p.stock <= 5
                              ? "text-red-400"
                              : p.stock <= 20
                              ? "text-amber-400"
                              : "text-white"
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-text">{p.sales} sold</td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 bg-neutral-800 hover:bg-red-500/20 text-gray-text hover:text-red-400 rounded-lg transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
