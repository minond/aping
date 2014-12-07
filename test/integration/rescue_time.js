'use strict';

var RescueTime = require('../../client/rescue_time'),
    test = require('./common').test,
    assert = require('assert');

var rescue_time = new RescueTime({
    token: process.env.RESCUETIME_API_KEY
});

var since = new Date('2014-12-01'),
    until = new Date('2014-12-03');

var query = {
    perspective: 'rank',
    resolution_time: 'hour',
    restrict_kind: 'activity'
};

test(rescue_time.select(since, until, query), function (activity) {
    assert(activity.notes);
});
