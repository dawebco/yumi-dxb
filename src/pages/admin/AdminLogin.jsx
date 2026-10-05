import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUserRole } from "../../services/authService";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      const role = await getUserRole(user.uid);

      if (role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-10 rounded-3xl shadow-xl border border-[#ECE8E3]"
      >
        <h1 className="text-3xl font-serif text-[#2E2A27] mb-1">YUMI Admin</h1>
        <p className="text-sm text-[#8A8178] mb-8">Owner access only</p>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#465348] text-white hover:bg-[#39443A] transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}