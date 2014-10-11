'use strict';

var Aping = require('./aping'),
    util = require('util'),
    forOwn = require('lodash-node/modern/objects/forOwn');

/**
 * generates an Aping client
 * @function client
 * @param {String} request_base
 * @param {Array} [transformers]
 * @param {Object} [endpoints]
 * @return {Function}
 */
module.exports = function client(request_base, transformers, endpoints) {
    function ApingClient(fields) {
        Aping.call(this, fields, request_base);
    }

    // XXX options endpoints = transformers if isPlainObject(transformers) && !endpoints

    ApingClient.$transformers = transformers || [];
    ApingClient.use = function (transformer) {
        ApingClient.$transformers.push(transformer);
    };

    util.inherits(ApingClient, Aping);
    ApingClient.endpoint = ApingClient.prototype;

    forOwn(endpoints, function (handler, label) {
        ApingClient.endpoint[ label ] = handler;
    });

    return ApingClient;
};
