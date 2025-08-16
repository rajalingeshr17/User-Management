import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
    const [input, setInput] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handlePassChange = (e) => {
        const passw = e.target.value;
        setInput((prev) => ({ ...prev, password:passw }));
        if(passw.length<8){
            setMessage("password must have 8 characters")
        }else{
            setMessage("")
        }
        if(passw.trim()==false){
            setMessage("password cannot be empty space")
        }
    };

    
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setInput((prev) => ({ ...prev, email }));

        if (!emailRegex.test(email)) {
            setError("Invalid email format");
        } else {
            setError(""); 
        }
    };

    
    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = input;

        if (password !== confirmPassword) {
            setMessage("Enter Same Password");
            return;
        }

        setLoading(true); 
        try {
            await axios.post('http://localhost:8000/api/createuser', { name, email, password, confirmPassword });
            navigate('/'); 
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='p-8 shadow-xl rounded-lg w-96 bg-white'>
                <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Register</h1>

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={input.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={input.email}
                            min={8}
                            onChange={handleEmailChange}
                            required
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={input.password}
                            min={8}
                            onChange={handlePassChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={input.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {message && <p className="text-red-500 text-sm mt-1">{message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`bg-green-500 text-white rounded-lg p-3 w-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${loading || error || !input.name || !input.email || !input.password || !input.confirmPassword ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading || error || !input.name || !input.email || !input.password || !input.confirmPassword}
                    >
                        {loading ? 'Submitting...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <a
                        href="#"
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={() => navigate('/')}
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signin;
