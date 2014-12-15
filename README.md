[![Build Status](https://travis-ci.org/minond/aping.svg)](https://travis-ci.org/minond/aping)
[![Coverage Status](https://coveralls.io/repos/minond/aping/badge.png?branch=master)](https://coveralls.io/r/minond/aping?branch=master)

`aping` is a library that helps you create clients for web-based APIs. this is
my attempt at creating a way to define API clients with a simple set of methods
for hitting http endpoints, and using different types of authentication.

#### usage

to get started using `aping`, just `require('aping')` and define your api base:

```js
var aping = require('aping');
var Github = aping('api.github.com');
```

also, the `aping` function returns a "class" which you can instanciate and use
as the client. the code above will create a blank client which doesn't do
anything, so let's add some endpoints next:

```js
var aping = require('aping');
var Github = aping('api.github.com', {
    repos: aping.https('/users/${identifier}/repos', ['identifier'])
});
```

now we have a `repos` method that will make an `https` request to
`api.github.com`. before we can start making requests to github, we have to do
two more things which they request of their api users: first, we need to get an
api token and pass it alon in the request. the other thing we will do is to
tell github who we are by passing our github username in the `User-Agent`
header.  to help us do this we will use `transformer`s provided by aping.
transformers are little functions you can use along in your client to help you
modify the requests you make to meet the requirements set by the api.  we can
use the `token` transformer to include the token in request and `signature` to
pass our username in the header:

```js
var aping = require('aping'),
    token = require('aping/transformer/token'),
    signature = require('aping/transformer/signature');

var Github = aping('api.github.com', [signature, token], {
    repos: aping.https('/users/${identifier}/repos', ['identifier'])
});
```

now we are ready to start using this client:

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

you may notice I'm passing an object to the `Github` constructor which includes
`token` and `identifier`. these keys are labeled as such because that's what
the `token` and `signature` transformers are expecing. if you create a client
that doesn't rely on transformers you won't have such restrictions. also, on
one of the calls to the `repos` method I'm not passing a username
(`identifier`), this is possible because what ever you pass to the constructor
will become available for use when you make a request, and since we labeled the
username parameter as identifier, we can default to the one used when we create
the client, or pass a different one if we'd like.

#### support

I'm working on adding clients and endpoints I use/need from time to time.
these are stored in the `client` directory. this is what's currently available:

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

haven't published this to npm yet - I will do so after I get more tests and the
api is finalized. if you do want to install it, however, you can do so using
the github repo: `npm install minond/aping`

#### tests

clone the repo and run `make test` to run unit tests and `make apitest` to run
the integration tests (needs env vars)
