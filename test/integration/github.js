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

    describe('#repos', function () {
        it('can get repos for the user specified in the constructor', function () {
            return github.repos().should.eventually.contain.something.with
                .property('id', 24484705);
        });

        it('can get repos for the user pass in the call', function () {
            return github.repos('github').should.eventually.contain.something.with
                .property('id', 2349728);
        });
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

    describe('#starred', function () {
        it('can get starred repos for the user specified in the constructor', function () {
            return github.starred().should.eventually.contain.something.with
                .property('id', 3402537);
        });
    });

    describe('#following', function () {
        it('can get users being followed by the user specified in the constructor', function () {
            return github.following().should.eventually.contain.something.with
                .property('id', 2603);
        });
    });

    describe('#followers', function () {
        it('can get users following the user specified in the constructor', function () {
            return github.followers().should.eventually.contain.something.with
                .property('id', 2127504);
        });
    });
});
