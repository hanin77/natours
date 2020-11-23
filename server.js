const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.LOCALDATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successfull');
  })
  .catch(err => {
    console.log(`Db connection failed err: ${err}`);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `App running in ${process.env.NODE_ENV} mode on port: ${port}...`
  );
});
