'use strict';

describe('RescueTime', function () {
    var RescueTime = require('../../client/rescue_time');

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

    it('#select', function () {
        return rescue_time.select(since, until, query).should.eventually.have
            .property('notes');
    });
});
