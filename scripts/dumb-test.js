'use strict';

var Github = require('../client/github'),
    Lastfm = require('../client/lastfm'),
    MovesApp = require('../client/moves_app'),
    ForecaseIo = require('../client/forecast_io'),
    Meetup = require('../client/meetup');

var moves = new MovesApp({
    consumer_key: process.env.MOVES_APP_CLIENT_ID,
    application_secret: process.env.MOVES_APP_SECRET,
    access_token: process.env.MOVES_APP_ACCESS_TOKEN,
    refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
});

moves.places(new Date('2014-11-15'), new Date('2014-11-17')).then(function () {
    console.log(arguments);
});

// console.log(moves);

// var github = new Github({
//     token: process.env.GITHUB_TOKEN,
//     identifier: process.env.GITHUB_USER
// });

// var meetup = new Meetup({
//     token: process.env.MEETUP_API_KEY,
//     identifier: process.env.MEETUP_USER_ID
// });

// var lastfm = new Lastfm({
//     token: process.env.LASTFM_API_KEY,
//     identifier: process.env.LASTFM_USER
// });

// var forecast_io = new ForecaseIo({
//     token: process.env.FORECASTIO_API_KEY
// });

// forecast_io.forecast(process.env.MY_LATITUDE, process.env.MY_LONGITUDE).then(function (res) {
//     console.log(res);
// });

// lastfm.recent_tracks(new Date('2014-11-03'), new Date('2014-11-04')).then(function (res) {
//     console.log(res);
// });


// meetup.events('Node-Ninjas').then(function (res) {
//     console.log(res);
// });

// github.repos().then(function (repos) {
//     console.log(require('util').inspect(repos, {colors: false}));
// });














// var aping = require('./src/aping');

// github.commits('vulpes', new Date('2014-10-11'), new Date).then(function (commits) {
//     console.log(require('util').inspect(commits, {colors: false}));
// });

// var aping = require('./src/aping');
// var token = require('./src/token');
// var signature = require('./src/signature');
//
// aping.prototype.$qtest = function (method, args) {
//     this[ method ].apply(this, args).then(function (res) {
//         this.$log('done');
//         this.$log('res: %s ...', JSON.stringify(res).substr(0, 100));
//     }.bind(this), function () {
//         this.$log('error');
//     }.bind(this));
// };
//
//
// var Github = aping('api.github.com', [signature, token]);
// Github.endpoint.repos = aping.https('/users/${ user || fields.identifier }/repos', ['user']);
// new Github({
//     token: process.env.GITHUB_TOKEN,
//     identifier: process.env.GITHUB_USER
// }).$qtest('repos', ['fat']);
// new Github({
//     token: process.env.GITHUB_TOKEN,
//     identifier: process.env.GITHUB_USER
// }).$qtest('repos');
//
// var ForecaseIo = aping('api.forecast.io');
// ForecaseIo.endpoint.forecast = aping.https(
//     '/forecast/${ fields.token }/${ latitude },${ longitude }',
//     ['latitude', 'longitude']);
// new ForecaseIo({
//     token: process.env.FORECASTIO_API_KEY
// }).$qtest('forecast', [process.env.MY_LATITUDE, process.env.MY_LONGITUDE]);
//
// var Meetup = aping('api.meetup.com');
// Meetup.endpoint.groups = aping.https(
//     '/2/groups?key=${ fields.token }&member_id=${ member_id || fields.identifier }',
//     ['member_id']);
// new Meetup({
//     token: process.env.MEETUP_API_KEY,
//     identifier: process.env.MEETUP_USER_ID
// }).$qtest('groups');
//
//
//
// var NodeNinjas = aping('api.nodeninjas.io', [signature], {
//     users: aping.http.get('users'),
// });
// var nn = new NodeNinjas;
// nn.on('error', console.log.bind(console));
// nn.$qtest('users');
