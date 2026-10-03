const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ALL CART ROUTES REQUIRE LOGIN
// ========================================

router.use(protect);


// ========================================
// GET CART
// ========================================

router.get(
    "/",
    getCart
);


// ========================================
// ADD TO CART
// ========================================

router.post(
    "/",
    addToCart
);


// ========================================
// UPDATE CART ITEM
// ========================================

router.put(
    "/:itemId",
    updateCartItem
);


// ========================================
// REMOVE CART ITEM
// ========================================

router.delete(
    "/:itemId",
    removeFromCart
);


// ========================================
// CLEAR CART
// ========================================

router.delete(
    "/",
    clearCart
);


module.exports = router;