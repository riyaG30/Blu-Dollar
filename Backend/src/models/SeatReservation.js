const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatReservationSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    seatNumber: { type: String, required: true },
    floor: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, required: true, enum: ['occupied', 'free'], default: 'free' }
});

const SeatReservation = mongoose.model('SeatReservation', seatReservationSchema);
module.exports = SeatReservation;