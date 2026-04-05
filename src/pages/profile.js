import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { bookings, providers } from "../data/mockData";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth(); // Fetch global user

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Enrich booking data with provider details for display
  const userBookings = bookings.map(b => {
    const provider = providers.find(p => p.id === b.providerId);
    return { ...b, provider };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* 👤 Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl mb-8 text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-24 bg-blue-900/20"></div>
          
          <div className="relative z-10 flex justify-center mb-4">
            <Avatar src={user?.profileImage} size="xl" className="shadow-lg border-4 border-gray-900" />
          </div>

          <h1 className="text-2xl font-bold text-white">{user?.name || "Guest User"}</h1>
          <p className="text-sm text-gray-400 mb-2">{user?.email || "No email provided"}</p>
          <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-500/30">
            {role || "User"} Account
          </span>
        </motion.div>

        {/* 📜 Booking History */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Recent Bookings</h2>

          <div className="space-y-4">
            {userBookings.map((b) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={b.id}
                className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={b.provider?.profileImage} size="md" />
                  <div>
                    <p className="text-md font-bold text-white">{b.provider?.name || "Provider Info Unavailable"}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      📅 {b.date} at {b.time}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 w-max ${
                    b.status === "Completed" ? "bg-green-900/30 text-green-400 border border-green-800" :
                    b.status === "Upcoming" ? "bg-blue-900/30 text-blue-400 border border-blue-800" :
                    "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                  }`}>
                    {b.status}
                  </span>
                  <p className="text-sm font-medium text-gray-300 max-w-[200px] truncate" title={b.description}>
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {userBookings.length === 0 && (
              <div className="text-center py-8 bg-gray-900/50 border border-gray-800 rounded-xl border-dashed">
                <p className="text-gray-400">No bookings found.</p>
              </div>
            )}
          </div>
        </div>

        {/* ⚙️ Account Settings link */}
        <div 
          onClick={() => navigate("/settings")}
          className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-8 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition"
        >
          <span className="font-medium text-gray-300">⚙️ Account Settings</span>
          <span className="text-gray-500 text-lg">→</span>
        </div>

        {/* 🚪 Logout */}
        <Button variant="danger" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Profile;