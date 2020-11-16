const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, 'public');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);
const app = express();
app.use(express.static(publicPath));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'tour.html'));
});
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
};

const getOneTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);
  if (tour !== undefined) {
    res.status(200).json({
      status: 'success',
      data: tour
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }
};
const updateTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);
  if (tour !== undefined) {
    res.status(200).json({
      status: 'success',
      data: '<updated tour here>'
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }
};
const deleteTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);
  if (tour !== undefined) {
    res.status(204).json({
      status: 'success',
      data: null
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    error => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour }
      });
    }
  );
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .delete(deleteTour)
  .patch(updateTour);
// 1) dev MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// axios.post(
//   'http://localhost:3000/api/v1/tours',
//   {
//     username: 'med',
//     password: '124lk'
//   },
//   { headers: { 'content-type': 'application/json' } }
// );
