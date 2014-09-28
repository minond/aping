'use strict';

var format = require('util').format;

module.exports = function generateRequestTestsFor(Aping, MyApi, type) {
    var myapi;

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
};
