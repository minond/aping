'use strict';

var generateRequestTestsFor = require('./helper/generate_request_tests_for');

describe('Aping', function () {
    var Aping, expect;

    beforeEach(function () {
        Aping = require('..');
        expect = require('expect.js');
    });

    describe('#constructor', function () {
        it('emits events', function () {
            var myapi, called = false;

            myapi = new Aping();
            myapi.on('hi', function () {
                called = true;
            });

            myapi.emit('hi');
            expect(called).to.be(true);
        });
    });

    describe('.request', function () {
        generateRequestTestsFor(require('..'), require('./apis/BaseApi'), 'http');
        generateRequestTestsFor(require('..'), require('./apis/BaseApi'), 'https');
        generateRequestTestsFor(require('..'), require('./apis/BaseApi'), 'oauth');
        generateRequestTestsFor(require('..'), require('./apis/BaseApi'), 'oauth2');
    });
});
