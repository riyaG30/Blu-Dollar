const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');
const SeatReservation = require('../models/SeatReservation');

dotenv.config();

// Middleware to verify JWT
function verifyJWT(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
}

// GET endpoint for fetching all employees under a manager who have active reservations and the total BluDollars charged
router.get('/api/manager/reservations', verifyJWT, async (req, res) => {
    try {
        const manager = await Manager.findById(req.userId);
        if (!manager) {
            return res.status(404).json({ message: "Manager not found." });
        }

        const employees = await Employee.find({ manager: manager._id });
        const employeesWithReservations = [];
        let totalBluDollarsCharged = 0;

        for (const employee of employees) {
            const reservations = await SeatReservation.find({ employee: employee._id, status: 'occupied' });
            if (reservations.length > 0) {
                employeesWithReservations.push({
                    employeeName: employee.name,
                    reservations
                });
                totalBluDollarsCharged += reservations.length * 5; // 5 BluDollars per seat
            }
        }

        const remainingBluDollars = manager.bluDollars - totalBluDollarsCharged;

        const response = {
            managerName: manager.name,
            totalBluDollarsCharged,
            remainingBluDollars,
            employeesWithReservations
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;