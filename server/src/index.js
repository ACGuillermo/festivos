const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('./middlewares');

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

const festivo = '15-08-2020';
const toDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};

app.get('/', (req, res) => {
  res.json({
    message: toDate(festivo),
  });
});

// Not found middleware
app.use(middlewares.notFound);

// Error middleware
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server listening ${port}`);
});
