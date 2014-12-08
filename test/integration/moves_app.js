'use strict';

// FIXME
// expired tokens
// cannot refresh, and cannot test
describe.skip('MovesApp', function () {
    var MovesApp = require('../../client/moves_app');

    var moves = new MovesApp({
        consumer_key: process.env.MOVES_APP_CLIENT_ID,
        application_secret: process.env.MOVES_APP_SECRET,
        access_token: process.env.MOVES_APP_ACCESS_TOKEN,
        refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
    });

    var since = new Date('2014-11-15'),
        until = new Date('2014-11-17');

    it('#places', function () {
        return moves.places(since, until).should.be.fulfilled;
    });
});
