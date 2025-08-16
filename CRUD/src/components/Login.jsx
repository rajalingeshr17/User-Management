import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const handleEmailChange = (e) => {
    const email = e.target.value;
    setInput((prev) => ({ ...prev, email }));


    if (!emailRegex.test(email)) {
      setError("Invalid email format");
    } else {
      setError(""); 
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = input;

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/crud"); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed, please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 shadow-xl rounded-xl w-96 bg-white">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input.email}
              required
              onChange={handleEmailChange}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input.password}
              min={8}
              required
              onChange={(e) =>
                setInput((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            {message && <p className="text-red-400 text-sm mt-2">{message}</p>}
          </div>

          <button
            className="bg-blue-600 text-white rounded-lg p-3 w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="submit"
            disabled={error || !input.email || !input.password}
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => navigate("/signin")}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
