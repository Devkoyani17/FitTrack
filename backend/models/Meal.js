const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        mealType: {
            type: String,
            required: true,
            enum: [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snack"
            ]
        },

        calories: {
            type: Number,
            required: true,
            min: 0
        },

        protein: {
            type: Number,
            default: 0,
            min: 0
        },

        carbs: {
            type: Number,
            default: 0,
            min: 0
        },

        fats: {
            type: Number,
            default: 0,
            min: 0
        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Meal", mealSchema);