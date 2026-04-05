import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Avatar from "../components/Avatar";

function Details() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the selected provider from the React Router state
  const provider = location.state?.provider;

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-semibold mb-4">No Provider Selected</h2>
        <Button variant="outline" onClick={() => navigate("/home")} className="max-w-xs">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-20">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">

        {/* 🔙 Floating Back Button & Header Image */}
        <div className="relative h-48 sm:h-64 bg-gray-800 w-full rounded-b-3xl overflow-hidden shadow-lg">
          {provider.portfolio && provider.portfolio.length > 0 ? (
            <img 
              src={provider.portfolio[0]} 
              className="w-full h-full object-cover opacity-60" 
              alt="Banner" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-gray-900 opacity-60" />
          )}
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-4 px-4 py-2 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-full text-sm hover:bg-gray-800 transition z-10"
          >
            ← Back
          </button>
        </div>

        <div className="px-4 -mt-12 relative z-20">
          {/* 👤 Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6 shadow-xl text-center"
          >
            {/* Avatar positioned halfway off the card */}
            <div className="flex justify-center -mt-16 mb-4">
              <Avatar src={provider.profileImage} size="xl" className="shadow-black shadow-lg" />
            </div>

            <h1 className="text-2xl font-bold mb-1">{provider.name}</h1>
            <p className="text-sm font-medium text-blue-400 mb-2 uppercase tracking-wide">
              {provider.category}
            </p>

            <div className="flex justify-center items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1">⭐ <span className="font-semibold text-white">{provider.rating}</span> ({provider.reviews})</span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1">📍 {provider.location}</span>
            </div>

            <div className="inline-block px-6 py-2 bg-gray-800 rounded-full text-lg font-bold text-green-400 border border-gray-700">
              ₹{provider.price} <span className="text-xs text-gray-500 font-normal">/ job</span>
            </div>
          </motion.div>

          {/* 📄 About */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6"
          >
            <h2 className="text-md font-semibold mb-3 text-gray-200">
              About
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {provider.about}
            </p>
          </motion.div>

          {/* 📸 Portfolio Gallery */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-md font-semibold mb-3 text-gray-200 px-1">
                Portfolio
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                {provider.portfolio.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Portfolio ${idx}`} 
                    className="h-32 w-48 object-cover rounded-xl shadow-sm border border-gray-800 snap-center shrink-0" 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 🚀 Fixed Bottom ACTION BUTTONS */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex justify-center z-50">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl flex gap-3">
            
            <a href="tel:9876543210" className="w-1/4">
               <Button variant="outline" className="w-full">
                 📞
               </Button>
            </a>

            <div className="w-1/4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/chat", { state: { partner: provider } })}>
                💬
              </Button>
            </div>

            <div className="w-2/4">
              <Button variant="primary" onClick={() => navigate("/booking", { state: { provider } })} className="w-full">
                📅 Book Now
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;