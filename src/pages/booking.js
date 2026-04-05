import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Avatar from "../components/Avatar";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [issue, setIssue] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-semibold mb-4">No Provider Selected</h2>
        <Button variant="outline" onClick={() => navigate("/home")} className="max-w-xs">
          Go Back Home
        </Button>
      </div>
    );
  }

  const handleBooking = () => {
    if (!date || !time || !address || !issue) {
      alert("Please fill in all details (Date, Time, Address, and Issue)");
      return;
    }

    setConfirmed(true);

    setTimeout(() => {
      navigate("/home");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold ml-4">Book Service</h1>
        </div>

        {!confirmed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 🧑‍🔧 Provider Summary */}
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl mb-6 flex items-center gap-4 shadow-sm">
              <Avatar src={provider.profileImage} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{provider.name}</h3>
                <p className="text-sm text-blue-400">{provider.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">₹{provider.price}</p>
                <p className="text-xs text-gray-500">per job</p>
              </div>
            </div>

            {/* 📝 Booking Form */}
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-2 mb-4">
                Service Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-400">Time</label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-400">Service Address</label>
                <input
                  type="text"
                  placeholder="Enter full address..."
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-400">Describe the Issue</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Fan is making a clicking noise and won't spin..."
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* 🚀 Confirm */}
            <Button onClick={handleBooking} variant="primary">
              Confirm Booking (₹{provider.price})
            </Button>
          </motion.div>
        ) : (
          /* 🎉 Success Animation */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center shadow-2xl mt-10"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-md text-gray-300 mb-4">
              {provider.name} has received your request and will arrive on {date} at {time}.
            </p>
            <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm text-gray-400">
              Redirecting to home...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Booking;