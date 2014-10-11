'use strict';

var URL_USERS = '/users/${ user || fields.identifier }/repos',
    URL_COMMIT = '/repos/${ user || fields.identifier }/${ repo }/commits/${ sha }',
    URL_COMMITS = '/repos/${ user || fields.identifier }/${ repo }/commits?' +
        'author=${ user || fields.identifier }&' +
        'since=${ since.toISOString() }&' +
        'until=${ until.toISOString() }&' +
        'page=${ page }&' +
        'per_page=100';

var aping = require('../src/aping'),
    token = require('../src/token'),
    signature = require('../src/signature');

/**
 * @link https://developer.github.com/v3/
 * @class Github
 * @extends ApingClient
 * @constructor
 * @param {Object} config
 * @param {String} config.token your api token
 * @param {String} config.identifier your user name
 */
module.exports = aping('api.github.com', [signature, token], {
    /**
     * @link https://developer.github.com/v3/repos/
     * @method repos
     * @param {String} [user] (default: config.identifier)
     * @return {Q.Promise}
     */
    repos: aping.https(URL_USERS, ['user']),

    /**
     * @link https://developer.github.com/v3/repos/commits/#get-a-single-commit
     * @method commit
     * @param {String} repo
     * @param {String} sha
     * @param {String} [user] (default: config.identifier)
     * @return {Q.Promise}
     */
    commit: aping.https(URL_COMMIT, ['repo', 'sha', 'user']),

    /**
     * @link https://developer.github.com/v3/repos/commits/
     * @method commits
     * @param {String} repo
     * @param {Date} [since]
     * @param {Date} [until]
     * @param {Number} [page] (default: 1)
     * @param {String} [user] (default: config.identifier)
     * @return {Q.Promise}
     */
    commits: aping.https(URL_COMMITS, ['repo', 'since', 'until', 'page', 'user']),
});
