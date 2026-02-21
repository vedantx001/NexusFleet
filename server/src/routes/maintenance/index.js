const express = require('express');
const router = express.Router();

const {
  createMaintenance,
  listMaintenance,
} = require('../../controllers/maintenance/maintenanceController');

router.post('/', createMaintenance);
router.get('/', listMaintenance);

module.exports = router;
