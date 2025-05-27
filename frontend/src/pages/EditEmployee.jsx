import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EmployeeForm from "../components/EmployeeForm";
import axios from "axios";
import API from "../services/api";

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get(`${import.meta.env.VITE_API_URL}/api/employees/${id}`);
                setInitialValues(res.data);
            } catch (err) {
                console.error("Error fetching employee:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_API_URL}/api/employees/${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/employees");
        } catch (err) {
            console.error("Error updating employee:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
                <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10">
                    <h2 className="text-3xl font-bold mb-6 text-center">Edit Employee</h2>
                    {loading ? (
                        <p className="text-center text-gray-400">Loading employee data...</p>
                    ) : initialValues ? (
                        <EmployeeForm onSubmit={handleUpdate} initialValues={initialValues} />
                    ) : (
                        <p className="text-center text-red-500">Failed to load employee data.</p>
                    )}
                </div>
            </div>
        </>
    );
}
