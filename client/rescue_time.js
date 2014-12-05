'use strict';

var URL_SELECT = '/anapi/data?format=json&version=0&key=${ fields.token }&' +
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

var aping = require('../src/aping');

/**
 * @link https://www.rescuetime.com/anapi/manage
 * @extends ApingClient
 * @constructor
 * @class RescueTime
 * @param {Object} config
 */
module.exports = aping('rescuetime.com', {
    /**
     * @link https://www.rescuetime.com/anapi/setup/documentation
     * @method select
     * @return {Date} since
     * @return {Date} until
     * @return {Object} query
     * @return {Q.Promise}
     */
    select: aping.https(URL_SELECT, ['since', 'until', 'query'])
});
