const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// ========================================
// REGISTER USER
// POST /api/auth/register
// ========================================

const registerUser = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitnessGoal,
            activityLevel
        } = req.body;


        if (!name || !email || !password) {

            res.status(400);

            throw new Error(
                "Please provide name, email and password"
            );
        }


        const userExists = await User.findOne({
            email
        });


        if (userExists) {

            res.status(400);

            throw new Error(
                "User already exists with this email"
            );
        }


        const user = await User.create({

            name,
            email,
            password,

            age: age || 25,

            gender: gender || "Male",

            height: height || 175,

            weight: weight || 70,

            fitnessGoal:
                fitnessGoal || "General Fitness",

            activityLevel:
                activityLevel || "Moderately Active",

            role: "user"
        });


        res.status(201).json({

            success: true,

            message: "User registered successfully",

            data: {

                _id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                age: user.age,

                gender: user.gender,

                height: user.height,

                weight: user.weight,

                fitnessGoal: user.fitnessGoal,

                activityLevel: user.activityLevel,

                profileImage: user.profileImage,

                token: generateToken(user._id)
            }
        });

    } catch (error) {

        next(error);
    }
};



// ========================================
// LOGIN USER
// POST /api/auth/login
// ========================================

const loginUser = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            res.status(400);

            throw new Error(
                "Please provide email and password"
            );
        }


        const user = await User
            .findOne({ email })
            .select("+password");


        if (
            user &&
            await user.matchPassword(password)
        ) {

            res.json({

                success: true,

                message: "Login successful",

                data: {

                    _id: user._id,

                    name: user.name,

                    email: user.email,

                    role: user.role,

                    age: user.age,

                    gender: user.gender,

                    height: user.height,

                    weight: user.weight,

                    fitnessGoal:
                        user.fitnessGoal,

                    activityLevel:
                        user.activityLevel,

                    profileImage:
                        user.profileImage,

                    token:
                        generateToken(user._id)
                }
            });

        } else {

            res.status(401);

            throw new Error(
                "Invalid email or password"
            );
        }

    } catch (error) {

        next(error);
    }
};



// ========================================
// GET CURRENT USER
// GET /api/auth/me
// ========================================

const getMe = async (req, res, next) => {

    try {

        const user = await User.findById(
            req.user._id
        );


        if (!user) {

            res.status(404);

            throw new Error(
                "User not found"
            );
        }


        res.json({

            success: true,

            data: user
        });

    } catch (error) {

        next(error);
    }
};



module.exports = {
    registerUser,
    loginUser,
    getMe
};