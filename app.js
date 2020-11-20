const express = require('express');
const morgan = require('morgan');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const publicPath = path.join(__dirname, 'public');

const app = express();
//middlewares
app.use(express.static(publicPath));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req, res, next) => {
  console.log('hi from middleware');
  next();
});
//routes
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'tour.html'));
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 1) dev MIDDLEWARES

module.exports = app;
