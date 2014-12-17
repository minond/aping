'use strict';

var URL_SELECT = '/anapi/data?' +
    'format=json&version=0&key=${ conf.token }&' +
    'perspective=${ query.perspective }&' +
    'resolution_time=${ query.resolution_time}&' +
    'restrict_group=${ query.restrict_group }&' +
    'restrict_user=${ query.restrict_user }&' +
    'restrict_begin=<%= format.date.iso(since) %>&' +
    'restrict_end=<%= format.date.iso(until) %>&' +
    'restrict_kind=${ query.restrict_kind }&' +
    'restrict_project${ query.restrict_project }&' +
    'restrict_thing=${ query.restrict_thing }&' +
    'restrict_thingy=${ query.restrict_thingy }&' +
    'operation=select';

var aping = require('../src/aping'),
    reqmod = require('../transformer/reqmod');

var reject_unauthorized = reqmod({
    rejectUnauthorized: false
});

/**
 * @link https://www.rescuetime.com/anapi/manage
 * @extends ApingClient
 * @constructor
 * @class RescueTime
 * @param {Object} config
 */
module.exports = aping('rescuetime.com', [reject_unauthorized], {
    /**
     * get information about the user's productivity levels
     * @link https://www.rescuetime.com/anapi/setup/documentation
     * @method select
     * @param {Date} since
     * @param {Date} until
     * @param {Object} query
     * @return {Q.Promise}
     */
    select: aping.https(URL_SELECT, ['since', 'until', 'query'])
});
