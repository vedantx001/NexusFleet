const express = require('express');

const tripsController = require('../../controllers/trips/tripsController');
const { requireAuth } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, tripsController.createTrip);
router.patch('/:id/complete', requireAuth, tripsController.completeTrip);

module.exports = router;
