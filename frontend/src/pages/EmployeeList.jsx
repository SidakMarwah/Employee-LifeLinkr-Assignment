import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // or 10 based on your UI

  useEffect(() => {
    API.get("/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEmployees = employees
    .filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await API.patch(`/employees/${id}/status`, { status: updatedStatus });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, status: updatedStatus } : emp
        )
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await API.delete(`${import.meta.env.VITE_API_URL}/api/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert(`${name} has been deleted.`);
    } catch (error) {
      console.error("Failed to delete employee:", error);
      alert(`Failed to delete ${name}. Please try again.`);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Employee List</h1>

        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by ID, Name, or Email"
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset pagination on search
            }}
          />
          <Link
            to="/employees/create"
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Employee
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("employeeId")}
                >
                  ID {sortField === "employeeId" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2">Image</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Course</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("createdDate")}
                >
                  Created Date{" "}
                  {sortField === "createdDate"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                currentEmployees.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-gray-800">
                    <td className="px-4 py-2">{emp.employeeId}</td>
                    <td className="px-4 py-2">
                      <img
                        src={(!emp.image || emp.image === "") ? "src/assets/default-avatar.avif" : emp.image}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 text-nowrap">{emp.name}</td>
                    <td className="px-4 py-2 text-nowrap">{emp.email}</td>
                    <td className="px-4 py-2 text-nowrap">{emp.mobile}</td>
                    <td className="px-4 py-2 text-nowrap">{emp.designation}</td>
                    <td className="px-4 py-2 text-nowrap">{emp.gender}</td>
                    <td className="px-4 py-2 text-nowrap">{Array.isArray(emp.course) ? emp.course.join(", ") : emp.course}</td>
                    <td className="px-4 py-2 text-nowrap">{emp.createdDate}</td>
                    <td className="px-4 py-2 text-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === "Active"
                          ? "bg-green-600 text-green-100"
                          : "bg-gray-600 text-gray-300"
                          }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2 text-nowrap">
                      <Link
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                        to={`/employees/edit/${emp._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                        onClick={() => handleDelete(emp._id, emp.name)}
                      >
                        Delete
                      </button>
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${emp.status === "Active"
                          ? "bg-gray-700 hover:bg-gray-800 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        onClick={() => handleToggleStatus(emp._id, emp.status)}
                      >
                        {emp.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6 space-x-2 overflow-x-auto">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
