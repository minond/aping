'use strict';

/**
 * adds a User-Agent header. some apis like to have this, like Github's:
 * http://developer.github.com/v3/#user-agent-required
 * @function signature
 * @param {Aping} client
 */
module.exports = function signature(client) {
    client.on('options', function (req) {
        req.headers['User-Agent'] = this.$conf.identifier;
    });
};
