const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Profiler } = require("react");

// GENERATE JWT TOKEN
const generateToken = (userId) => {
    return jwt.sign({ id:userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const regsisterUser = async (req, res) => {};

// @desc Login user
// @route POST /api/auyh/Login
// @access Public
const loginUser = async (req, res) => {};

// @desc GET user profile
// @route GET /api/auth/login
// @access Private (requires JWT)
const getUserProfile = async (req, res) => {};

// @desc Update user profile 
// @route PUT /api/auth/profile
// @access Private (requires JWT)
const updateUserProfile = async (req, res) => {};

module.exports = { regsisterUser, loginUser, getUserProfile, updateUserProfile };