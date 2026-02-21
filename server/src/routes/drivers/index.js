const express = require('express');
const router = express.Router();

const {
  createDriver,
  listDrivers,
  updateDriver,
} = require('../../controllers/drivers/driversController');

router.post('/', createDriver);
router.get('/', listDrivers);
router.patch('/:id', updateDriver);

module.exports = router;
