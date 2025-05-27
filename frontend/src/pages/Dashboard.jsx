import Navbar from "../components/Navbar";

export default function Dashboard() {
    return (
        <>
            <Navbar />

            <div className="p-6 bg-gray-950 min-h-screen text-white">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900 rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-300">Total Employees</h2>
                        <p className="text-4xl font-bold text-blue-400 mt-2">54</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-300">Active Users</h2>
                        <p className="text-4xl font-bold text-green-400 mt-2">43</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-300">Pending Requests</h2>
                        <p className="text-4xl font-bold text-yellow-400 mt-2">3</p>
                    </div>
                </div>

                <div className="mt-10 bg-gray-900 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Welcome Message</h2>
                    <p className="text-gray-400">
                        Welcome to the admin panel. Use the sidebar to manage employee records, view reports, and configure system settings.
                    </p>
                </div>
            </div>
        </>
    );
}
