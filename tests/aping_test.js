'use strict';

function generate_request_tests_for(Aping, MyApi, type) {
    var myapi, format = require('util').format;

    beforeEach(function () {
        myapi = new MyApi();
    });

    describe(format('.%s', type), function () {
        describe('#get', function () {
            it(format('create a new %s request method', type), function () {
                MyApi.prototype.req1 = Aping.request[ type ].get('req1');
            });
        });
    });
}

describe('Aping', function () {
    var Aping = require('../src/aping'),
        expect = require('expect.js'),
        aping = Aping;

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
        generate_request_tests_for(Aping, aping(), 'http');
        generate_request_tests_for(Aping, aping(), 'https');
        generate_request_tests_for(Aping, aping(), 'oauth');
        generate_request_tests_for(Aping, aping(), 'oauth2');
    });
});
