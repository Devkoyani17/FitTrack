const Water = require("../models/Water");

// ========================================
// GET TODAY'S WATER
// ========================================

const getWater = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const records = await Water.find({
            user: req.user._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({
            date: -1
        });

        const total = records.reduce(
            (sum, record) => sum + record.amount,
            0
        );

        const goal = 3000;

        const percentage = Math.min(
            Math.round((total / goal) * 100),
            100
        );

        res.status(200).json({
            success: true,
            total,
            goal,
            percentage,
            records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// ADD WATER
// ========================================

const addWater = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid water amount is required"
            });
        }

        const water = await Water.create({
            user: req.user._id,
            amount
        });

        res.status(201).json({
            success: true,
            message: "Water intake added successfully",
            water
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// DELETE WATER RECORD
// ========================================

const deleteWater = async (req, res) => {
    try {
        const water = await Water.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!water) {
            return res.status(404).json({
                success: false,
                message: "Water record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Water record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getWater,
    addWater,
    deleteWater
};