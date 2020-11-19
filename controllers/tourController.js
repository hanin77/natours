// const fs = require('fs');
const Tour = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
// );
// exports.checkID = (req, res, next, val) => {
//   const tour = tours.find(el => el.id === req.params.id * 1);
//   if (tour === undefined) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'invalid ID'
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'bad request missing name or price'
//     });
//   }
//   next();
// };
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()
      .lean()
      .exec();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { err }
    });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id })
      .lean()
      .exec();
    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: updatedTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { err }
    });
  }
};
