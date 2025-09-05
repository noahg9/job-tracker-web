import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/.auth/me");
                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                if (data && data.clientPrincipal) {
                    navigate("/", { replace: true });
                } else {
                    setLoading(false);
                }
            } catch {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleRegister = () => {
        window.location.href = "/.auth/login/github?post_login_redirect_uri=/";
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <h2>Register</h2>
                <p>Create an account to get started.</p>
                <button onClick={handleRegister}>Register / Login</button>
            </div>
        </div>
    );
};

export default Register;
