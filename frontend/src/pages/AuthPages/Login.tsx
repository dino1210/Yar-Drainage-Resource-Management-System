import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      toast.success("Login successful");
      navigate("/select-mode");
    } catch (err) {
      toast.error("Login unsuccessful");
      setLoginError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center justify-center items-center px-4"
      style={{ backgroundImage: "url('/images/logo/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="relative hidden sm:flex flex-col items-center text-center text-white p-6">
        <h1 className="text-5xl font-bold mb-1" style={{ color: "#17A2B8" }}>
          Yardrainage
        </h1>
        <h2 className="text-3xl font-light mb-2" style={{ color: "#17A2B8" }}>
          Maintenance and Services
        </h2>
        <h3 className="text-xl">Resource Management System</h3>
      </div>

      {/* Login Form */}
      <div className="relative flex flex-col items-center p-6 sm:p-8 bg-white w-full max-w-sm shadow-lg rounded-3xl">
        <form className="w-full">
          <div className="mb-4">
            <div className="flex justify-center items-center text-blue-500">
              <CircleUserRound className="w-12 h-12" />
            </div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Username:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username..."
              className="w-full px-4 py-2 border text-xs border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full px-4 py-2 border text-xs border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {loginError && <p className="text-red-500 text-xs">{loginError}</p>}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full px-4 py-2 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <div className="flex items-center justify-end mt-4">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=0gcJCdgAo7VqN5tD"
              className="text-xs text-blue-600 hover:underline"
            >
              Contact Administrator
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
