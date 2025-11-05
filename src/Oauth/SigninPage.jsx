import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import {signupUser} from "../api.js";
import { FcGoogle } from "react-icons/fc";
import lightBg from "../assets/lightMode.png";
import darkBg from "../assets/darkMode.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function SignUpPage() {
    const [formData, setFormData] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    const [showPassword, setShowPassword] = useState(false);


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
}

  const navigate = useNavigate();

  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log("User Info:", userInfo);

        localStorage.setItem("user", JSON.stringify(userInfo));

        navigate("/dashboard");
      } catch (error) {
        console.error("Signup failed:", error);
      }
    },
    onError: () => console.log("Sign Up Failed"),
  });


 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await signupUser(formData);
    console.log("Signup successful:", response);
    alert("Signup successful!");

   
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

      if (response.user_id) 
        {
          localStorage.setItem("userId", response.user_id);
        }
  

    navigate("/dashboard");
  } catch (error) {
    console.error("Signup failed:", error);
    alert("Signup failed. Please check your details and try again.");
  }
};

  
  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-all duration-500">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${lightBg})` }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-center hidden dark:block transition-all duration-500"
        style={{ backgroundImage: `url(${darkBg})` }}
      ></div>

      <div className="absolute inset-0  dark:bg-black/20"></div>

      {/* Sign Up Card */}
      <div className=" relative z-10 flex items-center justify-center min-h-screen">
        <div
           className="h-full lg:w-[90%] md:w-1/2 max-w-[600px] px-20 py-5 rounded-2xl
         md:bg-white/10 lg:bg-white/10 md:dark:bg-black/100 lg:dark:bg-black/100 lg:backdrop-blur-lg
          md:shadow-2xl dark:text-white"
        >
          <h2 className="text-3xl font-bold mb-1 text-center">Create Account</h2>
          <p className="mb-6 text-center text-xs">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 dark:text-blue-700 cursor-pointer">Sign In</Link>
          </p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="User Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 px-10 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 px-10 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 px-10 w-full rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash /> }
          </button>
        </div>


            <button
              type="submit"
              className="mt-4 mb-7 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center mb-7 px-4">
            <div className="flex-grow border-t border-gray-500"></div>
            <span className="mx-2 text-blue-500 dark:text-blue-700  text-sm">Or sign up with</span>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>

          
          <button
          onClick={() => signup()}
            type="button"
            className="flex items-center justify-center gap-3 px-3 w-full bg-gray-400 dark:bg-gray-500 transition py-3 rounded-lg"
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
