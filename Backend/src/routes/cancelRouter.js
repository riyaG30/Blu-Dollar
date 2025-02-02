const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const SeatReservation = require('../models/SeatReservation');
const Floor = require('../models/Floor');

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

// DELETE endpoint for canceling a seat reservation
router.delete('/api/cancel', verifyJWT, async (req, res) => {
    const { seatNumber, date } = req.body;

    try {
        // Find the reservation
        const reservation = await SeatReservation.findOne({
            employee: req.userId,
            seatNumber,
            date,
            status: 'occupied'
        });

        if (!reservation) {
            return res.status(404).json({ message: "This seat was not booked by you. Please pick a seat which is reserved by you." });
        }

        // Update the reservation status to free
        await SeatReservation.updateOne({ _id: reservation._id }, { status: 'free' });

        // Update the seat status to free in the floor schema
        await Floor.updateOne(
            { name: reservation.floor, 'seats.seatNumber': seatNumber },
            { $set: { 'seats.$.status': 'free' }, $inc: { availableSeats: 1 } }
        );

        res.status(200).json({ message: "Reservation canceled successfully." });
    } catch (error) {
        console.error('Error canceling reservation:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;