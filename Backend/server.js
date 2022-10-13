const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:5000"], credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// error Middleware
app.use(errorHandler);

// Routes middleware
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Connect Database
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {app.listen(PORT, () => {console.log(`Server Running on port`)} )})
    .catch((err) => {console.log(err)});