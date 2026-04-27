import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const API_URL = "https://recipebox-backend-ankq.onrender.com/api/recipes";

function Cookbooks() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();

        const saved = JSON.parse(localStorage.getItem("savedCookbook")) || [];
        setSavedRecipes(saved);
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(API_URL);
            setRecipes(res.data);
        } catch (err) {
            console.error("Fetch recipes error:", err);
        }
    };

    const saveRecipe = (recipe) => {
        const alreadySaved = savedRecipes.some((r) => r._id === recipe._id);

        if (alreadySaved) {
            alert("Recipe already saved");
            return;
        }

        const updated = [...savedRecipes, recipe];
        setSavedRecipes(updated);
        localStorage.setItem("savedCookbook", JSON.stringify(updated));
    };

    const removeRecipe = (id) => {
        const updated = savedRecipes.filter((recipe) => recipe._id !== id);
        setSavedRecipes(updated);
        localStorage.setItem("savedCookbook", JSON.stringify(updated));
    };

    return (
        <div className="home-page">
            <div className="page-header">
                <div>
                    <h1>My Cookbooks</h1>
                    <p>Save your favorite recipes into your personal cookbook.</p>
                </div>
            </div>

            <h2 className="section-title">Saved Recipes</h2>

            {savedRecipes.length === 0 ? (
                <div className="empty-box">
                    <h2>📖 No saved recipes yet</h2>
                    <p>Save recipes from below to build your cookbook.</p>
                </div>
            ) : (
                <div className="recipe-grid">
                    {savedRecipes.map((recipe) => (
                        <div className="recipe-card" key={recipe._id}>
                            {recipe.image ? (
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="recipe-img"
                                />
                            ) : (
                                <div className="recipe-placeholder">🍽️</div>
                            )}

                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="meta">
                                    ⏱ {recipe.time || 0} min · {recipe.difficulty || "Easy"}
                                </p>
                                <p className="desc">
                                    {recipe.description || "No description added."}
                                </p>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="delete-btn"
                                    onClick={() => removeRecipe(recipe._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="section-title">All Recipes</h2>

            <div className="recipe-grid">
                {recipes.map((recipe) => (
                    <div className="recipe-card" key={recipe._id}>
                        {recipe.image ? (
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="recipe-img"
                            />
                        ) : (
                            <div className="recipe-placeholder">🍽️</div>
                        )}

                        <div className="recipe-content">
                            <h3>{recipe.title}</h3>
                            <p className="meta">
                                ⏱ {recipe.time || 0} min · {recipe.difficulty || "Easy"}
                            </p>
                            <p className="desc">
                                {recipe.description || "No description added."}
                            </p>
                        </div>

                        <div className="card-actions">
                            <button className="view-btn" onClick={() => saveRecipe(recipe)}>
                                Save to Cookbook
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cookbooks;