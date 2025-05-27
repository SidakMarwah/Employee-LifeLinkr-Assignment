import API from "../services/api"; // Axios instance

export const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const res = await API.get("/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.status === 200;
    } catch (err) {
        localStorage.clear();
        return false;
    }
};
