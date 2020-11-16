const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
};

exports.getOneTour = (req, res) => {
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
exports.updateTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
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
exports.createTour = (req, res) => {
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
