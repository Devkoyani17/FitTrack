const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");


// ========================================
// CREATE ORDER
// ========================================

const createOrder = async (
    req,
    res,
    next
) => {

    try {

        const {
            orderItems,
            shippingAddress,
            paymentMethod
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !orderItems ||
            orderItems.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "No order items provided"
            });
        }


        if (
            !shippingAddress ||
            !shippingAddress.address ||
            !shippingAddress.phone ||
            !shippingAddress.city
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Complete shipping address is required"
            });
        }


        // ========================================
        // VERIFY PRODUCTS + STOCK
        // ========================================

        let subtotal = 0;

        let totalDiscount = 0;

        const verifiedOrderItems = [];


        for (
            const item of orderItems
        ) {

            const dbProduct =
                await Product.findById(
                    item.product
                );


            if (
                !dbProduct ||
                !dbProduct.isActive
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        `Product "${item.name || item.product}" no longer exists or is inactive`
                });
            }


            if (
                dbProduct.stock <
                item.quantity
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Insufficient stock for product "${dbProduct.name}". Available: ${dbProduct.stock}`
                });
            }


            // ========================================
            // CURRENT PROJECT PRODUCT STRUCTURE
            // ========================================

            const originalPrice =
                dbProduct.originalPrice > 0
                    ? dbProduct.originalPrice
                    : dbProduct.price;


            const finalUnitPrice =
                dbProduct.price;


            subtotal +=
                originalPrice *
                item.quantity;


            if (
                originalPrice >
                finalUnitPrice
            ) {

                totalDiscount +=
                    (
                        originalPrice -
                        finalUnitPrice
                    ) *
                    item.quantity;
            }


            verifiedOrderItems.push({

                product:
                    dbProduct._id,

                name:
                    dbProduct.name,

                quantity:
                    item.quantity,

                price:
                    finalUnitPrice,

                image:
                    dbProduct.image || ""
            });
        }


        // ========================================
        // SHIPPING
        // ========================================

        const shippingPrice =
            subtotal > 1500
                ? 0
                : 99;


        // ========================================
        // TOTAL
        // ========================================

        const totalPrice =
            (
                subtotal -
                totalDiscount
            ) +
            shippingPrice;


        // ========================================
        // CREATE ORDER
        // ========================================

        const order =
            await Order.create({

                user:
                    req.user._id,

                orderItems:
                    verifiedOrderItems,

                shippingAddress,

                paymentMethod:
                    paymentMethod ||
                    "Cash on Delivery",

                paymentStatus:
                    "Pending",

                orderStatus:
                    "Pending",

                subtotal,

                discount:
                    totalDiscount,

                shippingPrice,

                totalPrice
            });


        // ========================================
        // DECREASE PRODUCT STOCK
        // ========================================

        for (
            const item of verifiedOrderItems
        ) {

            await Product.findByIdAndUpdate(

                item.product,

                {
                    $inc: {
                        stock:
                            -item.quantity
                    }
                }
            );
        }


        // ========================================
        // CLEAR CART
        // ========================================

        await Cart.findOneAndUpdate(

            {
                user:
                    req.user._id
            },

            {
                items: []
            }
        );


        res.status(201).json({

            success: true,

            message:
                "Order placed successfully",

            data:
                order
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (
    req,
    res,
    next
) => {

    try {

        const orders =
            await Order.find({

                user:
                    req.user._id

            }).sort({

                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count:
                orders.length,

            data:
                orders
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET ORDER BY ID
// ========================================

const getOrderById = async (
    req,
    res,
    next
) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            ).populate(
                "user",
                "name email"
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }


        // ========================================
        // USER PRIVACY CHECK
        // ========================================

        if (

            order.user._id.toString() !==
            req.user._id.toString()

            &&

            req.user.role !==
            "admin"

        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Not authorized to view this order"
            });
        }


        res.status(200).json({

            success: true,

            data:
                order
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// CANCEL ORDER
// ========================================

const cancelOrder = async (
    req,
    res,
    next
) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }


        // ========================================
        // AUTHORIZATION
        // ========================================

        if (

            order.user.toString() !==
            req.user._id.toString()

            &&

            req.user.role !==
            "admin"

        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Not authorized to cancel this order"
            });
        }


        // ========================================
        // CANCELLATION CHECK
        // ========================================

        if (

            [
                "Shipped",
                "Delivered",
                "Cancelled"
            ].includes(
                order.orderStatus
            )

        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Order cannot be cancelled because it is already ${order.orderStatus}`
            });
        }


        order.orderStatus =
            "Cancelled";


        await order.save();


        // ========================================
        // RESTOCK PRODUCTS
        // ========================================

        for (
            const item of order.orderItems
        ) {

            await Product.findByIdAndUpdate(

                item.product,

                {
                    $inc: {
                        stock:
                            item.quantity
                    }
                }
            );
        }


        res.status(200).json({

            success: true,

            message:
                "Order cancelled successfully",

            data:
                order
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET ALL ORDERS - ADMIN
// ========================================

const getAllOrders = async (
    req,
    res,
    next
) => {

    try {

        const orders =
            await Order.find({})

                .populate(
                    "user",
                    "name email"
                )

                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            success: true,

            count:
                orders.length,

            data:
                orders
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// UPDATE ORDER STATUS - ADMIN
// ========================================

const updateOrderStatus = async (
    req,
    res,
    next
) => {

    try {

        const {
            orderStatus,
            paymentStatus
        } = req.body;


        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }


        if (orderStatus) {

            order.orderStatus =
                orderStatus;


            if (
                orderStatus ===
                "Delivered"
            ) {

                order.paymentStatus =
                    "Paid";
            }
        }


        if (paymentStatus) {

            order.paymentStatus =
                paymentStatus;
        }


        await order.save();


        res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            data:
                order
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    cancelOrder,

    getAllOrders,

    updateOrderStatus
};