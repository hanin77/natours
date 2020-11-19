const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);
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
exports.getAllTours = (req, res) => {
  Tour.find()
    .lean()
    .exec()
    .then(docs => {
      res.status(200).json({
        status: 'success',
        results: docs.length,
        tours: docs
      });
    });
};

exports.getOneTour = (req, res) => {
  Tour.findOne({ _id: req.params.id })
    .lean()
    .exec()
    .then(doc => {
      res.status(200).json({
        status: 'success',
        data: doc
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'fail',
        message: err
      });
    });
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: '<updated tour here>'
  });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
exports.createTour = (req, res) => {
  Tour.create(req.body)
    .then(newTour => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour }
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'fail',
        message: { err }
      });
    });
};
