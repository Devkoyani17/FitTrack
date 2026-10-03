const express = require("express");

const {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise
} = require("../controllers/exerciseController");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const router = express.Router();


// Public routes
router.get("/", getExercises);
router.get("/:id", getExerciseById);


// Admin routes
router.post("/", protect, admin, createExercise);
router.put("/:id", protect, admin, updateExercise);
router.delete("/:id", protect, admin, deleteExercise);


module.exports = router;