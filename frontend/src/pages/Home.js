import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import RecipePopup from "../components/RecipePopup";
import "./Home.css";

const API = "https://recipebox-vf1j.onrender.com/api";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API}/recipes`);
      setRecipes(res.data);
    } catch (err) {
      console.error("Fetch recipes error:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.delete(`${API}/recipes/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipes((prev) => prev.filter((recipe) => recipe._id !== deleteId));
      setDeleteId(null);
      alert("Recipe deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const featured = recipes.slice(0, 4);
  const quick = recipes.filter((recipe) => Number(recipe.time) <= 30);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Discover Delicious Recipes</h1>
        <p>Cook smarter, eat better, share your favorites.</p>
      </div>

      <div className="page-header">
        <div>
          <h1>Home</h1>
          <p>Your latest recipes at a glance 🧡</p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-box">
          <h2>Ready to cook something amazing?</h2>
          <p>Add your favorite recipes and share with the world!</p>
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

          <h2 className="section-title">Quick Meals</h2>
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
                <p>Add recipes under 30 minutes to see them here.</p>
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
