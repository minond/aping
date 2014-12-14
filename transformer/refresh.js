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
                client_id: this.$conf.consumer_key,
                refresh_token: this.$conf.refresh_token,
                code: this.$conf.refresh_token,
                client_secret: this.$conf.application_secret
            };
        };
    };
};
