// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');

exports.getAllTours = async (req, res) => {
  try {
    //filter reserved word
    //sort
    //Field limiting
    //pagination
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-rating, price';
  req.query.fields = 'name,price,rating,summary';
  next();
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
