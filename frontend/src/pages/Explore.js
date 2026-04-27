import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import RecipePopup from "../components/RecipePopup";
import "./Home.css";

function Explore() {
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [activeTag, setActiveTag] = useState("All");
    const [search, setSearch] = useState("");

    const fetchRecipes = async () => {
        try {
            const res = await axios.get("https://recipebox-vf1j.onrender.com/api/recipes");
            setRecipes(res.data);
        } catch (err) {
            console.error("EXPLORE ERROR:", err);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const tags = ["All", ...new Set(recipes.flatMap((r) => r.tags || []))];

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesTag =
            activeTag === "All" || recipe.tags?.includes(activeTag);

        const text = `${recipe.title} ${recipe.description} ${recipe.difficulty} ${recipe.tags?.join(" ")}`.toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase());

        return matchesTag && matchesSearch;
    });

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`https://recipebox-vf1j.onrender.com/api/recipes/${deleteId}`, {
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
                    <h1>Explore Recipes</h1>
                    <p>Search and filter recipes by category.</p>
                </div>
            </div>

            <input
                className="search-box"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-tags">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className={activeTag === tag ? "active" : ""}
                        onClick={() => setActiveTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {filteredRecipes.length === 0 ? (
                <div className="empty-box">
                    <h2>No recipes found</h2>
                    <p>Try another keyword or category.</p>
                </div>
            ) : (
                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe._id}
                            recipe={recipe}
                            onView={setSelected}
                            onDelete={setDeleteId}
                        />
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

export default Explore;
