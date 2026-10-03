const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: [true, "Goal title is required"],
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        targetValue: {
            type: Number,
            required: [true, "Target value is required"]
        },

        currentValue: {
            type: Number,
            default: 0
        },

        unit: {
            type: String,
            default: "kg"
        },

        deadline: {
            type: Date,
            required: [true, "Target deadline date is required"]
        },

        status: {
            type: String,
            enum: [
                "active",
                "completed",
                "cancelled"
            ],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Goal", goalSchema);