const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Water = require("../models/Water");
const Weight = require("../models/Weight");
const Goal = require("../models/Goal");
const User = require("../models/User");


// ========================================
// GET DASHBOARD SUMMARY
// ========================================

const getDashboardSummary = async (req, res, next) => {

    try {

        const userId = req.user._id;


        // ========================================
        // USER
        // ========================================

        const user =
            await User.findById(userId)
                .select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"
            });
        }


        // ========================================
        // DATE CALCULATIONS
        // ========================================

        const now = new Date();


        const startOfToday =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0,
                0,
                0
            );


        const endOfToday =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
            );


        const startOfWeek =
            new Date(now);


        startOfWeek.setDate(
            now.getDate() - now.getDay()
        );


        startOfWeek.setHours(
            0,
            0,
            0,
            0
        );


        // ========================================
        // TODAY'S WORKOUTS
        // ========================================

        const todayWorkouts =
            await Workout.find({

                user: userId,

                date: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }

            }).populate(
                "exercise",
                "name category"
            );


        const caloriesBurnedToday =
            todayWorkouts.reduce(
                (total, workout) =>
                    total +
                    (workout.caloriesBurned || 0),
                0
            );


        const workoutDurationToday =
            todayWorkouts.reduce(
                (total, workout) =>
                    total +
                    (workout.duration || 0),
                0
            );


        // ========================================
        // WORKOUT COUNTS
        // ========================================

        const thisWeekWorkoutsCount =
            await Workout.countDocuments({

                user: userId,

                date: {
                    $gte: startOfWeek
                }
            });


        const totalWorkoutsCount =
            await Workout.countDocuments({

                user: userId
            });


        // ========================================
        // TODAY'S MEALS
        // ========================================

        const todayMeals =
            await Meal.find({

                user: userId,

                date: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });


        const nutritionSummary =
            todayMeals.reduce(

                (total, meal) => {

                    total.caloriesConsumed +=
                        meal.calories || 0;

                    total.protein +=
                        meal.protein || 0;

                    total.carbs +=
                        meal.carbs || 0;

                    total.fats +=
                        meal.fats || 0;

                    return total;
                },

                {
                    caloriesConsumed: 0,
                    protein: 0,
                    carbs: 0,
                    fats: 0
                }
            );


        // ========================================
        // TODAY'S WATER
        // ========================================

        const todayWaterLogs =
            await Water.find({

                user: userId,

                date: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });


        const waterConsumedToday =
            todayWaterLogs.reduce(

                (total, water) =>
                    total +
                    (water.amount || 0),

                0
            );


        const waterTarget = 3000;


        const waterPercentage =
            Math.min(

                Math.round(
                    (
                        waterConsumedToday /
                        waterTarget
                    ) * 100
                ),

                100
            );


        // ========================================
        // WEIGHT SUMMARY
        // ========================================

        const weightLogs =
            await Weight.find({

                user: userId

            }).sort({

                date: -1

            });


        const currentWeight =
            weightLogs.length > 0
                ? weightLogs[0].weight
                : user.weight || 70;


        const startingWeight =
            weightLogs.length > 0
                ? weightLogs[
                    weightLogs.length - 1
                ].weight
                : currentWeight;


        const goalWeight = 65;


        const weightChange =
            parseFloat(
                (
                    currentWeight -
                    startingWeight
                ).toFixed(2)
            );


        // ========================================
        // GOALS
        // ========================================

        const goals =
            await Goal.find({

                user: userId

            }).sort({

                deadline: 1

            });


        const activeGoals =
            goals.filter(
                goal =>
                    goal.status === "active"
            );


        const completedGoals =
            goals.filter(
                goal =>
                    goal.status === "completed"
            );


        // ========================================
        // RESPONSE
        // ========================================

        res.status(200).json({

            success: true,

            data: {

                // ========================================
                // USER
                // ========================================

                user: {

                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    fitnessGoal:
                        user.fitnessGoal,

                    activityLevel:
                        user.activityLevel,

                    profileImage:
                        user.profileImage,

                    role:
                        user.role
                },


                // ========================================
                // TODAY
                // ========================================

                today: {

                    caloriesBurned:
                        caloriesBurnedToday,

                    caloriesConsumed:
                        nutritionSummary.caloriesConsumed,

                    workoutDuration:
                        workoutDurationToday,

                    water:
                        waterConsumedToday,

                    waterTarget,

                    waterPercentage
                },


                // ========================================
                // WORKOUTS
                // ========================================

                workouts: {

                    todayCount:
                        todayWorkouts.length,

                    thisWeekCount:
                        thisWeekWorkoutsCount,

                    totalCount:
                        totalWorkoutsCount,

                    durationToday:
                        workoutDurationToday,

                    caloriesBurnedToday
                },


                // ========================================
                // NUTRITION
                // ========================================

                nutrition: {

                    calories:
                        nutritionSummary.caloriesConsumed,

                    protein:
                        nutritionSummary.protein,

                    carbs:
                        nutritionSummary.carbs,

                    fats:
                        nutritionSummary.fats
                },


                // ========================================
                // WEIGHT
                // ========================================

                weight: {

                    current:
                        currentWeight,

                    starting:
                        startingWeight,

                    goal:
                        goalWeight,

                    change:
                        weightChange
                },


                // ========================================
                // GOALS
                // ========================================

                goals: {

                    total:
                        goals.length,

                    activeCount:
                        activeGoals.length,

                    completedCount:
                        completedGoals.length,

                    list:
                        goals
                }
            }
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getDashboardSummary
};