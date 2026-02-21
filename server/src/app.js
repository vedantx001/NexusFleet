const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use('/api', routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
