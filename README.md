`apings` lets you easily create api clients.

## example

here's an example of a client for the Github api that lets you download repo
information for any user:

```js
var aping = require('aping'),
    token = require('aping/src/token'),
    signature = require('aping/src/signature');

var Github = aping('api.github.com', [signature, token], {
    repos: aping.https(URL_USERS, ['user'])
});
```

and here's how you would use that client:

```js
var github = new Github({
    token: process.env.GITHUB_TOKEN, // or however you store this
    identifier: process.env.GITHUB_USER // or however you store this
});

github.repos().then(function (repos) {
    console.log(repos);
});
```

## support

### [Github](https://developer.github.com/v3/)

#### [repos](https://developer.github.com/v3/repos/)

* [user]

#### [commit](https://developer.github.com/v3/repos/commits/#get-a-single-commit)

* repo
* sha
* [user]

#### [commits](https://developer.github.com/v3/repos/commits/)

* repo
* [since]
* [until]
* [page]
* [user]

### [Meetup](http://www.meetup.com/meetup_api/)

#### [events](http://www.meetup.com/meetup_api/docs/2/events/)

* [group_urlname]
* [status]
