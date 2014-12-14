'use strict';

describe('requests', function () {
    var proxy, request, options, me, deferred;

    var Q = require('q'),
        assert = require('assert'),
        requests = require('../src/requests'),
        http = requests.http_request,
        oauth = requests.oauth_request,
        oauth2 = requests.oauth2_request;

    function log() {
        return;
    }

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
        it('uses $fields as defaults', function () {
            me.$fields.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${name}');
            assert.equal(options.path, 'hi Marcos');
        });

        it('$fields are always accessible', function () {
            me.$fields.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${fields.name}');
            assert.equal(options.path, 'hi Marcos');
        });

        it('$fields can be overwritten', function () {
            me.$fields.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${name}', { name: 'Andres' });
            assert.equal(options.path, 'hi Andres');
        });
    });

    describe('#resolve', function () {
        it('resolves when json is valid', function (done) {
            deferred = Q.defer();
            deferred.promise.then(function (obj) {
                assert(obj.a);
                done();
            });

            requests.$resolve(deferred, ['{"a":true}'], log)();
        });

        it('rejects when json is invalid', function (done) {
            deferred = Q.defer();
            deferred.promise.then(function () {}, function (obj) {
                done();
            });

            requests.$resolve(deferred, ['{:true}'], log)();
        });
    });
});
