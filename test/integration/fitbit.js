'use strict';

var Fitbit = require('../../client/fitbit'),
    test = require('./common').test,
    assert = require('assert');

var fitbit = new Fitbit({
    consumer_key: process.env.FITBIT_API_KEY,
    application_secret: process.env.FITBIT_SECRET,
    user_token: process.env.FITBIT_ACCESS_TOKEN,
    user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
});

var since = new Date('2014-12-01'),
    until = new Date('2014-12-03');

test(fitbit.activities(since), function (activities) {
    assert('summary' in activities);
});

test(fitbit.weight(since, until), function (activities) {
    assert('weight' in activities);
});

test(fitbit.fat(since, until), function (activities) {
    assert('fat' in activities);
});
