const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const apiRouter = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routing
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/api', apiRouter);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
