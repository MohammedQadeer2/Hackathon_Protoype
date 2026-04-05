import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Global Auth

  const [online, setOnline] = useState(true);

  // Use state for requests so we can functionally "Accept" or "Reject" them from the UI screen
  const [requests, setRequests] = useState([
    { id: 1, problem: "Fan motor replacement & wiring", user: "Rahul Sharma", location: "123 MG Road, 2km away", price: 350 },
    { id: 2, problem: "Short circuit in kitchen board", user: "Amit Patel", location: "45 West Avenue, 5km away", price: 450 },
  ]);

  const history = [
    { id: 101, service: "AC Servicing", date: "2026-04-04", earning: 500, rating: 5 },
    { id: 102, service: "Switchboard Installation", date: "2026-04-02", earning: 200, rating: 4 },
  ];

  const handleAction = (id) => {
    // Filter out the request to simulate acting on it
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-4 py-6">

        {/* 🔝 Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/provider-profile")}
              className="hover:opacity-80 transition transform hover:scale-105 rounded-full overflow-hidden border-2 border-gray-700"
            >
              <Avatar src={user?.profileImage} size="md" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome back, {user?.name || "Pro"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs font-semibold hover:bg-red-600 hover:border-red-500 transition"
          >
            Logout
          </button>
        </div>

        {/* 🟢 Availability Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl mb-8 flex justify-between items-center shadow-lg transition-colors duration-500 border ${
            online ? "bg-green-900/20 border-green-800/50" : "bg-gray-900/50 border-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
            <div>
              <h2 className="text-sm font-semibold">{online ? "You are Online" : "You are Offline"}</h2>
              <p className="text-xs text-gray-400">{online ? "Receiving new job requests" : "Not visible to new clients"}</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setOnline(!online)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              online ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                online ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </motion.div>

        {/* 💰 Earnings Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Today's Earnings</p>
            <h3 className="text-2xl font-bold text-green-400">₹0</h3>
            <p className="text-xs text-green-600 mt-1">↑ 0% from yesterday</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
            <h3 className="text-2xl font-bold text-blue-400">₹18,500</h3>
            <p className="text-xs text-blue-600 mt-1">142 Jobs completed</p>
          </div>
        </div>

        {/* 📥 Incoming Requests */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 text-gray-300">
            <h2 className="text-md font-semibold">Live Job Requests</h2>
            <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
              {requests.length} New
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-900 border border-blue-900/30 p-5 rounded-2xl shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex justify-between">
                    <h3 className="text-md font-bold text-gray-100">{req.problem}</h3>
                    <p className="text-lg font-bold text-green-400">₹{req.price}</p>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2 space-y-1">
                    <p>👤 <span className="text-gray-300">{req.user}</span></p>
                    <p>📍 {req.location}</p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button 
                      onClick={() => handleAction(req.id)}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-semibold transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req.id)}
                      className="flex-1 py-2 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-300 rounded-xl text-sm font-semibold transition border border-gray-700 hover:border-red-500"
                    >
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {requests.length === 0 && (
              <div className="text-center py-10 bg-gray-900/50 border border-gray-800 rounded-2xl border-dashed">
                <span className="text-4xl">☕</span>
                <p className="text-gray-400 mt-3 font-medium">No new requests right now.</p>
                <p className="text-xs text-gray-500">Stay online to get notified of nearby jobs.</p>
              </div>
            )}
          </div>
        </div>

        {/* 📜 Job History */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-gray-300">Recent Completed Jobs</h2>

          <div className="space-y-3">
            {history.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-200">{job.service}</p>
                  <p className="text-xs text-gray-500 mt-1">📅 {job.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-md font-bold text-green-400">+₹{job.earning}</p>
                  <p className="text-xs text-yellow-500 mt-1">{"⭐".repeat(job.rating)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProviderDashboard;