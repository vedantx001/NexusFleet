const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./auth');
const tripsRoutes = require('./trips');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripsRoutes);

module.exports = router;
