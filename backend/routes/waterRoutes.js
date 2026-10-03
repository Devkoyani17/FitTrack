const express = require("express");

const {
    getWater,
    addWater,
    deleteWater
} = require("../controllers/waterController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Get today's water
router.get(
    "/",
    protect,
    getWater
);


// Add water
router.post(
    "/",
    protect,
    addWater
);


// Delete water record
router.delete(
    "/:id",
    protect,
    deleteWater
);


module.exports = router;