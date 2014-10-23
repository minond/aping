'use strict';

/**
 * adds a token string to the request
 * @function token
 * @param {Aping} client
 */
module.exports = function token(client) {
    client.on('options', function (req) {
        req.auth = this.$fields.token + ':x-oauth-basic';
    });
};
