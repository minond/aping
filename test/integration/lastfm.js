'use strict';

var Lastfm = require('../../client/lastfm'),
    test = require('./common').test,
    assert = require('assert');

var lastfm = new Lastfm({
    token: process.env.LASTFM_API_KEY,
    identifier: process.env.LASTFM_USER
});

var since = new Date('2014-11-03'),
    until = new Date('2014-11-04');

test(lastfm.recent_tracks(since, until), function (songs) {
    assert.equal(songs.recenttracks.track[0].artist['#text'], 'Aesop Rock');
});
