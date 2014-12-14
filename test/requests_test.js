'use strict';

describe('requests', function () {
    var proxy, request, options, me;

    var assert = require('assert'),
        requests = require('../src/requests'),
        http = requests.http_request,
        oauth = requests.oauth_request,
        oauth2 = requests.oauth2_request;

    beforeEach(function () {
        me = {
            $fields: {},
            $request_config: {},
            emit: function () {
                return;
            }
        };
    });

    describe('#make_url', function () {
        it('makes a freaking url', function () {
            assert.equal(
                'http://google.com/search',
                requests.$make_url('http', 'google.com', 'search')
            );
        });
    });

    describe('#gen_options', function () {
        it('uses $fields as default', function () {
            me.$fields.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${name}');
            assert.equal(options.path, 'hi Marcos');
        });
    });
});
