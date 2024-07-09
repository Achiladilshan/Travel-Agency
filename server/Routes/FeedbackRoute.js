// Routes/FeedbackRouter.js
const express = require('express');
const multer = require('multer');

const feedbackController = require('../Controllers/feedbackController');
const { authGuard } = require('../utils/validator');

const FeedbackRouter = express.Router();

// Body-parser middleware
FeedbackRouter.use(express.json());
const upload = multer(); // Initialize multer

// Define routes and apply middleware as needed
FeedbackRouter.post('/addFeedback', authGuard, upload.none(), feedbackController.addFeedback);


FeedbackRouter.get('/getAllFeedback', authGuard, feedbackController.getAllFeedback);

FeedbackRouter.get('/getFeedback/:TripID', authGuard, feedbackController.getFeedbackByTripId);

FeedbackRouter.get('/getFeedbackByUser/:UserID', authGuard, feedbackController.getFeedbackByUserID);

module.exports = FeedbackRouter;
