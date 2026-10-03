const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Strength",
                "Cardio",
                "Flexibility",
                "Balance",
                "HIIT"
            ]
        },

        muscleGroup: {
            type: String,
            required: true,
            enum: [
                "Chest",
                "Back",
                "Shoulders",
                "Biceps",
                "Triceps",
                "Legs",
                "Glutes",
                "Abs",
                "Full Body"
            ]
        },

        equipment: {
            type: String,
            default: "None"
        },

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },

        instructions: {
            type: [String],
            default: []
        },

        image: {
            type: String,
            default: ""
        },

        videoUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Exercise", exerciseSchema);