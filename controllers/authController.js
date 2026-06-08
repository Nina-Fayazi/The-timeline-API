const db = require('../config/database');
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
        
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await db.query(
            'INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [first_name, last_name, email, hashedPassword]
        );

        return res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const user = users[0];

        // مقایسه پسورد وارد شده با پسورد هش شده در دیتابیس
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        
        const token = jwt.sign({ id: user.id, name: user.first_name }, JWT_SECRET, { expiresIn: '1h' });

        
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.first_name } });
    } catch (error) {
        return res.status(500).json({ message: "Server error during login", error: error.message });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
};