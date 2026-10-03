const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE ORDER
// ========================================

router.post(
    "/",
    protect,
    createOrder
);


// ========================================
// ADMIN - GET ALL ORDERS
// ========================================

router.get(
    "/",
    protect,
    admin,
    getAllOrders
);


// ========================================
// MY ORDERS
// ========================================

router.get(
    "/myorders",
    protect,
    getMyOrders
);


// ========================================
// ORDER DETAILS
// ========================================

router.get(
    "/:id",
    protect,
    getOrderById
);


// ========================================
// CANCEL ORDER
// ========================================

router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);


// ========================================
// ADMIN - UPDATE STATUS
// ========================================

router.put(
    "/:id/status",
    protect,
    admin,
    updateOrderStatus
);


module.exports = router;