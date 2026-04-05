import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProviderDashboard from "./providerDashboard";
import { categories, providers } from "../data/mockData";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import Avatar from "../components/Avatar";

function Home() {
  const navigate = useNavigate();
  const { role, user } = useAuth(); // Now pulls natively from Context!
  const [showAllCategories, setShowAllCategories] = useState(false);

  if (role === "provider") {
    return <ProviderDashboard />;
  }

  // Determine how many categories to show
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl px-4 py-6">

        {/* 🔝 Navbar */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl font-semibold tracking-wide">
              Help Me Buddy
            </h1>
            <p className="text-sm text-gray-400">Welcome back, {user?.name || "User"}</p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            <Avatar src={user?.profileImage} size="sm" />
            <span>Profile</span>
          </button>
        </div>

        {/* 🔍 Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-8 shadow-sm"
        >
          <input
            type="text"
            placeholder="🔍 Describe your problem... (e.g. Fan not working)"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => navigate("/services")}
          />
        </motion.div>

        {/* 🧩 Categories using custom Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {displayedCategories.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onClick={() => navigate("/services", { state: { categoryStr: cat.name } })}
            />
          ))}

          {/* Expand Button inside Grid */}
          {!showAllCategories && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllCategories(true)}
              className="bg-gray-900 border border-dashed border-gray-700 p-4 rounded-xl text-center hover:bg-gray-800 transition cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="text-3xl relative z-10 opacity-70">➕</div>
              <span className="text-sm font-medium text-gray-400 relative z-10">Many more...</span>
            </motion.div>
          )}

          {/* Optionally add a Collapse Button at the end if expanded */}
          {showAllCategories && (
             <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setShowAllCategories(false)}
             className="bg-gray-900 border border-dashed border-gray-700 p-4 rounded-xl text-center hover:bg-gray-800 transition cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden"
           >
             <div className="text-3xl relative z-10 opacity-70">➖</div>
             <span className="text-sm font-medium text-gray-400 relative z-10">Show less</span>
           </motion.div>
          )}
        </motion.div>

        {/* 📍 Nearby Services using custom Component */}
        <h2 className="text-md font-semibold mb-4 text-gray-300">
          Nearby Providers
        </h2>

        <div className="space-y-4">
          {providers.map((provider) => (
            <ServiceCard 
              key={provider.id} 
              provider={provider} 
              onClick={() => navigate("/details", { state: { provider } })} 
            />
          ))}
        </div>

        {/* 🚨 Emergency using Custom Button Component */}
        <div className="mt-8">
          <Button variant="danger" onClick={() => navigate("/services")}>
            🚨 Emergency Help
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;