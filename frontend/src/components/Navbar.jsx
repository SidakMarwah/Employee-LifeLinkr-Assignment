import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("username");
        if (user) setUsername(user);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-2xl font-bold">Admin Panel</div>

                {/* Mobile menu icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 items-center">
                    <li>
                        <Link to="/dashboard" className="hover:text-gray-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/employees" className="hover:text-gray-300">
                            Employee List
                        </Link>
                    </li>
                    <li className="text-sm text-gray-400">Welcome, {username}</li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden mt-3 px-2 space-y-2">
                    <Link
                        to="/dashboard"
                        className="block text-white hover:bg-gray-800 px-3 py-2 rounded"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/employees"
                        className="block text-white hover:bg-gray-800 px-3 py-2 rounded"
                        onClick={() => setMenuOpen(false)}
                    >
                        Employee List
                    </Link>
                    <div className="text-sm text-gray-400 px-3">Welcome, {username}</div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left bg-red-500 px-3 py-2 rounded hover:bg-red-600 text-sm"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
