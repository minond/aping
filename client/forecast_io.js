'use strict';

var URL_FORECAST = '/forecast/${ fields.token }/${ latitude },${ longitude }' +
        '<% if (time) { %>,${ time }<% } %>';

var aping = require('../src/aping');

/**
 * @class ForecaseIo
 * @extends ApingClient
 * @constructor
 * @param {Object} config
 * @param {String} config.token your api token
 * @param {String} config.identifier your user name
 */
module.exports = aping('api.forecast.io', {
    /**
     * @link https://developer.forecast.io/docs/v2
     * @method forecast
     * @param {float} latitude
     * @param {float} longitude
     * @return {Q.Promise}
     */
    forecast: aping.https(URL_FORECAST, ['latitude', 'longitude', 'time'])
});
