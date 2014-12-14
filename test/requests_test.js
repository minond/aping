'use strict';

describe('requests', function () {
    var options, me, deferred;

    var Q = require('q'),
        assert = require('assert'),
        requests = require('../src/requests');

    function log() {
        return;
    }

    beforeEach(function () {
        me = {
            $conf: {},
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
        it('uses $conf as defaults', function () {
            me.$conf.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${name}');
            assert.equal(options.path, 'hi Marcos');
        });

        it('$conf are always accessible', function () {
            me.$conf.name = 'Marcos';
            options = requests.$gen_options(me, 'hi ${conf.name}');
            assert.equal(options.path, 'hi Marcos');
        });

        it('$conf can be overwritten', function () {
            me.$conf.name = 'Marcos';
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
            deferred.promise.then(function () {}, function () {
                done();
            });

            requests.$resolve(deferred, ['{:true}'], log)();
        });
    });

    describe('#complete', function () {
        it('resolves a promise when there are no errors', function (done) {
            deferred = Q.defer();
            deferred.promise.then(function () {
                done();
            });

            requests.$complete(deferred, log)(null, '{}');
        });

        it('rejects a promise when there is an error', function (done) {
            deferred = Q.defer();
            deferred.promise.then(function () {}, function () {
                done();
            });

            requests.$complete(deferred, log)(new Error());
        });
    });

    describe('#gen_params', function () {
        it('generates an objects with keys and values', function () {
            assert.deepEqual(requests.$gen_params(['name', 'age'], ['Marcos', 25, 'blah']), {
                name: 'Marcos',
                age: 25
            });
        });

        it('returns an empty set when no args are specified', function () {
            assert.deepEqual(requests.$gen_params([], ['Marcos']), {});
            assert.deepEqual(requests.$gen_params(null, ['Marcos']), {});
        });
    });

    describe('#needs_new_access_token', function () {
        it('does when there is no previous token', function () {
            assert(requests.$needs_new_access_token({ $conf: {} }));
            assert(requests.$needs_new_access_token({ $conf: { access_token: false } }));
        });

        it('does when the expiration date is in the past', function () {
            me.$conf.access_token = 123;
            me.$auth = { expires_in: Date.now() - 100 };
            assert(requests.$needs_new_access_token(me));
        });

        it('does not when the expiration date is in the future', function () {
            me.$conf.access_token = 123;
            me.$auth = { expires_in: Date.now() + 100 };
            assert(!requests.$needs_new_access_token(me));
        });
    });
});
