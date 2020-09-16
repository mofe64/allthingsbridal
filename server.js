const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });
let DBConnection;
if (process.env.NODE_ENV == 'test') {
  DBConnection = process.env.DATABASE_TEST;
} else if (process.env.NODE_ENV == 'production') {
  DBConnection = process.env.DATABASE_PROD;
} else if (process.env.NODE_ENV == 'development') {
  DBConnection = process.env.DATABASE_LOCAL;
}

mongoose
  .connect(DBConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`app running in ${process.env.NODE_ENV} mode on port ${port}`);
});
