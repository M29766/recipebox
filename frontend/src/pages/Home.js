import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import RecipePopup from "../components/RecipePopup";
import "./Home.css";

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get("https://recipebox-vf1j.onrender.com/api/recipes");
            setRecipes(res.data);
        } catch (err) {
            console.error("FETCH RECIPES ERROR:", err);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`https://recipebox-vf1j.onrender.com/api/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRecipes((prev) => prev.filter((r) => r._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("DELETE ERROR:", err);
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    const featured = recipes.slice(0, 4);
    const quick = recipes.filter((r) => Number(r.time) <= 30);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div>
                    <p className="hero-badge">🍽 RecipeBox</p>
                    <h1>Discover Delicious Recipes</h1>
                    <p>Cook smarter, eat better, and share your favorite dishes with food lovers.</p>
                </div>
            </section>

            <div className="page-header">
                <div>
                    <h1>Home</h1>
                    <p>Your latest recipes at a glance.</p>
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="empty-box">
                    <h2>Ready to cook something amazing?</h2>
                    <p>Add your favorite recipes and share them with the world.</p>
                </div>
            ) : (
                <>
                    <h2 className="section-title">Featured Recipes</h2>
                    <div className="recipe-grid">
                        {featured.map((recipe) => (
                            <RecipeCard
                                key={recipe._id}
                                recipe={recipe}
                                onView={setSelected}
                                onDelete={setDeleteId}
                            />
                        ))}
                    </div>

                    <h2 className="section-title">Quick Meals Under 30 Min</h2>
                    <div className="recipe-grid">
                        {quick.length > 0 ? (
                            quick.map((recipe) => (
                                <RecipeCard
                                    key={recipe._id}
                                    recipe={recipe}
                                    onView={setSelected}
                                    onDelete={setDeleteId}
                                />
                            ))
                        ) : (
                            <div className="empty-box">
                                <h2>No quick meals yet</h2>
                                <p>Add recipes with cooking time under 30 minutes.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <RecipePopup recipe={selected} onClose={() => setSelected(null)} />

            {deleteId && (
                <div className="modal">
                    <div className="confirm-box">
                        <h2>Delete recipe?</h2>
                        <p>This action cannot be undone.</p>

                        <div className="confirm-actions">
                            <button className="cancel-btn" onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>
                            <button className="confirm-btn" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
