'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    lazy = require('require-lazy-loader')(require),
    debug = lazy('debug');

var defaults = lazy('lodash-node/modern/objects/defaults'),
    template = lazy('lodash-node/modern/utilities/template');

var http_request = lazy('./base http_request'),
    oauth_request = lazy('./base oauth_request'),
    oauth2_request = lazy('./base oauth2_request');

/**
 * @constructor
 * @class Aping
 * @extends EventEmitter
 * @param {Object} [fields]
 * @param {String} [request_base]
 */
function Aping (fields, request_base) {
    EventEmitter.call(this);

    /**
     * available in every string template
     * @property $oauth
     * @type {Object}
     */
    this.$fields = fields || {};

    /**
     * base url of the api
     * @property $$REQUEST_CONFIG
     * @type {Object}
     */
    this.$REQUEST_CONFIG = {
        BASE: request_base
    };

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = debug(request_base);
}

inherits(Aping, EventEmitter);

/**
 * generates a request options object for a refresh token request
 *
 * @method $refresh
 * @return {Object}
 */
Aping.prototype.$refresh = function () {
    throw new Error('Method not implemented');
};

/**
 * generates a request options object
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Aping.prototype.$options = function (path, fields) {
    fields = defaults(fields || {}, {
        fields: this.$fields,
    });

    return {
        headers: {},
        host: this.$REQUEST_CONFIG.BASE,
        path: template(path, fields),
    };
};

/**
 * api request function generators
 * @property request
 * @type {Object}
 */
Aping.request = {
    http: {},
    https: {},
    oauth: {},
    oauth2: {}
};

/**
 * generates an api call method using http
 *
 * @method request.http.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.request.http.get = function (url, arglist) {
    return http_request('get', url, arglist, require('http'));
};

/**
 * generates an api call method using https
 *
 * @method request.https.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.request.https.get = function (url, arglist) {
    return http_request('get', url, arglist, require('https'));
};

/**
 * generates an api call method using oauth
 *
 * @method request.oauth.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.request.oauth.get = function (url, arglist) {
    return oauth_request('get', url, arglist);
};

/**
 * generates an api call method using oauth2
 *
 * @method request.oauth2.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.request.oauth2.get = function (url, arglist) {
    return oauth2_request('get', url, arglist);
};

module.exports = Aping;
module.exports.inherits = inherits;
module.exports.Token = require('./aping_token');
