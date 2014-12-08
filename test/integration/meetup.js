'use strict';

describe('Meetup', function () {
    var Meetup = require('../../client/meetup');

    var meetup = new Meetup({
        token: process.env.MEETUP_API_KEY,
        identifier: process.env.MEETUP_USER_ID
    });

    require('chai')
        .use(require('chai-as-promised'))
        .should();

    it('#events', function () {
        return meetup.events('Node-Ninjas').should.eventually.have
            .property('results');
    });
});
