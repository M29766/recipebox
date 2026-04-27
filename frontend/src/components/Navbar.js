import { NavLink, useNavigate } from "react-router-dom";
import "../styles/styles.css";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">🍽 RecipeBox</div>

            <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/feed">Feed</NavLink>
                <NavLink to="/explore">Explore</NavLink>
                <NavLink to="/cookbooks">Cookbooks</NavLink>
                <NavLink to="/planner">Planner</NavLink>
                <NavLink to="/add">Add</NavLink>

                {user ? (
                    <>
                        <span className="user-name">Hi, {user.name}</span>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <NavLink to="/login">Login</NavLink>
                )}
            </div>
        </nav>
    );
}

export default Navbar;