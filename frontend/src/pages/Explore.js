import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import RecipePopup from "../components/RecipePopup";
import "./Home.css";

const API = "https://recipebox-backend-ankq.onrender.com/api";

function Explore() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API}/recipes`);
      setRecipes(res.data);
    } catch (err) {
      console.error("Fetch explore error:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const tags = ["All", ...new Set(recipes.flatMap((recipe) => recipe.tags || []))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTag =
      activeTag === "All" || recipe.tags?.includes(activeTag);

    const searchText = search.toLowerCase();

    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchText) ||
      recipe.description?.toLowerCase().includes(searchText) ||
      recipe.ingredients?.some((ing) =>
        ing.name?.toLowerCase().includes(searchText)
      );

    return matchesTag && matchesSearch;
  });

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

  return (
    <div className="home-page">
      <div className="page-header">
        <div>
          <h1>Explore Recipes</h1>
          <p>Search recipes by name, ingredients, or tags.</p>
        </div>
      </div>

      <div className="explore-search">
        <input
          type="text"
          placeholder="Search recipes, ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
          <p>Try another search or category.</p>
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
