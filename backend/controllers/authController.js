import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";


export const registerUser = async (req, res) => {
  try {
    // Get validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    // Extract data from request body
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Send success response with JWT
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Early validation (prevents DB hit)
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required"
      });
    }

    // Indexed query
    const user = await User.findOne({
      email: email.toLowerCase(),
      role
    }).select("_id name email role password status");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email, password, or role"
      });
    }

    // Blocked user check
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "User is blocked by admin"
      });
    }

    // Password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email, password, or role"
      });
    }

    // Token response
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during login",
      error: error.message
    });
  }
};