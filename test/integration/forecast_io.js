'use strict';

var ForecastIo = require('../../client/forecast_io'),
    test = require('./common').test,
    assert = require('assert');

var forecast_io = new ForecastIo({
    token: process.env.FORECASTIO_API_KEY
});

var lat = process.env.MY_LATITUDE,
    lon = process.env.MY_LONGITUDE;

test(forecast_io.forecast(lat, lon), function (forecast) {
    assert.equal(forecast.timezone, 'America/Denver');
});
