import { useEffect, useState } from "react";
import axios from "axios";
import RecipePopup from "../components/RecipePopup";
import "./Home.css";

function Feed() {
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get("https://recipebox-backend-ankq.onrender.com/api/recipes");
            setRecipes(res.data);
        } catch (err) {
            console.error("FEED ERROR:", err);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`https://recipebox-backend-ankq.onrender.com/api/recipes/${deleteId}`, {
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

    return (
        <div className="home-page">
            <div className="page-header">
                <div>
                    <h1>Your Feed</h1>
                    <p>Fresh recipes from the RecipeBox community.</p>
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="empty-box">
                    <h2>No recipes in feed yet</h2>
                    <p>Add your first recipe to start building your feed.</p>
                </div>
            ) : (
                <div className="feed-list">
                    {recipes.map((recipe) => (
                        <div className="feed-card" key={recipe._id}>
                            <div className="feed-left" onClick={() => setSelected(recipe)}>
                                {recipe.image ? (
                                    <img src={recipe.image} alt={recipe.title} />
                                ) : (
                                    <div className="feed-placeholder">🍽️</div>
                                )}
                            </div>

                            <div className="feed-info" onClick={() => setSelected(recipe)}>
                                <h3>{recipe.title}</h3>
                                <p>
                                    by {recipe.cook || recipe.user?.name || "Unknown"} ·{" "}
                                    {recipe.time || 0} min · {recipe.difficulty || "Easy"}
                                </p>

                                <div className="tag-row">
                                    {recipe.tags?.slice(0, 4).map((tag, i) => (
                                        <span key={i}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <button className="delete-btn" onClick={() => setDeleteId(recipe._id)}>
                                🗑 Delete
                            </button>
                        </div>
                    ))}
                </div>
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

export default Feed;