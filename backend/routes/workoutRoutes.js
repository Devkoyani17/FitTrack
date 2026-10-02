const express = require("express");

const {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
} = require("../controllers/workoutController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET ALL WORKOUTS
// GET /api/workouts
// ========================================

router.get(
    "/",
    protect,
    getWorkouts
);


// ========================================
// CREATE WORKOUT
// POST /api/workouts
// ========================================

router.post(
    "/",
    protect,
    createWorkout
);


// ========================================
// UPDATE WORKOUT
// PUT /api/workouts/:id
// ========================================

router.put(
    "/:id",
    protect,
    updateWorkout
);


// ========================================
// DELETE WORKOUT
// DELETE /api/workouts/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteWorkout
);


module.exports = router;