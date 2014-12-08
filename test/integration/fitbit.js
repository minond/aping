'use strict';

describe('Fitbit', function () {
    var Fitbit = require('../../client/fitbit');

    var fitbit = new Fitbit({
        consumer_key: process.env.FITBIT_API_KEY,
        application_secret: process.env.FITBIT_SECRET,
        user_token: process.env.FITBIT_ACCESS_TOKEN,
        user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
    });

    var since = new Date('2014-12-01'),
        until = new Date('2014-12-03');

    it('#activities', function () {
        return fitbit.activities(since).should.eventually.have
            .property('summary');
    });

    it('#weight', function () {
        return fitbit.weight(since, until).should.eventually.have
            .property('weight');
    });

    it('#fat', function () {
        return fitbit.fat(since, until).should.eventually.have
            .property('fat');
    });
});
