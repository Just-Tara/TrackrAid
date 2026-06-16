import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api.js";
import { FcGoogle } from "react-icons/fc";
import lightBg from "../assets/lightMode.png";
import darkBg from "../assets/darkMode.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { googleLoginUser } from "../api.js";

function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await signupUser(formData);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.data?.id) {
        localStorage.setItem("userId", response.data.id);
      }

      // Save user info — use the username they typed at signup
      const userInfo = {
        username: response.data?.username || formData.username,
        email: response.data?.email || formData.email,
        name: response.data?.name || response.data?.username || formData.username,
      };
      localStorage.setItem("user", JSON.stringify(userInfo));

     
      localStorage.setItem("needsOnboarding", "true");

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/onboarding"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        try {
            const response = await googleLoginUser(tokenResponse.access_token);
            
            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("user", JSON.stringify({
                username: response.data.username,
                email: response.data.email,
                name: response.data.username,
            }));

            localStorage.setItem("needsOnboarding", "true");
            navigate("/onboarding");
        } catch (err) {
            console.error("Google signup failed:", err);
        }
    },
    onError: () => console.log("Google Signup Failed"),
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-all duration-500">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${lightBg})` }} />
      <div className="absolute inset-0 bg-cover bg-center hidden dark:block" style={{ backgroundImage: `url(${darkBg})` }} />
      <div className="absolute inset-0 dark:bg-black/20" />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="h-full lg:w-[90%] md:w-1/2 max-w-[600px] px-20 py-5 rounded-2xl md:bg-white/10 lg:bg-white/10 md:dark:bg-black lg:dark:bg-black lg:backdrop-blur-lg md:shadow-2xl dark:text-white">
          <h2 className="text-3xl font-bold mb-1 text-center">Create Account</h2>
          <p className="mb-6 text-center text-xs">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 dark:text-blue-700 cursor-pointer">Sign In</Link>
          </p>

          {error && <div className="mb-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">{success}</div>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-3 px-10 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="p-3 px-10 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                minLength={6}
                className="p-3 px-10 w-full rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 mb-7 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</>
              ) : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center mb-7 px-4">
            <div className="flex-grow border-t border-gray-500" />
            <span className="mx-2 text-blue-500 dark:text-blue-700 text-sm">Or sign up with</span>
            <div className="flex-grow border-t border-gray-500" />
          </div>

          <button
            onClick={() => signup()}
            type="button"
            className="flex items-center justify-center gap-3 px-3 w-full bg-gray-400 dark:bg-gray-500 transition py-3 rounded-lg hover:opacity-90"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;