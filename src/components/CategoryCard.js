import { motion } from "framer-motion";

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center hover:bg-gray-800 transition cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden"
    >
      {/* Optional faint background image */}
      {category.image && (
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${category.image})` }}
        />
      )}
      
      <div className="text-3xl relative z-10">{category.icon}</div>
      <span className="text-sm font-medium text-gray-200 relative z-10">{category.name}</span>
    </motion.div>
  );
}