'use strict';

var URL_BASE = '/api/1.1/',
    URL_DATE_RANGE = 'from=<%= format.date.iso(from) %>&to=<%= format.date.iso(to) %>',
    URL_PLACES = URL_BASE + 'user/places/daily?' + URL_DATE_RANGE;

var aping = require('../src/aping'),
    refresh = require('../transformer/refresh'),
    config = require('../transformer/config');

var auth = {
    expires_in: new Date(),
    refresh_token_url_base: 'api.moves-app.com',
    refresh_token_url_path: '/oauth/v1/access_token'
};

/**
 * @link https://dev.moves-app.com/
 * @class MovesApp
 * @extends ApingClient
 * @constructor
 * @param {Object} config
 * @param {String} config.consumer_key
 * @param {String} config.application_secret
 * @param {String} config.access_token
 * @param {String} config.refresh_token
 */
module.exports = aping('api.moves-app.com', [config('auth', auth), refresh('refresh_token')], {
    /**
     * @link https://dev.moves-app.com/docs/api_places
     * @method places
     * @param {Date} from
     * @param {Date} to
     * @return {Q.Promise}
     */
    places: aping.oauth2(URL_PLACES, ['from', 'to'])
});
