const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const Recipe = require("../models/Recipe");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
    try {
        const { search, tag, difficulty, maxTime, ingredient, exclude } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
                { "ingredients.name": { $regex: search, $options: "i" } },
            ];
        }

        if (tag && tag !== "All") {
            query.tags = { $in: [tag] };
        }

        if (difficulty && difficulty !== "All") {
            query.difficulty = difficulty;
        }

        if (maxTime) {
            query.time = { $lte: Number(maxTime) };
        }

        if (ingredient) {
            query["ingredients.name"] = {
                $regex: ingredient,
                $options: "i",
            };
        }

        if (exclude) {
            query["ingredients.name"] = {
                ...(query["ingredients.name"] || {}),
                $not: new RegExp(exclude, "i"),
            };
        }

        const recipes = await Recipe.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/feed", auth, async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "recipebox",
            });

            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const recipe = await Recipe.create({
            title: req.body.title,
            description: req.body.description,
            time: Number(req.body.time || 0),
            servings: Number(req.body.servings || 1),
            difficulty: req.body.difficulty || "Easy",
            cook: req.body.cook,
            user: req.user.id,

            ingredients: JSON.parse(req.body.ingredients || "[]"),
            instructions: JSON.parse(req.body.instructions || "[]"),
            tags: JSON.parse(req.body.tags || "[]"),

            image: imageUrl,
        });

        const populatedRecipe = await Recipe.findById(recipe._id).populate("user", "name email");

        res.status(201).json(populatedRecipe);
    } catch (err) {
        console.error("ADD RECIPE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id/comment", auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        recipe.comments.push({
            user: req.user.id,
            text: req.body.text,
        });

        await recipe.save();

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id/rate", auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        recipe.ratings = recipe.ratings.filter(
            (r) => r.user.toString() !== req.user.id
        );

        recipe.ratings.push({
            user: req.user.id,
            value: Number(req.body.value),
        });

        await recipe.save();

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.user && recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await recipe.deleteOne();

        res.json({ message: "Recipe deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;