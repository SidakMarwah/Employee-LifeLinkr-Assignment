import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "../utils/validateToken";

export default function GuestRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const check = async () => {
            const isValid = await validateToken();
            setIsAuthenticated(isValid);
            setIsLoading(false);
        };
        check();
    }, []);

    if (isLoading) return <div>Checking login status...</div>;

    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}
// This component allows access to routes only if the user is not authenticated.
// If the user is authenticated, it redirects them to the dashboard.