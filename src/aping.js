'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    lazy = require('require-lazy-loader')(require),
    debug = lazy('debug');

var http_request = lazy('./base http_request'),
    oauth_request = lazy('./base oauth_request'),
    oauth2_request = lazy('./base oauth2_request'),
    client = lazy('./base client');

/**
 * @constructor
 * @class Aping
 * @extends EventEmitter
 *
 * @signature `new Aping(fields, request_base)`
 * @param {Object} [fields]
 * @param {String} [request_base]
 * @return {Aping}
 *
 * @function Aping
 *
 * @signature `aping(request_base, transformers)`
 * @param {String} request_base
 * @param {Array} [transformers]
 * @return {ApingClient}
 */
var Aping = module.exports = function Aping(fields, request_base) {
    if (!(this instanceof Aping)) {
        return client(fields, request_base);
    }

    EventEmitter.call(this);

    /**
     * available in every string template
     * @property $oauth
     * @type {Object}
     */
    this.$fields = fields || {};

    /**
     * base url of the api
     * @property $request_config
     * @type {Object}
     */
    this.$request_config = {
        base: request_base
    };

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = debug(request_base);

    if (this.constructor.$transformers) {
        this.constructor.$transformers.forEach(function (transformer) {
            transformer(this);
        }, this);
    }
};

util.inherits(Aping, EventEmitter);

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
