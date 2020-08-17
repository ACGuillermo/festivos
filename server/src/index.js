/* eslint-disable max-len */
const { DateTime } = require('luxon');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const { festivos } = require('./json/datesNoRepetidas.json');

const middlewares = require('./middlewares');

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const toDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};

app.get('/', (req, res) => {
  res.json({
    festivo: toDate(festivos),
  });
});

const getHoliday = (clientDate, clientMunicipio) => {
  // Festivos filtered by municipio.
  const festivoFiltered = festivos.filter((f) => f.municipios.filter((a) => a === clientMunicipio).length > 0);

  // TODO: Control municipio doesnt exist
  // console.log(festivoFiltered[0].municipios)
  let holiday;

  // Get the next festivo date
  for (let i = 0; i < festivoFiltered.length; i += 1) {
    const festivo = DateTime.fromISO(festivoFiltered[i].value);
    const diff = festivo.diff(clientDate, ['months', 'days', 'hours', 'minutes', 'seconds']);
    if (festivo > clientDate || (diff.hours > -24 && diff.days === 0 && diff.months === 0)) {
      holiday = festivoFiltered[i].value;
      break;
    } else {
      holiday = '2020-01-01';
    }
  }
  return holiday;
};

app.post('/', (req, res) => {
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
