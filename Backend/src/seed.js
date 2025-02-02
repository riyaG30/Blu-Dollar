const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Manager = require('./models/Manager'); // Update the path according to your project structure
const Employee = require('./models/Employee');
const SeatReservation = require('./models/SeatReservation');

mongoose.connect('mongodb://localhost:27017/blu-reserve', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));




async function seedDatabase() {
    // Clear existing data
    await Manager.deleteMany({});
    await Employee.deleteMany({});
    await SeatReservation.deleteMany({});

    // Create managers
    const manager1 = new Manager({
        name: "Alice Johnson",
        email: "alice@ibm.com",
        bluDollars: 100,
        password: await bcrypt.hash("alice123", 10)
    });

    const manager2 = new Manager({
        name: "Bob Smith",
        email: "bob@ibm.com",
        bluDollars: 150,
        password: await bcrypt.hash("bob123", 10)
    });

    await manager1.save();
    await manager2.save();

    // Create employees
    const employees = [
        { name: "Chris Doe", email: "chris@ibm.com", password: await bcrypt.hash("chris123", 10), manager: manager1._id },
        { name: "Diana Reed", email: "diana@ibm.com", password: await bcrypt.hash("diana123", 10), manager: manager1._id },
        { name: "Evan Short", email: "evan@ibm.com", password: await bcrypt.hash("evan123", 10), manager: manager2._id },
        { name: "Fiona Glenn", email: "fiona@ibm.com", password: await bcrypt.hash("fiona123", 10), manager: manager2._id }
    ];

    await Employee.insertMany(employees);

    

    console.log('Database has been seeded successfully!');
}

seedDatabase().finally(() => mongoose.disconnect());
