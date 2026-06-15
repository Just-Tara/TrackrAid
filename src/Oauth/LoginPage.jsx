import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser } from "../api";
import { FcGoogle } from "react-icons/fc";
import lightBg from "../assets/lightMode.png";
import darkBg from "../assets/darkMode.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTransactions } from "../Context/TransactionContext";

function LoginPage() {
  const navigate = useNavigate();
  const { fetchTransactions } = useTransactions();

  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await loginUser(credentials);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      if (response.data?.id) {
        localStorage.setItem("userId", response.data.id);
      }

      // Save user info so dashboard/settings can read name + email
      const userInfo = {
        username: response.data?.username || credentials.email,
        email: response.data?.email || credentials.email,
        name: response.data?.name || response.data?.username || credentials.email,
      };
      localStorage.setItem("user", JSON.stringify(userInfo));

      setSuccess("Login successful!");
      await fetchTransactions();

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        // Google returns name, email, picture — normalise to same shape
        localStorage.setItem("user", JSON.stringify({
          username: userInfo.name,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        }));
        navigate("/dashboard");
        await fetchTransactions();
      } catch (err) {
        console.error("Google login failed:", err);
      }
    },
    onError: () => console.log("Google Login Failed"),
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${lightBg})` }} />
      <div className="absolute inset-0 bg-cover bg-center hidden dark:block" style={{ backgroundImage: `url(${darkBg})` }} />
      <div className="absolute inset-0 dark:bg-black/20" />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[600px] px-10 py-8 rounded-2xl md:bg-white/10 dark:md:bg-black/80 backdrop-blur-lg shadow-2xl dark:text-white">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-sm mb-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">Sign Up</Link>
          </p>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-3">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-3">{success}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="text"
              name="email"
              placeholder="Email or Username"
              value={credentials.email}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Logging in...</>
              ) : "Login"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t" />
            <span className="mx-3 text-sm">OR</span>
            <div className="flex-grow border-t" />
          </div>

          <button
            onClick={() => login()}
            className="w-full flex items-center justify-center gap-3 bg-gray-400 dark:bg-gray-600 py-3 rounded-lg"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;