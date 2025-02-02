const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const Manager = require('../models/Manager'); // Adjust path as necessary
const Employee = require('../models/Employee'); // Adjust path as necessary

dotenv.config();

// POST endpoint for user login
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password must be provided.' });
    }

    try {
        // Try to find the user as a manager first, if not found try as an employee
        let user = await Manager.findOne({ email }) || await Employee.findOne({ email });

        // If no user found, return invalid credentials
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password stored
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, role: user instanceof Manager ? 'manager' : 'employee' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the response with token and user role
        res.status(200).json({
            message: 'Successful login',
            token,
            role: user instanceof Manager ? 'manager' : 'employee'
        });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
