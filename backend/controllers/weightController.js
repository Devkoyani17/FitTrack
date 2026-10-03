const Weight = require("../models/Weight");


// ========================================
// GET WEIGHT HISTORY
// ========================================

const getWeights = async (req, res) => {
    try {
        const weights = await Weight.find({
            user: req.user._id
        }).sort({
            date: -1
        });

        const currentWeight =
            weights.length > 0
                ? weights[0].weight
                : null;

        const startingWeight =
            weights.length > 0
                ? weights[weights.length - 1].weight
                : null;

        let change = 0;

        if (
            currentWeight !== null &&
            startingWeight !== null
        ) {
            change =
                currentWeight - startingWeight;
        }

        res.status(200).json({
            success: true,
            currentWeight,
            startingWeight,
            change,
            count: weights.length,
            weights
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// ADD WEIGHT
// ========================================

const addWeight = async (req, res) => {
    try {
        const { weight, date } = req.body;

        if (!weight || weight <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid weight is required"
            });
        }

        const weightRecord =
            await Weight.create({
                user: req.user._id,
                weight,
                date: date || new Date()
            });

        res.status(201).json({
            success: true,
            message: "Weight recorded successfully",
            weight: weightRecord
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// DELETE WEIGHT
// ========================================

const deleteWeight = async (req, res) => {
    try {
        const weight =
            await Weight.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

        if (!weight) {
            return res.status(404).json({
                success: false,
                message: "Weight record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Weight record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getWeights,
    addWeight,
    deleteWeight
};