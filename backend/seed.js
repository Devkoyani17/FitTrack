const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

// Models
const User = require("./models/User");
const Exercise = require("./models/Exercise");
const Product = require("./models/Product");
const Workout = require("./models/Workout");
const Meal = require("./models/Meal");
const Water = require("./models/Water");
const Weight = require("./models/Weight");
const Goal = require("./models/Goal");

// ============================================================
// HELPER FUNCTION
// ============================================================

const createIfNotExists = async (Model, query, data) => {
    const existing = await Model.findOne(query);

    if (existing) {
        return existing;
    }

    return await Model.create(data);
};

// ============================================================
// SEED DATABASE
// ============================================================

const seedData = async () => {
    try {
        // ========================================================
        // CONNECT DATABASE
        // ========================================================

        await connectDB();

        console.log("MongoDB Connected for Seeding...");

        // ========================================================
        // USERS
        // ========================================================

        const admin = await createIfNotExists(
            User,
            {
                email: "admin@fittrack.com"
            },
            {
                name: "FitTrack Admin",
                email: "admin@fittrack.com",
                password: "adminpassword123",
                age: 25,
                gender: "Male",
                height: 175,
                weight: 70,
                fitnessGoal: "Muscle Gain",
                activityLevel: "Very Active",
                role: "admin"
            }
        );

        const alex = await createIfNotExists(
            User,
            {
                email: "alex@example.com"
            },
            {
                name: "Alex",
                email: "alex@example.com",
                password: "password123",
                age: 22,
                gender: "Male",
                height: 175,
                weight: 70,
                fitnessGoal: "Muscle Gain",
                activityLevel: "Moderately Active",
                role: "user"
            }
        );

        const sarah = await createIfNotExists(
            User,
            {
                email: "sarah@example.com"
            },
            {
                name: "Sarah",
                email: "sarah@example.com",
                password: "password123",
                age: 21,
                gender: "Female",
                height: 165,
                weight: 58,
                fitnessGoal: "Weight Loss",
                activityLevel: "Moderately Active",
                role: "user"
            }
        );

        console.log("Users ready: Admin, Alex, Sarah.");

        // ========================================================
        // EXERCISES
        // ========================================================

        const exercises = [
            {
                name: "Push Ups",
                description:
                    "A classic bodyweight exercise that targets the chest, shoulders and triceps.",
                category: "Strength",
                muscleGroup: "Chest",
                equipment: "None",
                difficulty: "Beginner",
                caloriesBurned: 8,
                image: ""
            },

            {
                name: "Squats",
                description:
                    "A lower body exercise that targets the quadriceps, hamstrings and glutes.",
                category: "Strength",
                muscleGroup: "Legs",
                equipment: "None",
                difficulty: "Beginner",
                caloriesBurned: 10,
                image: ""
            },

            {
                name: "Lunges",
                description:
                    "A lower body exercise that improves leg strength and balance.",
                category: "Strength",
                muscleGroup: "Legs",
                equipment: "None",
                difficulty: "Beginner",
                caloriesBurned: 9,
                image: ""
            },

            {
                name: "Pull Ups",
                description:
                    "An upper body exercise that mainly targets the back and biceps.",
                category: "Strength",
                muscleGroup: "Back",
                equipment: "Pull-up Bar",
                difficulty: "Intermediate",
                caloriesBurned: 12,
                image: ""
            },

            {
                name: "Bicep Curls",
                description:
                    "An isolation exercise designed to strengthen the biceps.",
                category: "Strength",
                muscleGroup: "Biceps",
                equipment: "Dumbbells",
                difficulty: "Beginner",
                caloriesBurned: 7,
                image: ""
            },

            {
                name: "Shoulder Press",
                description:
                    "An exercise that develops the shoulder and upper body muscles.",
                category: "Strength",
                muscleGroup: "Shoulders",
                equipment: "Dumbbells",
                difficulty: "Intermediate",
                caloriesBurned: 8,
                image: ""
            },

            {
                name: "Plank",
                description:
                    "An isometric exercise that improves core stability and strength.",
                category: "Strength",
                muscleGroup: "Abs",
                equipment: "None",
                difficulty: "Beginner",
                caloriesBurned: 6,
                image: ""
            },

            {
                name: "Yoga Stretch",
                description:
                    "A gentle stretching exercise that improves flexibility and mobility.",
                category: "Flexibility",
                muscleGroup: "Abs",
                equipment: "None",
                difficulty: "Beginner",
                caloriesBurned: 5,
                image: ""
            }
        ];

        for (const exercise of exercises) {
            await createIfNotExists(
                Exercise,
                {
                    name: exercise.name
                },
                exercise
            );
        }

        console.log(
            `Inserted/verified ${exercises.length} sample exercises.`
        );

        // ========================================================
        // PRODUCTS
        // ========================================================

        const products = [
            {
                name: "Whey Protein 1kg",
                description:
                    "High quality whey protein for muscle recovery and muscle growth.",
                category: "Protein",
                price: 2499,
                originalPrice: 2999,
                stock: 50,
                image: "https://example.com/whey.jpg",
                brand: "FitTrack Nutrition",
                rating: 4.5,
                numReviews: 12,
                isActive: true
            },

            {
                name: "Whey Protein 2kg",
                description:
                    "Premium whey protein supplement for regular gym users.",
                category: "Protein",
                price: 4499,
                originalPrice: 4999,
                stock: 30,
                image: "https://example.com/whey2.jpg",
                brand: "FitTrack Nutrition",
                rating: 4.7,
                numReviews: 18,
                isActive: true
            },

            {
                name: "Creatine Monohydrate",
                description:
                    "Pure creatine monohydrate supplement for strength and workout performance.",
                category: "Supplements",
                price: 999,
                originalPrice: 1299,
                stock: 80,
                image: "https://example.com/creatine.jpg",
                brand: "FitTrack Nutrition",
                rating: 4.6,
                numReviews: 20,
                isActive: true
            },

            {
                name: "Multivitamin Tablets",
                description:
                    "Daily multivitamin supplement containing essential vitamins.",
                category: "Vitamins",
                price: 599,
                originalPrice: 799,
                stock: 100,
                image: "https://example.com/multivitamin.jpg",
                brand: "FitTrack Nutrition",
                rating: 4.3,
                numReviews: 10,
                isActive: true
            },

            {
                name: "Resistance Bands",
                description:
                    "Set of resistance bands suitable for home workouts and strength training.",
                category: "Fitness Equipment",
                price: 799,
                originalPrice: 999,
                stock: 40,
                image: "https://example.com/bands.jpg",
                brand: "FitTrack Gear",
                rating: 4.4,
                numReviews: 15,
                isActive: true
            },

            {
                name: "Yoga Mat",
                description:
                    "Non-slip exercise and yoga mat for home and gym workouts.",
                category: "Fitness Equipment",
                price: 899,
                originalPrice: 1199,
                stock: 60,
                image: "https://example.com/yogamat.jpg",
                brand: "FitTrack Gear",
                rating: 4.5,
                numReviews: 14,
                isActive: true
            },

            {
                name: "Gym Gloves",
                description:
                    "Comfortable training gloves with improved grip.",
                category: "Accessories",
                price: 499,
                originalPrice: 699,
                stock: 70,
                image: "https://example.com/gloves.jpg",
                brand: "FitTrack Gear",
                rating: 4.2,
                numReviews: 8,
                isActive: true
            },

            {
                name: "Shaker Bottle",
                description:
                    "Leak-proof protein shaker bottle with mixing ball.",
                category: "Accessories",
                price: 399,
                originalPrice: 499,
                stock: 100,
                image: "https://example.com/shaker.jpg",
                brand: "FitTrack Gear",
                rating: 4.4,
                numReviews: 11,
                isActive: true
            },

            {
                name: "Adjustable Dumbbells",
                description:
                    "Adjustable dumbbells suitable for strength training at home.",
                category: "Fitness Equipment",
                price: 3499,
                originalPrice: 3999,
                stock: 20,
                image: "https://example.com/dumbbells.jpg",
                brand: "FitTrack Gear",
                rating: 4.8,
                numReviews: 9,
                isActive: true
            }
        ];

        for (const product of products) {
            await createIfNotExists(
                Product,
                {
                    name: product.name
                },
                product
            );
        }

        console.log(
            `Inserted/verified ${products.length} sample products.`
        );

      // ========================================================
// WORKOUTS
// ========================================================

await createIfNotExists(
    Workout,
    {
        user: alex._id,
        exerciseName: "Push Ups"
    },
    {
        user: alex._id,
        exerciseName: "Push Ups",
        sets: 3,
        reps: 15,
        duration: 10,
        caloriesBurned: 80,
        date: new Date()
    }
);

await createIfNotExists(
    Workout,
    {
        user: alex._id,
        exerciseName: "Squats"
    },
    {
        user: alex._id,
        exerciseName: "Squats",
        sets: 3,
        reps: 12,
        duration: 15,
        caloriesBurned: 100,
        date: new Date()
    }
);

await createIfNotExists(
    Workout,
    {
        user: alex._id,
        exerciseName: "Lunges"
    },
    {
        user: alex._id,
        exerciseName: "Lunges",
        sets: 3,
        reps: 10,
        duration: 10,
        caloriesBurned: 90,
        date: new Date()
    }
);

console.log("Workout data ready.");

        // ========================================================
        // MEALS
        // ========================================================

        await createIfNotExists(
            Meal,
            {
                user: alex._id,
                name: "Oats and Banana"
            },
            {
                user: alex._id,
                name: "Oats and Banana",
                mealType: "Breakfast",
                calories: 350,
                protein: 12,
                carbs: 55,
                fats: 8,
                date: new Date()
            }
        );

        await createIfNotExists(
            Meal,
            {
                user: alex._id,
                name: "Chicken Rice"
            },
            {
                user: alex._id,
                name: "Chicken Rice",
                mealType: "Lunch",
                calories: 650,
                protein: 45,
                carbs: 70,
                fats: 18,
                date: new Date()
            }
        );

        await createIfNotExists(
            Meal,
            {
                user: alex._id,
                name: "Protein Shake"
            },
            {
                user: alex._id,
                name: "Protein Shake",
                mealType: "Snack",
                calories: 250,
                protein: 30,
                carbs: 15,
                fats: 5,
                date: new Date()
            }
        );

        console.log("Meal data ready.");

        // ========================================================
        // WATER
        // ========================================================

        await createIfNotExists(
            Water,
            {
                user: alex._id,
                amount: 1000
            },
            {
                user: alex._id,
                amount: 1000,
                date: new Date()
            }
        );

        await createIfNotExists(
            Water,
            {
                user: alex._id,
                amount: 750
            },
            {
                user: alex._id,
                amount: 750,
                date: new Date()
            }
        );

        await createIfNotExists(
            Water,
            {
                user: alex._id,
                amount: 500
            },
            {
                user: alex._id,
                amount: 500,
                date: new Date()
            }
        );

        console.log("Water data ready.");

        // ========================================================
        // WEIGHT
        // ========================================================

        await createIfNotExists(
            Weight,
            {
                user: alex._id,
                weight: 72
            },
            {
                user: alex._id,
                weight: 72,
                date: new Date(
                    Date.now() -
                    1000 * 60 * 60 * 24 * 14
                )
            }
        );

        await createIfNotExists(
            Weight,
            {
                user: alex._id,
                weight: 71
            },
            {
                user: alex._id,
                weight: 71,
                date: new Date(
                    Date.now() -
                    1000 * 60 * 60 * 24 * 7
                )
            }
        );

        await createIfNotExists(
            Weight,
            {
                user: alex._id,
                weight: 70
            },
            {
                user: alex._id,
                weight: 70,
                date: new Date()
            }
        );

        console.log("Weight data ready.");

        // ========================================================
        // GOALS
        // ========================================================

        await createIfNotExists(
            Goal,
            {
                user: alex._id,
                title: "Reach 65kg"
            },
            {
                user: alex._id,
                title: "Reach 65kg",
                description:
                    "Reduce body weight gradually and reach the target weight.",
                targetValue: 65,
                currentValue: 70,
                unit: "kg",
                deadline: new Date(
                    Date.now() +
                    1000 * 60 * 60 * 24 * 90
                ),
                status: "active"
            }
        );

        await createIfNotExists(
            Goal,
            {
                user: alex._id,
                title: "Drink 3 Liters Water"
            },
            {
                user: alex._id,
                title: "Drink 3 Liters Water",
                description:
                    "Maintain a daily water intake of 3 liters.",
                targetValue: 3000,
                currentValue: 2250,
                unit: "ml",
                deadline: new Date(
                    Date.now() +
                    1000 * 60 * 60 * 24 * 30
                ),
                status: "active"
            }
        );

        console.log("Goal data ready.");

        // ========================================================
        // SUCCESS
        // ========================================================

        console.log("");
        console.log("==========================================");
        console.log(" FitTrack Seed Completed Successfully!");
        console.log("==========================================");
        console.log("");

        console.log("ADMIN LOGIN");
        console.log("------------------------------------------");
        console.log("Email    : admin@fittrack.com");
        console.log("Password : adminpassword123");
        console.log("");

        console.log("ALEX USER LOGIN");
        console.log("------------------------------------------");
        console.log("Email    : alex@example.com");
        console.log("Password : password123");
        console.log("");

        console.log("SARAH USER LOGIN");
        console.log("------------------------------------------");
        console.log("Email    : sarah@example.com");
        console.log("Password : password123");
        console.log("");

        console.log("Demo data is ready for testing.");
        console.log("");

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {

        console.error("");
        console.error("==========================================");
        console.error(" SEEDING ERROR");
        console.error("==========================================");
        console.error(error.message);
        console.error("");

        await mongoose.connection.close();

        process.exit(1);
    }
};

// ============================================================
// RUN SEED
// ============================================================

seedData();