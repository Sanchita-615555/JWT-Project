import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);

  // ✅ BASE_URL debug log
  console.log("BASE_URL =", BASE_URL);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(data.message);
    } catch {
      alert("Server not reachable");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      setProfile(data);
    } catch {
      alert("Server not reachable");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    alert("Logged out");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          JWT Mini Project
        </h1>
        <form onSubmit={handleSignup} className="space-y-4">
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
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Signup
          </button>
        </form>
        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Login
        </button>
        <div className="flex gap-3 mt-4">
          <button
            onClick={getProfile}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Get Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        {profile && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg text-sm">
            <h2 className="font-semibold mb-2">Profile</h2>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
