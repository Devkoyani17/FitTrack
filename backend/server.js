const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const mealRoutes = require("./routes/mealRoutes");
const waterRoutes = require("./routes/waterRoutes");
const weightRoutes = require("./routes/weightRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");


const app = express();


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin: "*"
    })
);

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "FitTrack Backend is Working",

        tagline:
            "Track. Train. Transform. Shop.",

        version:
            "1.0.0"
    });
});


// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        message:
            "FitTrack API is healthy",

        timestamp:
            new Date().toISOString()
    });
});


// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/workouts",
    workoutRoutes
);

app.use(
    "/api/meals",
    mealRoutes
);

app.use(
    "/api/water",
    waterRoutes
);

app.use(
    "/api/weight",
    weightRoutes
);


// ========================================
// ERROR HANDLING
// ========================================

app.use(notFound);

app.use(errorHandler);


// ========================================
// SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `FitTrack Server running on port ${PORT}`
    );
});