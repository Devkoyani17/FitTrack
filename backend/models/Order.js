const mongoose = require("mongoose");


// ========================================
// ORDER ITEM
// ========================================

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            default: ""
        }
    }
);


// ========================================
// ORDER
// ========================================

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        orderItems: [
            orderItemSchema
        ],

        shippingAddress: {

            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            postalCode: {
                type: String,
                required: true
            },

            country: {
                type: String,
                required: true,
                default: "India"
            }
        },

        paymentMethod: {
            type: String,

            required: true,

            enum: [
                "Cash on Delivery",
                "Online Payment"
            ],

            default: "Cash on Delivery"
        },

        paymentStatus: {
            type: String,

            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded"
            ],

            default: "Pending"
        },

        orderStatus: {
            type: String,

            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],

            default: "Pending"
        },

        subtotal: {
            type: Number,
            required: true
        },

        discount: {
            type: Number,
            default: 0
        },

        shippingPrice: {
            type: Number,
            default: 0
        },

        totalPrice: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Order",
    orderSchema
);