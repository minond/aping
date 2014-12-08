'use strict';

describe('ForecastIo', function () {
    var ForecastIo = require('../../client/forecast_io');

    var forecast_io = new ForecastIo({
        token: process.env.FORECASTIO_API_KEY
    });

    var lat = process.env.MY_LATITUDE,
        lon = process.env.MY_LONGITUDE;

    require('chai')
        .use(require('chai-as-promised'))
        .should();

    it('#forecast', function () {
        return forecast_io.forecast(lat, lon).should.eventually.have
            .property('timezone')
            .equal('America/Denver');
    });
});
