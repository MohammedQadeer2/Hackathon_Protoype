import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { categories, providers } from "../data/mockData";
import ServiceCard from "../components/ServiceCard";

function Services() {
  const navigate = useNavigate();
  const location = useLocation();

  // If we navigated here by clicking a specific category card, preset the filter
  const initialCategory = location.state?.categoryStr || "all";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("none");

  const filteredProviders = providers
    .filter((provider) => {
      // Create a case-insensitive category match
      const isAll = category === "all";
      const matchesCategory = provider.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = provider.name.toLowerCase().includes(search.toLowerCase()) || 
                            provider.category.toLowerCase().includes(search.toLowerCase());
      
      return (isAll || matchesCategory) && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white">

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl px-4 py-6">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate("/home")}
          className="mb-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-5">Find Services</h1>

        {/* 🔍 Search */}
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl mb-5 shadow-sm">
          <input
            type="text"
            placeholder="Search professionals, e.g. electrician..."
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg outline-none placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🧩 Categories Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 snap-x hide-scrollbar">
          <button
            onClick={() => setCategory("all")}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition snap-start ${
              category === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition snap-start flex items-center gap-2 ${
                category.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* 🔽 Sort by Price */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSortOrder(sortOrder === "low" ? "none" : "low")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortOrder === "low"
                ? "bg-gray-700 border border-blue-500 text-blue-400"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800"
            }`}
          >
            Price: Low to High
          </button>

          <button
            onClick={() => setSortOrder(sortOrder === "high" ? "none" : "high")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortOrder === "high"
                ? "bg-gray-700 border border-blue-500 text-blue-400"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800"
            }`}
          >
            Price: High to Low
          </button>
        </div>

        {/* 💎 Provider List using ServiceCard Component */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <ServiceCard 
              key={provider.id} 
              provider={provider} 
              onClick={() => navigate("/details", { state: { provider } })} 
            />
          ))}
        </div>

        {/* ❌ Empty State */}
        {filteredProviders.length === 0 && (
          <div className="text-center mt-12 bg-gray-900/50 p-8 rounded-xl border border-gray-800 border-dashed">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-300 font-medium">No professionals found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;