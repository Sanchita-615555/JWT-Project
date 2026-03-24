import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("BASE_URL =", BASE_URL);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert(data.message);
      setEmail("");
      setPassword("");
    } catch {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("token", data.token);
      alert("Login successful");
    } catch {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setProfile(data);
    } catch {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    alert("Logged out");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
          JWT Auth System
        </h1>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Signup"}
          </button>
        </form>

        {/* Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Login
        </button>

        {/* Actions */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={getProfile}
            disabled={loading}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Profile */}
        {profile && (
          <div className="mt-5 bg-gray-100 p-3 rounded-lg text-xs sm:text-sm overflow-auto max-h-40">
            <h2 className="font-semibold mb-2 text-gray-700">Profile</h2>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;