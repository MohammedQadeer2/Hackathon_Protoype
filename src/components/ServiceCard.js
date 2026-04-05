import { motion } from "framer-motion";
import Avatar from "./Avatar";

export default function ServiceCard({ provider, onClick }) {
  // Badge Evaluation Logic
  const isTopRated = provider.rating >= 4.8;
  const isSuperPro = provider.jobsCompleted > 300;
  const isAvailable = provider.availability;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-gray-800 transition shadow-md overflow-hidden relative"
    >
      <div className="flex items-center gap-4 w-full">
        <div className="relative shrink-0">
          <Avatar src={provider.profileImage} alt={provider.name} size="lg" className={`${isSuperPro ? 'border-2 border-purple-500' : isTopRated ? 'border-2 border-yellow-500' : 'border-2 border-gray-700'}`} />
          {/* Availability Dot indicator on Avatar */}
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-gray-900 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        </div>
        
        <div className="flex-1 min-w-0 pr-2">
          {/* Badges Container inline for better flow */}
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {isTopRated && (
              <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                🏆 Top Rated
              </span>
            )}
            {isSuperPro && (
              <span className="bg-purple-500/20 border border-purple-500/50 text-purple-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                ⚡ Super Pro
              </span>
            )}
          </div>
          
          <h3 className="text-md font-semibold text-gray-100 truncate">{provider.name}</h3>
          
          <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wide bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-800/50 inline-block">{provider.category}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="flex items-center text-gray-300 font-medium">⭐ {provider.rating} <span className="text-gray-500 font-normal ml-1">({provider.reviews})</span></span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-400 font-medium">✅ {provider.jobsCompleted} <span className="text-gray-500 font-normal">jobs done</span></span>
          </div>
        </div>
        
        <div className="text-right shrink-0 mt-3 sm:mt-0 ml-auto">
          <p className="text-lg font-bold text-green-400">₹{provider.price}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Per Job</p>
        </div>
      </div>
    </motion.div>
  );
}