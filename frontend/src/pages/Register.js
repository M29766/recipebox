import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";

const API_URL = "https://recipebox-backend-ankq.onrender.com/api/auth/register";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await axios.post(API_URL, form);

            alert("Registered successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Register error:", err);
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleRegister}>
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join RecipeBox and share your recipes.</p>

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;