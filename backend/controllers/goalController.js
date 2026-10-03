const Goal = require("../models/Goal");


// ========================================
// GET ALL USER GOALS
// ========================================

const getGoals = async (req, res, next) => {

    try {

        const { status } = req.query;

        let query = {
            user: req.user._id
        };

        if (status) {
            query.status = status;
        }

        const goals = await Goal.find(query)
            .sort({
                deadline: 1
            });


        // ========================================
        // SUMMARY
        // ========================================

        const summary = {

            total:
                goals.length,

            active:
                goals.filter(
                    goal => goal.status === "active"
                ).length,

            completed:
                goals.filter(
                    goal => goal.status === "completed"
                ).length,

            cancelled:
                goals.filter(
                    goal => goal.status === "cancelled"
                ).length
        };


        res.status(200).json({

            success: true,

            summary,

            data: goals
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET SINGLE GOAL
// ========================================

const getGoalById = async (req, res, next) => {

    try {

        const goal =
            await Goal.findById(
                req.params.id
            );


        if (!goal) {

            return res.status(404).json({

                success: false,

                message:
                    "Goal not found"
            });
        }


        // ========================================
        // USER OWNERSHIP CHECK
        // ========================================

        if (
            goal.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Not authorized to view this goal"
            });
        }


        res.status(200).json({

            success: true,

            data: goal
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// CREATE GOAL
// ========================================

const createGoal = async (req, res, next) => {

    try {

        const {
            title,
            description,
            targetValue,
            currentValue,
            unit,
            deadline,
            status
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !title ||
            targetValue === undefined ||
            !deadline
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Title, target value, and deadline date are required"
            });
        }


        // ========================================
        // CREATE GOAL
        // ========================================

        const goal =
            await Goal.create({

                user:
                    req.user._id,

                title,

                description:
                    description || "",

                targetValue,

                currentValue:
                    currentValue || 0,

                unit:
                    unit || "kg",

                deadline,

                status:
                    status || "active"
            });


        res.status(201).json({

            success: true,

            message:
                "Fitness goal created successfully",

            data: goal
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// UPDATE GOAL
// ========================================

const updateGoal = async (req, res, next) => {

    try {

        let goal =
            await Goal.findById(
                req.params.id
            );


        if (!goal) {

            return res.status(404).json({

                success: false,

                message:
                    "Goal not found"
            });
        }


        // ========================================
        // USER OWNERSHIP CHECK
        // ========================================

        if (
            goal.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Not authorized to update this goal"
            });
        }


        // ========================================
        // AUTO COMPLETE GOAL
        // ========================================

        if (
            req.body.currentValue !== undefined &&
            req.body.currentValue >=
            (
                req.body.targetValue ||
                goal.targetValue
            )
        ) {

            req.body.status =
                "completed";
        }


        goal =
            await Goal.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        res.status(200).json({

            success: true,

            message:
                "Goal updated successfully",

            data: goal
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// DELETE GOAL
// ========================================

const deleteGoal = async (req, res, next) => {

    try {

        const goal =
            await Goal.findById(
                req.params.id
            );


        if (!goal) {

            return res.status(404).json({

                success: false,

                message:
                    "Goal not found"
            });
        }


        // ========================================
        // USER OWNERSHIP CHECK
        // ========================================

        if (
            goal.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Not authorized to delete this goal"
            });
        }


        await goal.deleteOne();


        res.status(200).json({

            success: true,

            message:
                "Goal deleted successfully"
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    getGoals,

    getGoalById,

    createGoal,

    updateGoal,

    deleteGoal
};