function RecipePopup({ recipe, onClose }) {
    if (!recipe) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {recipe.image && <img src={recipe.image} className="popup-img" />}

                <h2>{recipe.title}</h2>
                <p>{recipe.description}</p>

                <h3>Ingredients</h3>
                <ul>
                    {recipe.ingredients?.map((i, idx) => (
                        <li key={idx}>
                            {i.quantity} {i.unit} {i.name}
                        </li>
                    ))}
                </ul>

                <h3>Instructions</h3>
                <ol>
                    {recipe.instructions?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>

                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default RecipePopup;