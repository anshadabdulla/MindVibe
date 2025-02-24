const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import User model

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://mindvibelearning:admin@cluster0.gvfy5.mongodb.net/crud?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log(`Connected to MongoDB at ${MONGO_URI}`);
});

// Routes

// start with login page 
router.get("/", (req, res) => {
  res.render("index", { error: null }); // start with login page
});

// Login page
router.get("/index", (req, res) => {
  res.render("index", { error: null }); // Render login page
});

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup"); // Render signup page
});

// Home page
router.get("/home", (req, res) => {
  res.render("home"); // Render home page
});

// Success page
router.get("/success1", (req, res) => {
  const { firstName } = req.query; // Get user's first name from query parameters
  res.render("success1", { firstName }); // Render success page with first name
});

// Courses page
router.get("/courses1", (req, res) => {
  const { firstName } = req.query; // Get user's first name from query parameters
  res.render("courses", { firstName }); // Render success page with first name
});

// Error page
router.get("/error", (req, res) => {
  const { message } = req.query;
  res.render("error", { message }); // Render error page with a message
});

// POST: Handle signup
router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.redirect(`/error?message=${encodeURIComponent("Passwords do not match!")}`);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(`/error?message=${encodeURIComponent("User already exists!")}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User registered successfully");

    // Redirect to the success page with the user's first name
    res.redirect(`/success1?firstName=${encodeURIComponent(first_name)}`);
  } catch (err) {
    console.error("Error during signup:", err);
    res.redirect(`/error?message=${encodeURIComponent("Internal server error")}`);
  }
});

// POST: Handle login with email validation
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.redirect(`/error?message=${encodeURIComponent("Enter a valid email address!")}`);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect(`/error?message=${encodeURIComponent("User does not exist!")}`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(`/error?message=${encodeURIComponent("Wrong password!")}`);
    }

    // Render the success page with user's first name
    res.render("success", { firstName: user.firstName });
  } catch (err) {
    console.error("Error during login:", err);
    res.redirect(`/error?message=${encodeURIComponent("Internal server error")}`);
  }
});

module.exports = router;
