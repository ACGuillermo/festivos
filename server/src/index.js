/* eslint-disable max-len */
const { DateTime } = require('luxon');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
let municipios = require('./json/municipiosDates.json');

const dataMap = new Map(municipios.map((i) => [i.name, i.festivos]));
municipios = null;

const middlewares = require('./middlewares');

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const getHoliday = (clientDate, municipio) => {
  if (!dataMap.has(municipio)) {
    const error = new Error(`${municipio} no existe.`);
    return error;
  }

  const municipioHolidays = dataMap.get(municipio);

  let holiday;
  for (let i = 0; i < municipioHolidays.length; i += 1) {
    const festivo = DateTime.fromISO(municipioHolidays[i]);
    const diff = festivo.diff(clientDate, ['months', 'days', 'hours', 'minutes', 'seconds']);

    if (festivo > clientDate || (diff.hours > -24 && diff.days === 0 && diff.months === 0)) {
      holiday = municipioHolidays[i];
      break;
    } else {
      holiday = '2020-01-01';
    }
  }

  return holiday;
};

app.post('/', (req, res, next) => {
  // Client data
  const clientDate = DateTime.fromISO(req.body.date);
  const clientMunicipio = req.body.municipio;
  const clientCoords = req.body.coords;

  let nextFestivoDate;
  // If coords we get municipio using maps api else use client municipio
  if (clientCoords) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${clientCoords.lat},${clientCoords.lng}&result_type=administrative_area_level_4&key=AIzaSyBqGXhUnvj3N2nTxUWzINmK5KSQeslYEqo`)
      .then((response) => {
        const googleMunicipio = response.data.results[0].address_components[0].long_name.toLowerCase();
        nextFestivoDate = getHoliday(clientDate, googleMunicipio);
        res.send({
          festivo: nextFestivoDate,
        });
      });
  } else if (typeof (getHoliday(clientDate, clientMunicipio)) === 'object') {
    res.status(404);
    next(getHoliday(clientDate, clientMunicipio));
  } else {
    nextFestivoDate = getHoliday(clientDate, clientMunicipio);
    res.send({
      festivo: nextFestivoDate,
    });
  }
});

// Not found middleware
app.use(middlewares.notFound);

// Error middleware
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening ${port}`);
});
