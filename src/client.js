'use strict';

var Aping = require('./aping'),
    util = require('util');

/**
 * generates an Aping client
 * @function client
 * @param {String} request_base
 * @param {Array} [transformers]
 * @return {Function}
 */
module.exports = function client(request_base, transformers) {
    function ApingClient(fields) {
        Aping.call(this, fields, request_base);
    }

    ApingClient.$transformers = transformers || [];
    ApingClient.use = function (transformer) {
        ApingClient.$transformers.push(transformer);
    };

    util.inherits(ApingClient, Aping);
    ApingClient.endpoint = ApingClient.prototype;

    return ApingClient;
};
