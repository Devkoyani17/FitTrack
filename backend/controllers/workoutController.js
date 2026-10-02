const Workout = require("../models/Workout");

// ===============================
// CREATE WORKOUT
// ===============================
const createWorkout = async (req, res) => {
    try {
        const {
            exerciseName,
            sets,
            reps,
            duration,
            date
        } = req.body;

        if (!exerciseName || !sets || !reps || !duration || !date) {
            return res.status(400).json({
                message: "All workout fields are required"
            });
        }

        const workout = await Workout.create({
            user: req.user._id,
            exerciseName,
            sets,
            reps,
            duration,
            date
        });

        res.status(201).json({
            message: "Workout created successfully",
            workout
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// GET ALL WORKOUTS OF LOGGED-IN USER
// ===============================
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({
            user: req.user._id
        }).sort({ date: -1 });

        res.json({
            message: "Workouts fetched successfully",
            count: workouts.length,
            workouts
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// GET SINGLE WORKOUT
// ===============================
const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        res.json({
            message: "Workout fetched successfully",
            workout
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// UPDATE WORKOUT
// ===============================
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        const {
            exerciseName,
            sets,
            reps,
            duration,
            date
        } = req.body;

        workout.exerciseName = exerciseName || workout.exerciseName;
        workout.sets = sets || workout.sets;
        workout.reps = reps || workout.reps;
        workout.duration = duration || workout.duration;
        workout.date = date || workout.date;

        const updatedWorkout = await workout.save();

        res.json({
            message: "Workout updated successfully",
            workout: updatedWorkout
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// DELETE WORKOUT
// ===============================
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        await workout.deleteOne();

        res.json({
            message: "Workout deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
};