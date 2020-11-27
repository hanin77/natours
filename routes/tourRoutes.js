const express = require('express');
const {
  getAllTours,
  createTour,
  getOneTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan
} = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour_stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getOneTour)
  .delete(deleteTour)
  .patch(updateTour);
module.exports = router;
