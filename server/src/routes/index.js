const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const vehiclesRoutes = require('./vehicles');
const driversRoutes = require('./drivers');
const maintenanceRoutes = require('./maintenance');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);
router.use('/maintenance', maintenanceRoutes);

module.exports = router;
