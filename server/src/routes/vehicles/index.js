const express = require('express');
const router = express.Router();

const {
  createVehicle,
  listVehicles,
  updateVehicle,
  deleteVehicle,
} = require('../../controllers/vehicles/vehiclesController');

router.post('/', createVehicle);
router.get('/', listVehicles);
router.patch('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
