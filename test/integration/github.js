'use strict';

var Github = require('../../client/github'),
    test = require('./common').test,
    assert = require('assert');

var github = new Github({
    token: process.env.GITHUB_TOKEN,
    identifier: process.env.GITHUB_USER
});

var repo = 'vulpes',
    sha = '1dc8aba18256681a837d12180793ce384c9ffac6';

var since = new Date('2014-10-11'),
    until = new Date('2014-10-12');

test(github.repos(), function (repos) {
    assert(repos.length);
});

test(github.commit(repo, sha), function (commit) {
    assert.equal(commit.sha, sha);
});

test(github.commits(repo, since, until), function (commits) {
    assert(commits[0].sha, sha);
});
