const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const expensesRoutes = require('./expenses');
const dashboardRoutes = require('./dashboard');
const analyticsRoutes = require('./analytics');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/expenses', expensesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
