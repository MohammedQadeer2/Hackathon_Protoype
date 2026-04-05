import { useState, useEffect } from "react";
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
    { id: 1, problem: "Fan motor replacement & wiring", user: "Rahul Sharma", location: "123 MG Road, 2km away", price: 350, paymentMethod: "online", orderId: "HMB-ORD-A1B2C3" },
    { id: 2, problem: "Short circuit in kitchen board", user: "Amit Patel", location: "45 West Avenue, 5km away", price: 450, paymentMethod: "cash", orderId: "HMB-ORD-X9Y8Z7" },
  ]);
  
  const [history, setHistory] = useState([
    { id: 101, service: "AC Servicing", date: "2026-04-04", earning: 425, commission: 75, paymentMethod: "online", rating: 5 },
    { id: 102, service: "Switchboard Installation", date: "2026-04-02", earning: 170, commission: 30, paymentMethod: "cash", rating: 4 },
  ]);

  // Wallet State
  const [wallet, setWallet] = useState({
    balance: 425, // Only online payments are "held" by the platform and can be withdrawn
    totalEarnings: 595, // 425 (online) + 170 (cash)
    totalCommissionPaid: 105,
    pendingPayouts: 0,
    totalOrders: 2
  });

  // Active Job & Live Tracking State
  const [activeJob, setActiveJob] = useState(null);
  const [jobStatus, setJobStatus] = useState("idle"); // 'idle' | 'traveling' | 'working'
  const [workTimer, setWorkTimer] = useState(0);

  // Timer logic for when status is 'working'
  useEffect(() => {
    let interval;
    if (jobStatus === "working") {
      interval = setInterval(() => {
        setWorkTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [jobStatus]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDecline = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleAccept = (req) => {
    // Remove from live requests and set as Active Job
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setActiveJob(req);
    setJobStatus("traveling"); // Booked -> Accepted -> Traveling
    setWorkTimer(0);
    // Auto-update global availability mapping ideally happens here
  };

  const handleFinishJob = () => {
    const basePrice = activeJob.price;
    const commission = Math.round(basePrice * 0.15); // Platform fee calculation
    const earning = basePrice - commission;

    // Add to history
    setHistory([{ 
      id: Date.now(), 
      service: activeJob.problem, 
      date: "2026-04-05", 
      earning: earning, 
      commission: commission,
      paymentMethod: activeJob.paymentMethod,
      rating: 5 
    }, ...history]);

    // Update Wallet Dashboard
    setWallet(prev => ({
       balance: activeJob.paymentMethod === 'online' ? prev.balance + earning : prev.balance,
       totalEarnings: prev.totalEarnings + earning,
       totalCommissionPaid: prev.totalCommissionPaid + commission,
       pendingPayouts: activeJob.paymentMethod === 'online' ? prev.pendingPayouts + earning : prev.pendingPayouts,
       totalOrders: prev.totalOrders + 1
    }));

    setActiveJob(null);
    setJobStatus("idle");
    setWorkTimer(0);
  };


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

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
            <p className="text-xs text-blue-600 mt-1">{142 + history.length - 2} Jobs completed</p>
          </div>
        </div>

        {/* 🔴 Active Job Status Module (Only visible if currently working) */}
        <AnimatePresence>
          {activeJob && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-blue-900/20 border-2 border-blue-500/50 p-6 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.3)] relative">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h2 className="text-lg font-bold text-blue-400 uppercase tracking-wide">Active Assignment</h2>
                     <p className="text-xl font-semibold text-gray-100 mt-1">{activeJob.problem}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-medium text-gray-400">Payout</p>
                     <p className="text-xl font-bold text-green-400">₹{activeJob.price}</p>
                   </div>
                 </div>
                 
                 {/* Live Tracking Map Frame */}
                 <div className="w-full h-32 bg-gray-800 rounded-xl mb-4 border border-gray-700 overflow-hidden relative shadow-inner">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(activeJob.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                      title="Customer Location"
                    ></iframe>
                    {/* Live Indicator Overlay */}
                    <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${jobStatus === 'working' ? 'bg-red-500 animate-pulse' : 'bg-blue-500 animate-bounce'}`}></span> 
                       {jobStatus === 'traveling' ? 'Traveling to Client (Live GPS)' : 'Job Started (Live Sync)'}
                    </div>
                 </div>

                 <div className="flex bg-gray-900 border border-gray-800 p-4 rounded-xl items-center gap-4 mb-4">
                    <Avatar size="sm" className="bg-gray-800" />
                    <div>
                      <p className="text-sm font-bold text-gray-200">{activeJob.user}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">📍 {activeJob.location}</p>
                    </div>
                    <button className="ml-auto w-10 h-10 rounded-full bg-green-900/30 border border-green-800 flex items-center justify-center text-green-400 hover:bg-green-700 hover:text-white transition shadow-sm">
                      📞
                    </button>
                 </div>

                 <div className="flex bg-gray-900 border border-gray-800 p-4 rounded-xl flex-col gap-3 mb-4 text-sm mt-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                       <span className="text-gray-400">Order ID: <span className="text-blue-400 font-mono tracking-wider ml-1">{activeJob.orderId}</span></span>
                       <span className="text-gray-400">Price: <span className="font-bold text-white text-md">₹{activeJob.price}</span></span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-400">Payment:</span>
                       {activeJob.paymentMethod === 'online' ? (
                          <span className="px-2 py-0.5 rounded text-blue-400 bg-blue-900/30 border border-blue-800 text-xs font-bold font-mono">Platform Holds</span>
                       ) : (
                          <span className="px-2 py-0.5 rounded text-yellow-400 bg-yellow-900/30 border border-yellow-800 text-xs font-bold font-mono">Cash (On Delivery)</span>
                       )}
                    </div>
                 </div>

                 {/* Work Status Actions */}
                 {jobStatus === "traveling" ? (
                   <button 
                     onClick={() => setJobStatus("working")}
                     className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl text-lg font-bold text-white shadow-lg shadow-green-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                   >
                     ✅ Reached Location — Start Work
                   </button>
                 ) : (
                   <div className="flex flex-col gap-3">
                     <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between shadow-inner mb-4">
                        <div>
                          <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Live Work Timer</p>
                          <p className="text-xs text-gray-500">Tracking duration for client billing transparency</p>
                        </div>
                        <div className="text-3xl font-mono font-bold text-red-500 ml-4 animate-pulse tabular-nums">
                          {formatTime(workTimer)}
                        </div>
                     </div>
                     <button 
                       onClick={handleFinishJob}
                       className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-bold text-white shadow-lg transition transform hover:scale-[1.02]"
                     >
                       ⏹️ Finish Job & {activeJob.paymentMethod === 'online' ? 'Release Payment' : 'Collect Cash'}
                     </button>
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* � Wallet & Earnings Section */}
        {!activeJob && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
               <div>
                 <h2 className="text-md font-semibold text-gray-300 flex items-center gap-2">💰 My Wallet</h2>
                 <p className="text-xs text-gray-500">Platform Payments System</p>
               </div>
               <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition">Withdraw</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Available Balance</p>
                 <p className="text-2xl font-bold text-green-400">₹{wallet.balance}</p>
                 <p className="text-[10px] text-gray-500 mt-1">Platform held & ready to withdraw</p>
               </div>
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Earnings</p>
                 <p className="text-xl font-bold text-white">₹{wallet.totalEarnings}</p>
                 <p className="text-[10px] text-gray-500 mt-1">Including Cash Orders</p>
               </div>
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                 <p className="text-xs text-red-400/80 font-bold uppercase mb-1">Commission Paid</p>
                 <p className="text-lg font-bold text-red-400/80">₹{wallet.totalCommissionPaid}</p>
                 <p className="text-[10px] text-gray-500 mt-1">15% platform fee</p>
               </div>
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Jobs</p>
                 <p className="text-lg font-bold text-blue-400">{wallet.totalOrders}</p>
                 <p className="text-[10px] text-gray-500 mt-1">Completed successfully</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* �📥 Incoming Requests Header with Toggle */}
        {!activeJob && (
          <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-md font-semibold text-gray-300">Live Requests</h2>
                <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                  {requests.length} New
                </span>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`text-xs px-3 py-1.5 rounded-md transition ${viewMode === "list" ? "bg-gray-800 text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`text-xs px-3 py-1.5 rounded-md transition flex items-center gap-1 ${viewMode === "map" ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Radar 📡
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🗺️ Radar View */}
        {viewMode === "map" && !activeJob && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-80 bg-gray-900 border border-gray-800 rounded-2xl mb-8 relative overflow-hidden flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] bg-blue-950/10"
          >
            {/* Center Provider Outline */}
            <div className="absolute z-10 w-10 h-10 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              <span className="absolute -bottom-6 text-[10px] text-green-400 font-bold tracking-widest uppercase">YOU</span>
            </div>
            {/* Radar Sweeper */}
            <div className="absolute w-40 h-40 border border-blue-500/30 rounded-full animate-[spin_3s_linear_infinite] pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-blue-500/20 rotate-45 transform origin-right"></div>
            </div>

            {/* Request Blips */}
            {requests.map((req, i) => (
              <div 
                key={req.id} 
                className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] flex items-center justify-center cursor-pointer hover:scale-150 transition-transform z-20 group"
                style={{ 
                  top: `${30 + (i * 30)}%`, 
                  left: `${20 + (i * 45)}%` 
                }}
              >
                 <div className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-50"></div>
                 {/* Toolout Card on hover of blip */}
                 <div className="hidden group-hover:flex absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-red-500/50 p-2 rounded-xl flex-col items-center shadow-xl w-32 z-30">
                   <span className="text-[10px] text-red-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">New Job!</span>
                   <span className="text-xs text-white font-semibold text-center mt-1">₹{req.price}</span>
                 </div>
              </div>
            ))}
            
            {requests.length === 0 && (
              <div className="absolute z-20 text-gray-500 text-sm font-bold bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-800">
                No active requests...
              </div>
            )}
          </motion.div>
        )}

        {/* 📋 List View */}
        {viewMode === "list" && !activeJob && (
          <div className="space-y-4 mb-8">
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
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">₹{req.price}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase">
                        {req.paymentMethod === 'online' ? "Platform" : "Cash"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2 space-y-1">
                    <p>📦 Order: <span className="font-mono text-blue-400 bg-blue-900/20 px-1 py-0.5 rounded">{req.orderId}</span></p>
                    <p>👤 <span className="text-gray-300">{req.user}</span></p>
                    <p>📍 {req.location}</p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button 
                      onClick={() => handleAccept(req)}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-semibold transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDecline(req.id)}
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
        )}

        {/* 📜 Job History & Payouts */}
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
                  <div className="flex gap-2 items-center mt-1">
                    <p className="text-xs text-gray-500">📅 {job.date}</p>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-800 border border-gray-700 px-1 py-0.5 rounded tracking-wide uppercase">
                      {job.paymentMethod === 'online' ? '💳 WALLET' : '💵 CASH'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-md font-bold text-green-400">+₹{job.earning}</p>
                  <p className="text-[10px] text-red-500/80 font-bold mt-0.5 flex justify-end gap-1">
                    <span className="text-gray-500 font-normal">Fee:</span> -₹{job.commission}
                  </p>
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