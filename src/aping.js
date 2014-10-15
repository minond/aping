'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    lazy = require('require-lazy-loader')(require),
    debug = lazy('debug'),
    client = lazy('./client');

var http_request = lazy('./requests http_request'),
    oauth_request = lazy('./requests oauth_request'),
    oauth2_request = lazy('./requests oauth2_request');

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
 * @signature `aping(request_base, transformers, endpoints)`
 * @param {String} request_base
 * @param {Array} [transformers]
 * @param {Object} [endpoints]
 * @return {ApingClient}
 */
var Aping = module.exports = function Aping(fields, request_base, endpoints) {
    if (!(this instanceof Aping)) {
        return client(fields, request_base, endpoints);
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
 * generates an api call method using http
 *
 * @method http
 * @alias http.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.http = function (url, arglist) {
    return http_request('get', url, arglist, require('http'));
};

/**
 * generates an api call method using http
 *
 * @method http.get
 * @alias http
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.http.get = Aping.http;

/**
 * generates an api call method using https
 *
 * @method https
 * @alias https.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.https = function (url, arglist) {
    return http_request('get', url, arglist, require('https'));
};

/**
 * generates an api call method using https
 *
 * @method https.get
 * @alias https
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.https.get = Aping.https;

/**
 * generates an api call method using oauth
 *
 * @method oauth
 * @alias oauth.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.oauth = function (url, arglist) {
    return oauth_request('get', url, arglist);
};

/**
 * generates an api call method using oauth
 *
 * @method oauth.get
 * @alias oauth
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.oauth.get = Aping.oauth;

/**
 * generates an api call method using oauth2
 *
 * @method oauth2
 * @alias oauth2.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.oauth2 = function (url, arglist) {
    return oauth2_request('get', url, arglist);
};

/**
 * generates an api call method using oauth2
 *
 * @method oauth2.get
 * @alias oauth2
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Aping.oauth2.get = Aping.oauth2;
