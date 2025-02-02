const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const SeatReservation = require('../models/SeatReservation');
const Employee = require('../models/Employee');
const Manager = require('../models/Manager');
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

// POST endpoint for creating seat reservations
router.post('/api/reserve', verifyJWT, async (req, res) => {
    const { seats, floor, date, timeSlot } = req.body; // seats is an array of seat numbers

    try {
        const floorData = await Floor.findOne({ name: floor });

        if (!floorData) {
            return res.status(404).json({ message: "Floor not found." });
        }

        // Check if all the seats are available
        const unavailableSeats = seats.filter(seatNumber => {
            const seat = floorData.seats.find(seat => seat.seatNumber === seatNumber && seat.status === 'free');
            return !seat;
        });

        if (unavailableSeats.length > 0) {
            return res.status(409).json({ message: `Seats ${unavailableSeats.join(', ')} are already reserved for the given date and time slot.` });
        }

        // Create the reservations
        const reservations = await Promise.all(seats.map(async seatNumber => {
            const newReservation = new SeatReservation({
                employee: req.userId,
                seatNumber,
                floor,
                date,
                timeSlot,
                status: 'occupied'
            });
            await newReservation.save();

            // Update the seat status to occupied
            await Floor.updateOne(
                { name: floor, 'seats.seatNumber': seatNumber },
                { $set: { 'seats.$.status': 'occupied' }, $inc: { availableSeats: -1 } }
            );

            // Schedule a job to free the seat after the timeslot
            const [startHour, startMinute] = timeSlot.split('-')[0].split(':').map(Number);
            const [endHour, endMinute] = timeSlot.split('-')[1].split(':').map(Number);
            const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) * 60 * 1000;

            setTimeout(async () => {
                await SeatReservation.updateOne({ _id: newReservation._id }, { status: 'free' });
                await Floor.updateOne(
                    { name: floor, 'seats.seatNumber': seatNumber },
                    { $set: { 'seats.$.status': 'free' }, $inc: { availableSeats: 1 } }
                );
            }, duration);

            return newReservation;
        }));

        res.status(201).json({
            message: "Reservation successful",
            reservations
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).send('Server error');
    }
});

// GET endpoint for retrieving all reservations made by the authenticated employee
router.get('/api/reservations', verifyJWT, async (req, res) => {
    try {
        const reservations = await SeatReservation.find({ employee: req.userId, status: 'occupied' });
        const employee = await Employee.findById(req.userId).populate('manager');
        const manager = await Manager.findById(employee.manager);

        const totalBluDollars = reservations.length * 5; // 5 BluDollars per seat

        const response = {
            employeeName: employee.name,
            managerName: manager.name,
            totalBluDollars,
            reservations
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving reservations:', error);
        res.status(500).send('Server error');
    }
});

router.get('/api/floor/:floorName/available-seats', verifyJWT, async (req, res) => {
    const { floorName } = req.params;

    try {
        const floor = await Floor.findOne({ name: floorName });

        if (!floor) {
            return res.status(404).json({ message: "Floor not found." });
        }

        // Find all occupied seats for the given floor
        const occupiedSeats = await SeatReservation.find({ floor: floorName, status: 'occupied' }).select('seatNumber');

        // Create a set of occupied seat numbers
        const occupiedSeatNumbers = new Set(occupiedSeats.map(seat => seat.seatNumber));

        // Filter out the available seats
        const availableSeats = floor.seats.filter(seat => seat.status === 'free' && !occupiedSeatNumbers.has(seat.seatNumber));

        // Extract the seat numbers of available seats
        const availableSeatNumbers = availableSeats.map(seat => seat.seatNumber);

        res.status(200).json({ availableSeats: availableSeatNumbers });
    } catch (error) {
        console.error('Error fetching available seats:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;