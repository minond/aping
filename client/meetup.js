'use strict';

var URL_EVENTS = '/2/events?key=${ conf.token }&' +
    'group_urlname=${ group_urlname }&' +
    'status=${ status || "upcoming,past,proposed,suggested,cancelled,draft" }';

var aping = require('../src/aping');

/**
 * @link http://www.meetup.com/meetup_api/
 * @class Meetup
 * @extends ApingClient
 * @constructor
 * @param {Object} config
 * @param {String} config.token your api token
 * @param {String} config.identifier your user name
 */
module.exports = aping('api.meetup.com', [], {
    /**
     * @link http://www.meetup.com/meetup_api/docs/2/events/
     * @method events
     * @param {String} [group_urlname]
     * @param {String} [status] (default: all statuses comma separated)
     * @return {Q.Promise}
     */
    events: aping.https(URL_EVENTS, ['group_urlname', 'status'])
});
