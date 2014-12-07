'use strict';

// FIXME
// expired tokens
// cannot refresh, and cannot test
var MovesApp = require('../../client/moves_app'),
    test = require('./common').test,
    assert = require('assert');

var moves = new MovesApp({
    consumer_key: process.env.MOVES_APP_CLIENT_ID,
    application_secret: process.env.MOVES_APP_SECRET,
    access_token: process.env.MOVES_APP_ACCESS_TOKEN,
    refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
});

var since = new Date('2014-11-15'),
    until = new Date('2014-11-17');

test(moves.places(since, until), function () {
    console.log(arguments);
    assert(false);
});
