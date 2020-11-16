const express = require('express');
const {
  getAllTours,
  createTour,
  getOneTour,
  deleteTour,
  updateTour
} = require('../controllers/tourController');
const router = express.Router();
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
