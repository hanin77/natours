const app = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.LOCALDATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log('DB connection successfull');
  })
  .catch(err => {
    console.log(`Db connection failed err: ${err}`);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
