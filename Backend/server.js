const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

// routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Connect Database

mongoose.connect(process.env.MONGO_URI)
    .then(() => {app.listen(PORT, () => {console.log(`Server Running on port`)} )})
    .catch((err) => {console.log(err)});