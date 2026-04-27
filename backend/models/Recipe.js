const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        image: String,

        ingredients: [
            {
                name: String,
                quantity: String,
                unit: String,
            },
        ],

        instructions: [String],
        tags: [String],

        difficulty: {
            type: String,
            default: "Easy",
        },

        time: {
            type: Number,
            default: 0,
        },

        servings: {
            type: Number,
            default: 1,
        },

        cook: String,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        ratings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                value: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            },
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);