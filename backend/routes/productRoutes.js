const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

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
// CREATE
// ========================================

router.post(
    "/",
    protect,
    createProduct
);


// ========================================
// UPDATE
// ========================================

router.put(
    "/:id",
    protect,
    updateProduct
);


// ========================================
// DELETE
// ========================================

router.delete(
    "/:id",
    protect,
    deleteProduct
);


module.exports = router;