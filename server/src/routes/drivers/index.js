const express = require('express');
const router = express.Router();

const {
  createDriver,
  listDrivers,
  updateDriver,
  deleteDriver,
} = require('../../controllers/drivers/driversController');

router.post('/', createDriver);
router.get('/', listDrivers);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
