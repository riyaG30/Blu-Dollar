const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorSchema = new Schema({
    name: { type: String, required: true, unique: true },
    availableSeats: { type: Number, required: true, default: 48 },
    seats: [{ seatNumber: { type: String, required: true }, status: { type: String, required: true, enum: ['occupied', 'free'], default: 'free' } }]
});

const Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;