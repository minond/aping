'use strict';

describe('requests', function () {
    var proxy, request;

    var assert = require('assert'),
        requests = require('../src/requests'),
        http = requests.http_request,
        oauth = requests.oauth_request,
        oauth2 = requests.oauth2_request;

    describe('#make_url', function () {
        it('makes a freaking url', function () {
            assert.equal(
                'http://google.com/search',
                requests.$make_url('http', 'google.com', 'search')
            );
        });
    });
});
