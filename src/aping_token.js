'use strict';

var Aping = require('./aping');

var inherits = require('util').inherits,
    lazy = require('require-lazy-loader'),
    defaults = lazy('lodash-node/modern/objects/defaults');

/**
 * @constructor
 * @class ApingToken
 * @extends Aping
 * @param {Object} fields
 *   - {String} key api token/key string
 *   - {String} [identifier] some sort of unique identifier. passed as the
 *              User-Agent header if provided
 * @param {String} [request_base]
 */
function ApingToken (fields, request_base) {
    Aping.call(this, fields, request_base);

    /**
     * the api key/token
     * @property $token
     * @type {String}
     */
    this.$token = fields.token;
}

inherits(ApingToken, Aping);

/**
 * adds an `auth`` property with the token and sets the User-Agent header to
 * the user identifier, if available
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
ApingToken.prototype.$options = function (path, fields) {
    var req = Aping.prototype.$options.call(this, path, fields);

    return defaults({
        auth: this.$token + ':x-oauth-basic',
        headers: defaults({
            'User-Agent': this.$fields.identifier || 'Aping'
        }, req.headers)
    }, req);
};

module.exports = ApingToken;
