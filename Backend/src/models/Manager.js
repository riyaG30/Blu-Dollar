const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bluDollars: { type: Number, required: true, default: 0 },
    employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }] 
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;
