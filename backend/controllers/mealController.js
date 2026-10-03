const Meal = require("../models/Meal");

// Get all meals of logged-in user
const getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({
            user: req.user._id
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: meals.length,
            meals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get single meal
const getMealById = async (req, res) => {
    try {
        const meal = await Meal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        res.status(200).json({
            success: true,
            meal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Create meal
const createMeal = async (req, res) => {
    try {
        const {
            name,
            mealType,
            calories,
            protein,
            carbs,
            fats,
            date
        } = req.body;

        if (!name || !mealType || calories === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, meal type and calories are required"
            });
        }

        const meal = await Meal.create({
            user: req.user._id,
            name,
            mealType,
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fats: fats || 0,
            date: date || new Date()
        });

        res.status(201).json({
            success: true,
            message: "Meal created successfully",
            meal
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Update meal
const updateMeal = async (req, res) => {
    try {
        const meal = await Meal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        const {
            name,
            mealType,
            calories,
            protein,
            carbs,
            fats,
            date
        } = req.body;

        if (name !== undefined) meal.name = name;
        if (mealType !== undefined) meal.mealType = mealType;
        if (calories !== undefined) meal.calories = calories;
        if (protein !== undefined) meal.protein = protein;
        if (carbs !== undefined) meal.carbs = carbs;
        if (fats !== undefined) meal.fats = fats;
        if (date !== undefined) meal.date = date;

        const updatedMeal = await meal.save();

        res.status(200).json({
            success: true,
            message: "Meal updated successfully",
            meal: updatedMeal
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Delete meal
const deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meal deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal
};