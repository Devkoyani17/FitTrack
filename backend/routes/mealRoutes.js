const express = require("express");

const {
    getMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal
} = require("../controllers/mealController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMeals);

router.get("/:id", protect, getMealById);

router.post("/", protect, createMeal);

router.put("/:id", protect, updateMeal);

router.delete("/:id", protect, deleteMeal);

module.exports = router;