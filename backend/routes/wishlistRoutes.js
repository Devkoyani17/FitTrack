const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ALL WISHLIST ROUTES REQUIRE LOGIN
// ========================================

router.use(protect);


// ========================================
// GET WISHLIST
// ========================================

router.get(
    "/",
    getWishlist
);


// ========================================
// ADD PRODUCT
// ========================================

router.post(
    "/:productId",
    addToWishlist
);


// ========================================
// REMOVE PRODUCT
// ========================================

router.delete(
    "/:productId",
    removeFromWishlist
);


module.exports = router;