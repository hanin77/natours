const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewroutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const publicPath = path.join(__dirname, 'public');

const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//middlewares//
app.use(express.static(publicPath));

//set security headers
app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       'default-src': ["'self'"],
//       'script-src': [
//         "'self'",
//         'https://js.stripe.com/v3/',
//         'https://fonts.googleapis.com/'
//       ]
//     }
//   })
// );
//dev middlwares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// we limit number of request from one ip to 100 req per hour
const Limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour'
});
app.use('/api', Limitter);
//Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//Data sanitisation against Nosql query injection
app.use(mongoSanitize());
//Data sanitisation against xss
app.use(xss());
//Prevent parammeter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'difficulty',
      'price'
    ]
  })
);
app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
//last route for all routes that does not exist
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//error handler  it handles all error
app.use(globalErrorHandler);
module.exports = app;
