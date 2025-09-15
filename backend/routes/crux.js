const express = require('express');
const router = express.Router();
const cruxController = require('../controllers/cruxController');

router.get('/health', cruxController.healthCheck);
router.post('/single', cruxController.analyzeSingleUrl);
router.post('/multiple', cruxController.analyzeMultipleUrls);

module.exports = router;