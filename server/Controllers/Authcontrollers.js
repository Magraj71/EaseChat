import bcrypt from "bcrypt";
import User from "../models/UserModels.js"; // Ensure correct path
import pkg from "jsonwebtoken";
import { renameSync, existsSync, mkdirSync } from "fs";

const { sign } = pkg; // Destructure 'sign' from 'pkg'

// Define JWT expiration time (3 days)
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create a JWT token
const createToken = (email, userId) => {
    return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// 🟢 **SignUp Controller**
export const SignUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Create a new user
        const user = await User.create({ email, password });

        // Create JWT Token
        const token = createToken(email, user._id);
        console.log(token)
        res.cookie("jwt", token, {
          
            secure: process.env.NODE_ENV === "production", // Set to false for local testing
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "Lax" for local, "None" for cross-origin
            maxAge: 3 * 24 * 60 * 60 * 10000, // 1 hour
        });
        
        
        return res.status(201).json({
            message: "User created successfully!",
            user: { email: user.email, userId: user._id },
            token, 
        });

    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};

// 🟢 **Login Controller**
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        if (!user.password) {
            return res.status(500).json({ error: "User password is missing in the database." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        return res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// 🟢 **Get User Info**
export const getUserInfo = async (req, res, next) => {
    try {
        console.log("🔍 Fetching user info for:", req.userId);

        const userData = await User.findById(req.userId);
        if (!userData) {
            console.warn("⚠️ User not found in database:", req.userId);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", userData);

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });

    } catch (error) {
        console.error("❌ Error fetching user info:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


// 🟢 **Update Profile**
export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req; // Extract user ID from middleware
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: "First Name and Last Name are required." });
        }

        // Update user profile
        const userData = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, color, profileSetup: true }, // ✅ Ensure profileSetup is updated
            { new: true, runValidators: true }
            
        );
        console.log(userData)

        if (!userData) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log("Updated Profile:", userData);

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup, // ✅ Ensure frontend gets updated value
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// 🟢 **Add Profile Image**
export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File is required." });
        }

        const date = Date.now();
        const uploadDir = "uploads/profiles/";

        // Ensure the directory exists
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${uploadDir}${date}_${req.file.originalname}`;
        renameSync(req.file.path, filename); // ✅ Safely rename file

        // Update user profile with image
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: filename },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log("Profile Image Updated:", updatedUser);

        return res.status(200).json({
            id: updatedUser._id,
            email: updatedUser.email,
            profileSetup: updatedUser.profileSetup,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            image: updatedUser.image,
            color: updatedUser.color,
        });

    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const logOut = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 1,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "None",  // Necessary for cross-origin requests
            httpOnly: true,    // Protects against XSS attacks
            path: "/"          // Ensures cookie is cleared across the entire app
        });

        res.status(200).send("Logout successful");

    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal server error during logout." });
    }
};
