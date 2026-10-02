const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        exerciseName: {
            type: String,
            required: true,
            trim: true
        },

        sets: {
            type: Number,
            required: true,
            min: 1
        },

        reps: {
            type: Number,
            required: true,
            min: 1
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Workout", workoutSchema);