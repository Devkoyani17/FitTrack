const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        age: {
            type: Number,
            default: 25
        },

        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Other",
                "Prefer not to say"
            ],
            default: "Male"
        },

        height: {
            type: Number,
            default: 175
        },

        weight: {
            type: Number,
            default: 70
        },

        fitnessGoal: {
            type: String,
            enum: [
                "Weight Loss",
                "Muscle Gain",
                "Maintenance",
                "Endurance",
                "General Fitness"
            ],
            default: "General Fitness"
        },

        activityLevel: {
            type: String,
            enum: [
                "Sedentary",
                "Lightly Active",
                "Moderately Active",
                "Very Active",
                "Super Active"
            ],
            default: "Moderately Active"
        },

        profileImage: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);


// ========================================
// HASH PASSWORD BEFORE SAVE
// ========================================

userSchema.pre("save", async function () {

    // If password was not changed,
    // do not hash it again.
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});


// ========================================
// CHECK PASSWORD
// ========================================

userSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};


module.exports = mongoose.model("User", userSchema);