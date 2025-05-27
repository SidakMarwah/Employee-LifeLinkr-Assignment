import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-950">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-1 text-sm text-gray-300">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-sm text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
