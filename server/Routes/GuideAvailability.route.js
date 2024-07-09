const express = require('express');
const { body } = require('express-validator');
const GuideAvailabilityRouter = express.Router();
const { validate, authGuard } = require('../utils/validator');
const guideAvailabilityController = require('../Controllers/GuideAvailabilityController');


GuideAvailabilityRouter.get('/getAllAvailability', authGuard, guideAvailabilityController.getAllAvailability);

GuideAvailabilityRouter.get('/getAvailability/:GuideID', authGuard, guideAvailabilityController.getAvailabilityById);

GuideAvailabilityRouter.put('/updateAvailability/:GuideID', authGuard, guideAvailabilityController.updateAvailability);


module.exports = GuideAvailabilityRouter;
