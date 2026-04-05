import { motion } from "framer-motion";
import Avatar from "./Avatar";

export default function ServiceCard({ provider, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition shadow-sm"
    >
      <Avatar src={provider.profileImage} alt={provider.name} size="lg" />
      
      <div className="flex-1">
        <h3 className="text-md font-semibold text-gray-100">{provider.name}</h3>
        <p className="text-sm text-gray-400">{provider.category}</p>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-yellow-500">⭐ {provider.rating}</span>
          <span className="text-xs text-gray-500">({provider.reviews} reviews)</span>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm font-bold text-blue-400">₹{provider.price}</p>
        <p className="text-xs text-gray-500">per job</p>
      </div>
    </motion.div>
  );
}