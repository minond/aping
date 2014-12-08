'use strict';

describe('Github', function () {
    var Github = require('../../client/github');

    var github = new Github({
        token: process.env.GITHUB_TOKEN,
        identifier: process.env.GITHUB_USER
    });

    var repo = 'vulpes',
        sha = '1dc8aba18256681a837d12180793ce384c9ffac6';

    var since = new Date('2014-10-11'),
        until = new Date('2014-10-12');

    it('#repos', function () {
        return github.repos().should.eventually.have
            .property('length');
    });

    it('#commit', function () {
        return github.commit(repo, sha).should.eventually.have
            .property('sha')
            .equal(sha);
    });

    it('#commits', function () {
        return github.commits(repo, since, until).should.eventually.have
            .property('0')
            .property('sha')
            .equal(sha);
    });
});
