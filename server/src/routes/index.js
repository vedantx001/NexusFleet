const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./auth');
const tripsRoutes = require('./trips');
const vehiclesRoutes = require('./vehicles');
const driversRoutes = require('./drivers');
const maintenanceRoutes = require('./maintenance');
const expensesRoutes = require('./expenses');
const dashboardRoutes = require('./dashboard');
const analyticsRoutes = require('./analytics');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripsRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/expenses', expensesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
