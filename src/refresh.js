'use strict';

/**
 * defines a refresh method. for oauth2
 * @function refresh
 * @param {String} grant_type
 */
module.exports = function refresh(grant_type) {
    return function refresh_setter(client) {
        if (client.constructor.prototype.$refresh) {
            return;
        }

        client.constructor.prototype.$refresh = function () {
            return {
                grant_type: grant_type,
                client_id: this.$fields.consumer_key,
                refresh_token: this.$fields.refresh_token,
                code: this.$fields.refresh_token,
                client_secret: this.$fields.application_secret
            };
        };
    };
};
