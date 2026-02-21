const express = require('express');
const router = express.Router();

const analyticsController = require('../../controllers/analytics/analyticsController');

router.get('/', analyticsController.getAnalytics);

module.exports = router;
