import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "../utils/validateToken";

export default function ProtectedRoute({ children }) {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        validateToken().then((valid) => {
            if (!valid) localStorage.clear();
            setIsValid(valid);
        });
    }, []);

    if (isValid === null) return <div>Loading...</div>;
    return isValid ? children : <Navigate to="/login" />;
}
// This component checks if the user is authenticated before rendering the children components.
// If the token is invalid or not present, it redirects to the login page.