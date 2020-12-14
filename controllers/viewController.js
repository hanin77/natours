const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours: tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('there is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
});
