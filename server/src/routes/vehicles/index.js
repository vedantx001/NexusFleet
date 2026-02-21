const express = require('express');
const router = express.Router();

const {
  createVehicle,
  listVehicles,
  updateVehicle,
} = require('../../controllers/vehicles/vehiclesController');

router.post('/', createVehicle);
router.get('/', listVehicles);
router.patch('/:id', updateVehicle);

module.exports = router;
