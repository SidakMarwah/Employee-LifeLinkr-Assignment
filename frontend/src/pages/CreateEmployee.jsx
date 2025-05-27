import Navbar from "../components/Navbar";
import EmployeeForm from "../components/EmployeeForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateEmployee() {
    const navigate = useNavigate();

    const handleCreate = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(import.meta.env.VITE_API_URL + "/api/employees", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // "Content-Type": "multipart/form-data",
                    "Content-Type": "application/json", // we can remove this as this is the default behavior of axios
                },
            });
            navigate("/employees");
        } catch (err) {
            console.error("Error creating employee:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
                <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Create New Employee
                    </h2>
                    <EmployeeForm onSubmit={handleCreate} />
                </div>
            </div>
        </>
    );
}
