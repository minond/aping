'use strict';

var Meetup = require('../../client/meetup'),
    test = require('./common').test,
    assert = require('assert');

var meetup = new Meetup({
    token: process.env.MEETUP_API_KEY,
    identifier: process.env.MEETUP_USER_ID
});

test(meetup.events('Node-Ninjas'), function (events) {
    assert(events.results);
});
