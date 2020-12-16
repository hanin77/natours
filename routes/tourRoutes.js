const express = require('express');
const tourController = require('../controllers/tourController');

const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewroutes');

const router = express.Router();
//redirect to reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour_stats').get(tourController.getToursStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'Lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
//tours-within/233/center/-45,45/unit/ml
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'Lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getOneTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'Lead-guide'),
    tourController.deleteTour
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'Lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  );

module.exports = router;
