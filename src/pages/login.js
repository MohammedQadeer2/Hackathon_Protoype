import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("provider");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!name || !email) {
      alert("Fill all fields");
      return;
    }
    
    // Use our new global context!
    login(role, { 
      name, 
      email, 
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" 
    });
    
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 text-white">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl"
      >

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Help Me Buddy
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          AI-powered local assistance ⚡
        </p>

        {/* Role Toggle */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setRole("user")}
            className={`w-1/2 py-2 rounded-md transition ${
              role === "user"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400"
            }`}
          >
            User
          </button>

          <button
            onClick={() => setRole("provider")}
            className={`w-1/2 py-2 rounded-md transition ${
              role === "provider"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400"
            }`}
          >
            Provider
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Button Component */}
        <Button onClick={handleLogin} variant="primary">
          Continue →
        </Button>

        {/* Footer Hint */}
        <p className="text-xs text-center text-gray-500 mt-5">
          Fast. Local. Reliable.
        </p>
      </motion.div>
    </div>
  );
}

export default Login;