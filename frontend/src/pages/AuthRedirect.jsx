import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRedirect = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    },[]);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("https://flowvault.onrender.com/api/v1/user/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.user) {
                navigate("/dashboard");
            } else {
                navigate("/signup");
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            navigate("/signup");
        } finally {
            setLoading(false);
        };

        if(loading) {
            return (
                 <div className="min-h-screen bg-slate-300 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
            );
        }
    };
};

export default AuthRedirect;
