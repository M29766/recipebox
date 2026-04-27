import "../styles/styles.css";

function RecipeCard({ recipe, onView, onDelete }) {
    const user = JSON.parse(localStorage.getItem("user"));

    const canDelete =
        recipe.user?._id === user?._id || recipe.user === user?._id;

    return (
        <div className="recipe-card">
            <div onClick={() => onView(recipe)} className="recipe-click">
                {recipe.image ? (
                    <img src={recipe.image} alt="" className="recipe-img" />
                ) : (
                    <div className="recipe-placeholder">🍽️</div>
                )}

                <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <p className="meta">
                        ⏱ {recipe.time} min · {recipe.difficulty}
                    </p>
                    <p className="desc">{recipe.description}</p>
                </div>
            </div>

            <div className="card-actions">
                <button className="view-btn" onClick={() => onView(recipe)}>
                    View
                </button>

                {canDelete && (
                    <button className="delete-btn" onClick={() => onDelete(recipe._id)}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default RecipeCard;