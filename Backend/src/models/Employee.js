const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'Manager' }, // Reference to a Manager
    reservations: [{ type: Schema.Types.ObjectId, ref: 'SeatReservation' }] // References to Seat Reservations
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
