const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Product description is required"]
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            enum: [
                "Protein",
                "Supplements",
                "Vitamins",
                "Fitness Equipment",
                "Accessories",
                "Other"
            ]
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: 0
        },

        originalPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            min: 0,
            default: 0
        },

        image: {
            type: String,
            default: ""
        },

        brand: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        numReviews: {
            type: Number,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);