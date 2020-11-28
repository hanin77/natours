const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1 getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new AppError('You are not logedin!Please login to get access', 401));
  }

  //2 verify token it compare the received signature with the generated signature using JWT_SECRET and decoded payload
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3 Check if user still exist
  const curentUser = await User.findById(decoded.id);
  if (!curentUser) {
    return next(
      new AppError('The user belonging to the token no longer exist', 401)
    );
  }
  //4 check if user changed password after token was issued
  if (curentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again')
    );
  }
  // Grant access to the protected route
  req.user = curentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('there is no user with the provided address', 404)
    );
  }
  //generate random reset token
  const resetToken = user.createPasswordResetToken();
  //we save the encryptedToken in the db
  await user.save({ validateBeforeSave: false });
  //we send generated token to user Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forgot your assword? submit a patch request with your new password and passwordConfirm to:${resetURL}.\n if you didn't request password reset Please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'password Reset',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email, Please try again later',
        500
      )
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //if token has not expired and there is a user,set the new password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //log the user in
  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).isSelected('+password');
  //check if provided passwordCurrent equals our current password
  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('Your current password is wrong', 401));
  }
  //if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //log user in and send respond
  createSendToken(user, 200, res);
});
