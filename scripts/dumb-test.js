'use strict';

process.env.DEBUG = 'checker*';

var fitbit, github, meetup, lastfm, forecast_io;

var Github = require('../client/github'),
    Lastfm = require('../client/lastfm'),
    Fitbit = require('../client/fitbit'),
    MovesApp = require('../client/moves_app'),
    RescueTime = require('../client/rescue_time'),
    ForecastIo = require('../client/forecast_io'),
    Meetup = require('../client/meetup');

function check(client, method, params, assertion) {
    var assert = require('assert'),
        log = require('debug')('checker:' + client.$log.namespace);

    client[ method ].apply(client, params).then(function () {
        assert.ok(assertion.apply({}, arguments));
        log('pass');
    }).catch(function (err) {
        log('fail');
        console.error(err);
    });
}

process.on('exit', function (err) {
    process.exit(1);
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

fitbit = new Fitbit({
    consumer_key: process.env.FITBIT_API_KEY,
    application_secret: process.env.FITBIT_SECRET,
    user_token: process.env.FITBIT_ACCESS_TOKEN,
    user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
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

// var moves = new MovesApp({
//     consumer_key: process.env.MOVES_APP_CLIENT_ID,
//     application_secret: process.env.MOVES_APP_SECRET,
//     access_token: process.env.MOVES_APP_ACCESS_TOKEN,
//     refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
// });

// moves.places(new Date('2014-11-15'), new Date('2014-11-17')).then(function () {
//     console.log(arguments);
// });

github = new Github({
    token: process.env.GITHUB_TOKEN,
    identifier: process.env.GITHUB_USER
});

check(github, 'repos', [], function (repos) {
    return repos.length;
});

check(github, 'commit', ['vulpes', '1dc8aba18256681a837d12180793ce384c9ffac6'], function (commit) {
    return commit.sha === '1dc8aba18256681a837d12180793ce384c9ffac6';
});

check(github, 'commits', ['vulpes', new Date('2014-10-11'), new Date('2014-10-12')], function (commits) {
    return commits[0].sha === '1dc8aba18256681a837d12180793ce384c9ffac6';
});

meetup = new Meetup({
    token: process.env.MEETUP_API_KEY,
    identifier: process.env.MEETUP_USER_ID
});

check(meetup, 'events', ['Node-Ninjas'], function (events) {
    return events.results;
});

lastfm = new Lastfm({
    token: process.env.LASTFM_API_KEY,
    identifier: process.env.LASTFM_USER
});

check(lastfm, 'recent_tracks', [new Date('2014-11-03'), new Date('2014-11-04')], function (songs) {
    return songs.recenttracks.track[0].artist['#text'] === 'Aesop Rock';
});

forecast_io = new ForecastIo({
    token: process.env.FORECASTIO_API_KEY
});

check(forecast_io, 'forecast', [process.env.MY_LATITUDE, process.env.MY_LONGITUDE], function (forecast) {
    return forecast.timezone === 'America/Denver';
});
