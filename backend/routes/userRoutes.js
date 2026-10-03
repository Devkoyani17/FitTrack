const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    addProductReview,
    getProductReviews
} = require("../controllers/reviewController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PRODUCTS
// ========================================

router.get(
    "/",
    getProducts
);


// ========================================
// SINGLE PRODUCT
// ========================================

router.get(
    "/:id",
    getProductById
);


// ========================================
// CREATE PRODUCT
// ========================================

router.post(
    "/",
    protect,
    createProduct
);


// ========================================
// UPDATE PRODUCT
// ========================================

router.put(
    "/:id",
    protect,
    updateProduct
);


// ========================================
// DELETE PRODUCT
// ========================================

router.delete(
    "/:id",
    protect,
    deleteProduct
);


// ========================================
// GET PRODUCT REVIEWS
// ========================================

router.get(
    "/:id/reviews",
    getProductReviews
);


// ========================================
// ADD PRODUCT REVIEW
// ========================================

router.post(
    "/:id/reviews",
    protect,
    addProductReview
);


module.exports = router;