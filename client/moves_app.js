'use strict';

var URL_BASE = '/api/1.1/',
    URL_DATE_RANGE = 'from=<%= format.date.iso(from) %>&to=<%= format.date.iso(to) %>',
    URL_PLACES = URL_BASE + 'user/places/daily?' + URL_DATE_RANGE;

var aping = require('../src/aping'),
    config = require('../src/config');

var auth = {
    expires_in: new Date(),
    refresh_token_url_base: 'api.moves-app.com',
    refresh_token_url_path: '/oauth/v1/access_token'
};

/**
 */
module.exports = aping('api.moves-app.com', [config('auth', auth)], {
    /**
     */
    places: aping.oauth2(URL_PLACES, ['from', 'to'])
});

module.exports.prototype.$refresh = function () {
    return {
        grant_type: 'refresh_token',
        client_id: this.$fields.consumer_key,
        refresh_token: this.$fields.refresh_token,
        code: this.$fields.refresh_token,
        client_secret: this.$fields.application_secret
    };
};
