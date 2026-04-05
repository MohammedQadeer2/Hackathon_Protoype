import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProviderDashboard from "./providerDashboard";
import { categories, providers } from "../data/mockData";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { CategoryCardSkeleton, ServiceCardSkeleton, Skeleton } from "../components/Skeleton";

function Home() {
  const navigate = useNavigate();
  const { role, user } = useAuth(); // Now pulls natively from Context!
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bestMatch, setBestMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate network request for data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 second loading screen simulation
    return () => clearTimeout(timer);
  }, []);

  // 🧠 Natural Language Search Logic
  const handleSmartSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setBestMatch(null);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Keyword dictionary mapping natural problems to our service categories
    // This allows users to type sentences like "My bathroom pipe is leaking" and map it to Plumber
    const problemMap = {
      "Plumber": ["water", "leak", "dripping", "pipe", "sink", "tap", "drain", "flush", "plumbing"],
      "Electrician": ["wire", "light", "fan", "switch", "power", "shock", "electricity", "short circuit", "current"],
      "AC Repair": ["ac", "cooling", "air conditioner", "freeze", "compressor", "heat", "hot", "ac not working"],
      "Cleaning": ["clean", "dust", "mop", "sweep", "mess", "dirty", "stain", "washing"],
      "Salon": ["hair", "cut", "makeup", "style", "facial", "massage", "salon", "beauty"],
      "Carpentry": ["wood", "door", "furniture", "table", "chair", "cabinet", "broken", "carpenter"]
    };

    let matchedCategory = null;
    let maxScore = 0;

    // Score the query against our dictionary keywords
    Object.keys(problemMap).forEach((category) => {
      let score = 0;
      problemMap[category].forEach((keyword) => {
        if (lowerQuery.includes(keyword)) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        matchedCategory = category;
      }
    });

    // If we found a matching category, find the highest rated provider for it
    if (matchedCategory) {
      const topProvider = providers
        .filter((p) => p.category === matchedCategory)
        .sort((a, b) => b.rating - a.rating)[0];

      setBestMatch(topProvider);
    } else {
      setBestMatch(null);
    }
  };

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

        {/* 🧠 Smart Problem Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-8 shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSmartSearch(e.target.value)}
            placeholder="🔍 Describe your problem... (e.g. Water is leaking from the sink)"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all z-10"
          />

          {/* 🌟 AI Best Match Result Dropdown */}
          <AnimatePresence>
            {bestMatch && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="pt-2 z-10"
              >
                <div className="flex items-center gap-2 mb-3 mt-1 ml-1">
                  <span className="text-xl">✨</span>
                  <span className="text-sm font-semibold text-green-400 bg-green-900/40 border border-green-800/50 px-3 py-1 rounded-md">
                    Top Match for your problem
                  </span>
                </div>
                {/* Re-use our trusted ServiceCard, tapping goes straight to details */}
                <ServiceCard 
                  provider={bestMatch} 
                  onClick={() => navigate("/details", { state: { provider: bestMatch } })} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 🧩 Categories using custom Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {loading ? (
            // Skeleton State for Categories
            [...Array(6)].map((_, i) => <CategoryCardSkeleton key={`cat-skel-${i}`} />)
          ) : (
            <>
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
            </>
          )}
        </motion.div>

        {/* 📍 Nearby Services using custom Component */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-gray-300">
            Nearby Providers
          </h2>
          <button 
            onClick={() => navigate("/map")}
            className="flex items-center gap-1 text-xs bg-blue-900/40 text-blue-400 px-3 py-1.5 rounded-full border border-blue-800/50 hover:bg-blue-800 transition"
          >
            🗺️ Open Map
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            // Skeleton State for Services
            [...Array(4)].map((_, i) => <ServiceCardSkeleton key={`serv-skel-${i}`} />)
          ) : (
            providers.map((provider) => (
              <ServiceCard 
                key={provider.id} 
                provider={provider} 
                onClick={() => navigate("/details", { state: { provider } })} 
              />
            ))
          )}
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