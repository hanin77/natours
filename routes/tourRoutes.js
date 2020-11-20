const express = require('express');
const {
  getAllTours,
  createTour,
  getOneTour,
  deleteTour,
  updateTour,
  aliasTopTours
} = require('../controllers/tourController');
const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router
  .route('/')
  .get(getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getOneTour)
  .delete(deleteTour)
  .patch(updateTour);
module.exports = router;
