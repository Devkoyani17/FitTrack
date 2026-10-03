const express = require("express");

const {
    getGoals,
    getGoalById,
    createGoal,
    updateGoal,
    deleteGoal
} = require("../controllers/goalController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ALL GOAL ROUTES REQUIRE LOGIN
// ========================================

router.use(protect);


// ========================================
// GOALS
// ========================================

router.route("/")
    .get(getGoals)
    .post(createGoal);


// ========================================
// SINGLE GOAL
// ========================================

router.route("/:id")
    .get(getGoalById)
    .put(updateGoal)
    .delete(deleteGoal);


module.exports = router;