'use strict';

describe('Lastfm', function () {
    var Lastfm = require('../../client/lastfm');

    var lastfm = new Lastfm({
        token: process.env.LASTFM_API_KEY,
        identifier: process.env.LASTFM_USER
    });

    var since = new Date('2014-11-03'),
        until = new Date('2014-11-04');

    require('chai')
        .use(require('chai-as-promised'))
        .should();

    it('#recent_tracks', function () {
        return lastfm.recent_tracks(since, until).should.eventually.have
            .property('recenttracks')
            .property('track')
            .property('0')
            .property('artist')
            .property('#text')
            .equal('Aesop Rock');
    });
});
