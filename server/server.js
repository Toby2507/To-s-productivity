require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDb = require('./configs/dbConn');
const corsOptions = require('./configs/corsOptions');
const { logger } = require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const credentials = require('./middlewares/credentials');
const verifyJWT = require('./middlewares/verifyJWT');
const PORT = process.env.PORT || 3500;

// Connect to database
connectDb();

// Middlewares and Cnfigurations
app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/login', require('./routes/login'))
app.use('/signup', require('./routes/signup'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

// Protected routes
app.use(verifyJWT)
app.use('/todos', require('./routes/api/todo'))

// Error handler
app.use(errorHandler);

// Start server
mongoose.connection.once('open', () => {
    console.log('Connected to database');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})