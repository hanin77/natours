const AppError = require('../utils/appError');

/*
MongoDB Errors handlers
*/
/**
 *@function  handleCastErrorDB Mongodb CastError type
 * @param {object} err
 * @return {object} new formated AppError object for client side
 */
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsValue = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate fields value: ${value}. Please choose another Value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 *
 * @param {object} err
 * @param {object} res
 */
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Somthing went very rong!',
      msg: err.message
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //handle api error
  if (req.originalUrl.startsWith('/api')) {
    //operational error sended to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      //programing or other unknown error
    } else {
      res.status(500).json({
        status: 'error',
        message: 'something went very wrong!'
      });
    }
  }
  //handle render error
  //operational error sended to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somthing went wrong!',
      msg: err.message
    });
    //programing or other unknown error
  }
  return res.status(err.statusCode).render('error', {
    status: 'something went very wrong!',
    msg: 'Please try again later'
  });
};

const handleJWTError = err =>
  new AppError('Invalid token . Please login again!', 401);
const handleJWTExpiredError = err =>
  new AppError('Expired token . Please login again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsValue(err);
    } else if (err.name === 'ValidatorError') {
      error = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(err);
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(err);
    }
    sendErrorProd(error, req, res);
  }
};
