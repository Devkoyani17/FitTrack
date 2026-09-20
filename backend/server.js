const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "FitTrack Backend is Working"
    });
});


// User routes
app.use("/api/users", userRoutes);


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});