const express = require('express');
const router = express.Router();
const cruxController = require('../controllers/cruxController');

router.get('/health', cruxController.healthCheck.bind(cruxController));
router.post('/single', cruxController.analyzeSingleUrl.bind(cruxController));
router.post('/multiple', cruxController.analyzeMultipleUrls.bind(cruxController));

module.exports = router;