import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: { // Changed to camelCase
        type: String,
        required: false,
    },
    lastName: { // Changed to camelCase
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: { // Changed to camelCase
        type: Boolean,
        default: false,
    }
});

// Password hashing middleware before saving
userSchema.pre("save", async function(next) {
    try {
        // Only hash if password is modified or the document is new
        if (this.isModified("password") || this.isNew) {
            const salt = await genSalt();
            this.password = await hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

// Create the User model
const User = mongoose.model("User", userSchema); // Changed collection name to singular

export default User;
