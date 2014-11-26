[![Build Status](https://travis-ci.org/minond/aping.svg)](https://travis-ci.org/minond/aping)

`aping` - lets you easily create api clients.

#### example

here's an example of a client for the Github api that lets you download repo
information for any user:

```js
var aping = require('aping'),
    token = require('aping/src/token'),
    signature = require('aping/src/signature');

var Github = aping('api.github.com', [signature, token], {
    repos: aping.https('/users/${ user || fields.identifier }/repos', ['user'])
});
```

and here's how you would use that client:

```js
var github = new Github({
    token: process.env.GITHUB_TOKEN, // or however you store this
    identifier: process.env.GITHUB_USER // or however you store this
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

##### [ForecastIo](https://developer.forecast.io/docs/v2)

* [forecast](https://developer.forecast.io/docs/v2)(latitude, longitude)

##### [Github](https://developer.github.com/v3/)

* [repos](https://developer.github.com/v3/repos/)([user])
* [commit](https://developer.github.com/v3/repos/commits/#get-a-single-commit)(repo, sha, [user])
* [commits](https://developer.github.com/v3/repos/commits/)(repo, [since], [until], [page], [user])

##### [Lastfm](http://www.last.fm/api)

* [getRecentTracks](http://www.last.fm/api/show/user.getRecentTracks)([since], [until], [page])

##### [Meetup](http://www.meetup.com/meetup_api/)

* [events](http://www.meetup.com/meetup_api/docs/2/events/)([group_urlname], [status])
