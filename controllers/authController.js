const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_key_here';

exports.register = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ first_name, last_name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        const token = jwt.sign({ id: user._id, name: user.first_name }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        
        return res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.first_name } });
    } catch (error) {
        return res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
};