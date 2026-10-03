const express = require("express");

const {
    getWeights,
    addWeight,
    deleteWeight
} = require("../controllers/weightController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Get weight history
router.get(
    "/",
    protect,
    getWeights
);


// Add weight
router.post(
    "/",
    protect,
    addWeight
);


// Delete weight
router.delete(
    "/:id",
    protect,
    deleteWeight
);


module.exports = router;