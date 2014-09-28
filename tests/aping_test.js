'use strict';

var generateRequestTestsFor = require('./helper/generate_request_tests_for');

describe('Aping', function () {
    var Aping, expect;

    beforeEach(function () {
        Aping = require('../src/aping');
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
        generateRequestTestsFor(require('../src/aping'), require('./apis/BaseApi'), 'http');
        generateRequestTestsFor(require('../src/aping'), require('./apis/BaseApi'), 'https');
        generateRequestTestsFor(require('../src/aping'), require('./apis/BaseApi'), 'oauth');
        generateRequestTestsFor(require('../src/aping'), require('./apis/BaseApi'), 'oauth2');
    });
});
