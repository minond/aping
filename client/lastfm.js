'use strict';

var URL_RECENT_TRACKS = '/2.0/?format=json&limit=200&' +
        'api_key=${ fields.token }&' +
        'user=${ fields.identifier }&' +
        'page=${ page }&' +
        'from=${ since.getTime() }&' +
        'to=${ until.getTime() }&' +
        'method=user.getrecenttracks';

var aping = require('../src/aping');

/**
 * @link https://developer.github.com/v3/
 * @class Github
 * @extends ApingClient
 * @constructor
 * @param {Object} config
 * @param {String} config.token your api token
 * @param {String} config.identifier your user name
 */
module.exports = aping('ws.audioscrobbler.com', {
    /**
     * @link http://www.last.fm/api/show/user.getRecentTracks
     * @method getRecentTracks
     * @param {Date} [since]
     * @param {Date} [until]
     * @param {int} [page]
     * @return {Q.Promise}
     */
    recent_tracks: aping.https(URL_RECENT_TRACKS, ['since', 'until', 'page']),
});
