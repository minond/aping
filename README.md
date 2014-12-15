[![Build Status](https://travis-ci.org/minond/aping.svg)](https://travis-ci.org/minond/aping)
[![Coverage Status](https://coveralls.io/repos/minond/aping/badge.png?branch=master)](https://coveralls.io/r/minond/aping?branch=master)

`aping` - lets you easily create api clients.

#### usage

just import any available client saved in the `client` directory:

```js
var Github = require('aping/client/github'),
    github = new Github({ /* config */ });
```

#### example

here's an example of a client for the Github api that lets you download repo
information for any user:

```js
var aping = require('aping'),
    token = require('aping/transformer/token'),
    signature = require('aping/transformer/signature');

var Github = aping('api.github.com', [signature, token], {
    repos: aping.https('/users/${ identifier }/repos', ['identifier'])
});
```

and here's how you would use that client:

```js
var github = new Github({
    token: process.env.GITHUB_TOKEN,
    identifier: process.env.GITHUB_USER
});

// gets repos for the logged in user (identifier)
github.repos().then(function (repos) {
    console.log(repos);
});

// gets repos for the user a specific user
github.repos('minond').then(function (repos) {
    console.log(repos);
});
```

#### support

I'm also working on adding a few client's and end-points I use and need from
time to time. these are stored in the `client` directory. this is what's
currently available:

##### [Fitbit](https://wiki.fitbit.com/display/API/Fitbit+Resource+Access+API)

* [activities](https://wiki.fitbit.com/display/API/API-Get-Activities)(date)
* [weight](https://wiki.fitbit.com/display/API/API-Get-Body-Weight)(since, until)
* [fat](https://wiki.fitbit.com/display/API/API-Get-Body-Fat)(since, until)

##### [ForecastIo](https://developer.forecast.io/docs/v2)

* [forecast](https://developer.forecast.io/docs/v2)(latitude, longitude)

##### [Github](https://developer.github.com/v3/)

* [repos](https://developer.github.com/v3/repos/)([identifier])
* [commit](https://developer.github.com/v3/repos/commits/#get-a-single-commit)(repo, sha, [identifier])
* [commits](https://developer.github.com/v3/repos/commits/)(repo, [since], [until], [page], [identifier])
* [starred](https://developer.github.com/v3/users/)([identifier])
* [following](https://developer.github.com/v3/users/)([identifier])
* [followers](https://developer.github.com/v3/users/)([identifier])

##### [Lastfm](http://www.last.fm/api)

* [getRecentTracks](http://www.last.fm/api/show/user.getRecentTracks)([since], [until], [page])

##### [Meetup](http://www.meetup.com/meetup_api/)

* [events](http://www.meetup.com/meetup_api/docs/2/events/)([group_urlname], [status])

##### [MovesApp](https://dev.moves-app.com/)

* [places](https://dev.moves-app.com/docs/api_places)(from, to)

##### [RescueTime](https://www.rescuetime.com/anapi/manage)

* [select](https://www.rescuetime.com/anapi/setup/documentation)(since, until, query)

#### installing

haven't published this to npm yet, will do so after I get more tests and the
api is finalized. if you do want to install it, however, you can do so using
the github repo: `npm install minond/aping`

#### tests

clone the repo and run `make test` to run unit tests and `make apitest` to run
the integration tests (needs env vars)
