const express = require('express');
const bodyParser = require('body-parser');
const loginRouter = require('./src/routes/loginRouter'); // adjust the path as necessary
const mongoose = require("mongoose")
const app = express();
const reserveRouter = require('./src/routes/reserveRouter');
const port = process.env.PORT || 5500;
const managerRouter = require('./src/routes/managerRouter');
const cancelRouter = require('./src/routes/cancelRouter');

const cors = require("cors");

app.use(
    cors({
        origin: (origin, callback) => {
            callback(null, origin); // Allow every origin dynamically
        },
        credentials: true, // Allow credentials (cookies, HTTP auth)
    })
);


app.use(bodyParser.json());
app.use('/', loginRouter);
app.use('/',reserveRouter);
app.use('/', managerRouter);
app.use('/', cancelRouter);




mongoose.connect('mongodb://localhost:27017/blu-reserve', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
