const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No tour found with provided ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
