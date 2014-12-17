'use strict';

var URL_TMPL_USER = '1/user/-/',
    URL_TMPL_DATE = '/date/<%= format.date.iso(date) %>.json',
    URL_TMPL_DATE_RANGE = '/date/<%= format.date.iso(since) %>/' +
        '<%= format.date.iso(until) %>.json';

var URL_USER_ACTIVITIES = URL_TMPL_USER + 'activities' + URL_TMPL_DATE,
    URL_USER_WEIGHT = URL_TMPL_USER + 'body/log/weight' + URL_TMPL_DATE_RANGE,
    URL_USER_FAT = URL_TMPL_USER + 'body/log/fat' + URL_TMPL_DATE_RANGE;

var aping = require('../src/aping'),
    config = require('../transformer/config');

var auth = {
    request_token_url: 'https://api.fitbit.com/oauth/request_token',
    request_access_url: 'https://api.fitbit.com/oauth/access_token',
    api_version: '1.0',
    signature_method: 'HMAC-SHA1'
};

/**
 * @link https://wiki.fitbit.com/display/API/Fitbit+Resource+Access+API
 * @extends ApingClient
 * @constructor
 * @class Fitbit
 * @param {Object} config
 */
module.exports = aping('api.fitbit.com', [config('auth', auth)], {
    /**
     * get a summary and list of a user's activities and activity log entries
     * for a given day
     * @link https://wiki.fitbit.com/display/API/API-Get-Activities
     * @method activities
     * @param {Date} date
     * @return {Q.Promise}
     */
    activities: aping.oauth(URL_USER_ACTIVITIES, ['date']),

    /**
     * get a list of all user's body weight log entries for a given day
     * @link https://wiki.fitbit.com/display/API/API-Get-Body-Weight
     * @method weight
     * @param {Date} since
     * @param {Date} until
     * @return {Q.Promise}
     */
    weight: aping.oauth(URL_USER_WEIGHT, ['since', 'until']),

    /**
     * get a list of all user's body fat log entries for a given day
     * @link https://wiki.fitbit.com/display/API/API-Get-Body-Fat
     * @method fat
     * @param {Date} since
     * @param {Date} until
     * @return {Q.Promise}
     */
    fat: aping.oauth(URL_USER_FAT, ['since', 'until'])
});
