const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  /*check email and password are provided else throw error*/
  if (!email || !password) {
    next(new AppError('Please provide email and password, 400'));
  }
  /*find user with email and password */
  const user = await User.findOne({ email }).select('+password');
  //if paasword or email uncorrect throw error
  if (!(await user.correctPassword(password, user.password)) || !user) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //if email and password are cprrect send token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});