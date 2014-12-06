'use strict';

process.env.DEBUG = 'checker*';

var errored = false;

var fitbit, github, meetup, lastfm, forecast_io, moves;

var Github = require('../client/github'),
    Lastfm = require('../client/lastfm'),
    Fitbit = require('../client/fitbit'),
    MovesApp = require('../client/moves_app'),
    RescueTime = require('../client/rescue_time'),
    ForecastIo = require('../client/forecast_io'),
    Meetup = require('../client/meetup');

fitbit = new Fitbit({
    consumer_key: process.env.FITBIT_API_KEY,
    application_secret: process.env.FITBIT_SECRET,
    user_token: process.env.FITBIT_ACCESS_TOKEN,
    user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
});

github = new Github({
    token: process.env.GITHUB_TOKEN,
    identifier: process.env.GITHUB_USER
});

meetup = new Meetup({
    token: process.env.MEETUP_API_KEY,
    identifier: process.env.MEETUP_USER_ID
});

lastfm = new Lastfm({
    token: process.env.LASTFM_API_KEY,
    identifier: process.env.LASTFM_USER
});

forecast_io = new ForecastIo({
    token: process.env.FORECASTIO_API_KEY
});

moves = new MovesApp({
    consumer_key: process.env.MOVES_APP_CLIENT_ID,
    application_secret: process.env.MOVES_APP_SECRET,
    access_token: process.env.MOVES_APP_ACCESS_TOKEN,
    refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
});

function check(client, method, params, assertion) {
    var assert = require('assert'),
        log = require('debug')('checker:' + client.$log.namespace);

    client[ method ].apply(client, params).then(function () {
        assert.ok(assertion.apply({}, arguments));
        log('pass');
    }).catch(function (err) {
        errored = true;
        log('fail');
        console.error(err);
    });
}

process.on('exit', function () {
    process.exit(errored ? 1 : 0);
});

check(new RescueTime({token: process.env.RESCUETIME_API_KEY}), 'select', [
    new Date('2014-12-01'),
    new Date('2014-12-03'),
    {
        perspective: 'rank',
        resolution_time: 'hour',
        restrict_kind: 'activity'
    }
], function (activity) {
    return !!activity.notes;
});

// check(fitbit, 'activities', [new Date('2014-12-03')], function (activities) {
//     return 'summary' in activities;
// });
//
// check(fitbit, 'weight', [new Date('2014-12-01'), new Date('2014-12-03')], function (weight) {
//     return 'weight' in weight;
// });
//
// check(fitbit, 'fat', [new Date('2014-12-01'), new Date('2014-12-03')], function (fat) {
//     return 'fat' in fat;
// });

// moves.places(new Date('2014-11-15'), new Date('2014-11-17')).then(function () {
//     console.log(arguments);
// });

check(github, 'repos', [], function (repos) {
    return repos.length;
});

check(github, 'commit', ['vulpes', '1dc8aba18256681a837d12180793ce384c9ffac6'], function (commit) {
    return commit.sha === '1dc8aba18256681a837d12180793ce384c9ffac6';
});

check(github, 'commits', ['vulpes', new Date('2014-10-11'), new Date('2014-10-12')], function (commits) {
    return commits[0].sha === '1dc8aba18256681a837d12180793ce384c9ffac6';
});

check(meetup, 'events', ['Node-Ninjas'], function (events) {
    return events.results;
});

check(lastfm, 'recent_tracks', [new Date('2014-11-03'), new Date('2014-11-04')], function (songs) {
    return songs.recenttracks.track[0].artist['#text'] === 'Aesop Rock';
});

check(forecast_io, 'forecast', [process.env.MY_LATITUDE, process.env.MY_LONGITUDE], function (forecast) {
    return forecast.timezone === 'America/Denver';
});
