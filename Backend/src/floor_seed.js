const mongoose = require('mongoose');
const Floor = require('./models/Floor');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/blu-reserve', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function seedDatabase() {
    await Floor.deleteMany({});

    const floors = [
        {
            name: 'Floor 1',
            availableSeats: 48,
            seats: generateSeats('A') // Generate seats for Floor 1 with prefix 'A'
        },
        {
            name: 'Floor 2',
            availableSeats: 48,
            seats: generateSeats('B') // Generate seats for Floor 2 with prefix 'B'
        },
        {
            name: 'Floor 3',
            availableSeats: 48,
            seats: generateSeats('C') // Generate seats for Floor 3 with prefix 'C'
        }
    ];

    await Floor.insertMany(floors);
    console.log('Database has been seeded successfully!');
    mongoose.connection.close();
}

// Function to generate seats based on the required pattern
function generateSeats(prefix) {
    return Array.from({ length: 48 }, (_, i) => ({
        seatNumber: `${prefix}${i + 1}`, // Generate seat number (e.g., A1, A2, ..., A48)
        status: 'free'
    }));
}

seedDatabase();
