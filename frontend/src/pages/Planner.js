import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const API_URL = "https://recipebox-backend-ankq.onrender.com/api/recipes";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function Planner() {
    const [recipes, setRecipes] = useState([]);
    const [plan, setPlan] = useState({});
    const [selectedRecipe, setSelectedRecipe] = useState({});

    useEffect(() => {
        fetchRecipes();

        const savedPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
        setPlan(savedPlan);
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(API_URL);
            setRecipes(res.data);
        } catch (err) {
            console.error("Fetch recipes error:", err);
        }
    };

    const savePlan = (updatedPlan) => {
        setPlan(updatedPlan);
        localStorage.setItem("mealPlan", JSON.stringify(updatedPlan));
    };

    const assignRecipe = (day) => {
        if (!selectedRecipe[day]) {
            alert("Please select a recipe first");
            return;
        }

        savePlan({
            ...plan,
            [day]: selectedRecipe[day],
        });
    };

    const removeRecipe = (day) => {
        const updated = { ...plan };
        delete updated[day];
        savePlan(updated);
    };

    return (
        <div className="home-page">
            <div className="page-header">
                <div>
                    <h1>Meal Planner</h1>
                    <p>Assign recipes to your weekly meal plan.</p>
                </div>
            </div>

            <div className="planner-grid">
                {days.map((day) => (
                    <div className="day-card" key={day}>
                        <h3>{day}</h3>

                        <select
                            value={selectedRecipe[day]?._id || ""}
                            onChange={(e) =>
                                setSelectedRecipe({
                                    ...selectedRecipe,
                                    [day]: recipes.find((r) => r._id === e.target.value),
                                })
                            }
                        >
                            <option value="">Select Recipe</option>
                            {recipes.map((recipe) => (
                                <option key={recipe._id} value={recipe._id}>
                                    {recipe.title}
                                </option>
                            ))}
                        </select>

                        <button className="assign-btn" onClick={() => assignRecipe(day)}>
                            + Add to {day}
                        </button>

                        {plan[day] && (
                            <div className="planned-recipe">
                                {plan[day].image ? (
                                    <img src={plan[day].image} alt={plan[day].title} />
                                ) : (
                                    <div className="recipe-placeholder small-placeholder">🍽️</div>
                                )}

                                <h4>{plan[day].title}</h4>
                                <p>
                                    ⏱ {plan[day].time || 0} min ·{" "}
                                    {plan[day].difficulty || "Easy"}
                                </p>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeRecipe(day)}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Planner;