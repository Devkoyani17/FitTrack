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
    protect,
    admin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PUBLIC PRODUCTS
// ========================================

router.get(
    "/",
    getProducts
);


// ========================================
// GET SINGLE PRODUCT
// ========================================

router.get(
    "/:id",
    getProductById
);


// ========================================
// ADMIN - CREATE PRODUCT
// ========================================

router.post(
    "/",
    protect,
    admin,
    createProduct
);


// ========================================
// ADMIN - UPDATE PRODUCT
// ========================================

router.put(
    "/:id",
    protect,
    admin,
    updateProduct
);


// ========================================
// ADMIN - DELETE PRODUCT
// ========================================

router.delete(
    "/:id",
    protect,
    admin,
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