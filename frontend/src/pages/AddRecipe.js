import { useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const API_URL = "http://localhost:5000/api/recipes";

function AddRecipe() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "Easy",
        tags: "",
    });

    const [ingredients, setIngredients] = useState([
        { name: "", quantity: "", unit: "" },
    ]);

    const [instructions, setInstructions] = useState([""]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleImage = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length === 1) return;
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addStep = () => {
        setInstructions([...instructions, ""]);
    };

    const removeStep = (index) => {
        if (instructions.length === 1) return;
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const updateStep = (index, value) => {
        const updated = [...instructions];
        updated[index] = value;
        setInstructions(updated);
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            prepTime: "",
            cookTime: "",
            servings: "",
            difficulty: "Easy",
            tags: "",
        });

        setIngredients([{ name: "", quantity: "", unit: "" }]);
        setInstructions([""]);
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token) {
            alert("Please login first");
            return;
        }

        if (!form.title || !form.description) {
            alert("Please add title and description");
            return;
        }

        try {
            setLoading(true);

            const totalTime =
                Number(form.prepTime || 0) + Number(form.cookTime || 0);

            const cleanIngredients = ingredients.filter((ing) => ing.name.trim());
            const cleanInstructions = instructions.filter((step) => step.trim());

            const data = new FormData();

            data.append("title", form.title);
            data.append("description", form.description);
            data.append("time", totalTime);
            data.append("servings", form.servings || 1);
            data.append("difficulty", form.difficulty);
            data.append("cook", user?.name || "Anonymous");

            data.append("ingredients", JSON.stringify(cleanIngredients));
            data.append("instructions", JSON.stringify(cleanInstructions));
            data.append(
                "tags",
                JSON.stringify(
                    form.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                )
            );

            if (image) {
                data.append("image", image);
            }

            await axios.post(API_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Recipe added successfully!");
            resetForm();
        } catch (err) {
            console.error("Add recipe error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error adding recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="zomato-form">
            <h2>Add New Recipe</h2>

            <form onSubmit={handleSubmit}>
                <label className="z-card image-upload">
                    {preview ? (
                        <img src={preview} alt="Recipe preview" />
                    ) : (
                        <p>Click to upload food image 🍔</p>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImage(e.target.files[0])}
                    />
                </label>

                <div className="z-card">
                    <h3>Basic Info</h3>

                    <input
                        name="title"
                        placeholder="Recipe Title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Short description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="z-card">
                    <h3>Details</h3>

                    <div className="row">
                        <input
                            name="prepTime"
                            type="number"
                            placeholder="Prep Time (min)"
                            value={form.prepTime}
                            onChange={handleChange}
                        />

                        <input
                            name="cookTime"
                            type="number"
                            placeholder="Cook Time (min)"
                            value={form.cookTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="row">
                        <input
                            name="servings"
                            type="number"
                            placeholder="Servings"
                            value={form.servings}
                            onChange={handleChange}
                        />

                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                <div className="z-card">
                    <h3>Tags</h3>

                    <input
                        name="tags"
                        placeholder="Vegan, Italian, Quick"
                        value={form.tags}
                        onChange={handleChange}
                    />
                </div>

                <div className="z-card">
                    <h3>Ingredients</h3>

                    {ingredients.map((ing, index) => (
                        <div className="row ingredient-row" key={index}>
                            <input
                                placeholder="Qty"
                                value={ing.quantity}
                                onChange={(e) =>
                                    updateIngredient(index, "quantity", e.target.value)
                                }
                            />

                            <input
                                placeholder="Unit"
                                value={ing.unit}
                                onChange={(e) =>
                                    updateIngredient(index, "unit", e.target.value)
                                }
                            />

                            <input
                                placeholder="Ingredient"
                                value={ing.name}
                                onChange={(e) =>
                                    updateIngredient(index, "name", e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="mini-delete"
                                onClick={() => removeIngredient(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button type="button" className="add-btn" onClick={addIngredient}>
                        + Add Ingredient
                    </button>
                </div>

                <div className="z-card">
                    <h3>Instructions</h3>

                    {instructions.map((step, index) => (
                        <div className="step-row" key={index}>
                            <textarea
                                placeholder={`Step ${index + 1}`}
                                value={step}
                                onChange={(e) => updateStep(index, e.target.value)}
                            />

                            <button
                                type="button"
                                className="mini-delete"
                                onClick={() => removeStep(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button type="button" className="add-btn" onClick={addStep}>
                        + Add Step
                    </button>
                </div>

                <div className="z-actions">
                    <button
                        type="button"
                        className="cancel"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>

                    <button type="submit" className="save" disabled={loading}>
                        {loading ? "Saving..." : "Save Recipe"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddRecipe;