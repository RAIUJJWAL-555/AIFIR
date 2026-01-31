const express = require('express');
const router = express.Router();
const { getNearbyStations } = require('../controllers/stationController');

router.post('/nearby', getNearbyStations);

module.exports = router;
