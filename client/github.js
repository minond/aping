'use strict';

var URL_USERS = '/users/${ identifier }/repos',
    URL_STARRED = '/users/${identifier}/starred',
    URL_FOLLOWING = '/users/${identifier}/following',
    URL_FOLLOWERS = '/users/${identifier}/followers',
    URL_COMMIT = '/repos/${ identifier }/${ repo }/commits/${ sha }',
    URL_COMMITS = '/repos/${ identifier }/${ repo }/commits?' +
        'author=${ identifier }&' +
        'since=${ since.toISOString() }&' +
        'until=${ until.toISOString() }&' +
        'page=${ page }&' +
        'per_page=100';

var aping = require('../src/aping'),
    token = require('../transformer/token'),
    signature = require('../transformer/signature');

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
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    repos: aping.https(URL_USERS, ['identifier']),

    /**
     * @link https://developer.github.com/v3/repos/commits/#get-a-single-commit
     * @method commit
     * @param {String} repo
     * @param {String} sha
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    commit: aping.https(URL_COMMIT, ['repo', 'sha', 'identifier']),

    /**
     * @link https://developer.github.com/v3/repos/commits/
     * @method commits
     * @param {String} repo
     * @param {Date} [since]
     * @param {Date} [until]
     * @param {Number} [page] (default: 1)
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    commits: aping.https(URL_COMMITS, ['repo', 'since', 'until', 'page', 'identifier']),

    /**
     * @link https://developer.github.com/v3/users/
     * @method starred
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    starred: aping.https(URL_STARRED, ['identifier']),

    /**
     * @link https://developer.github.com/v3/users/
     * @method following
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    following: aping.https(URL_FOLLOWING, ['identifier']),

    /**
     * @link https://developer.github.com/v3/users/
     * @method followers
     * @param {String} [identifier]
     * @return {Q.Promise}
     */
    followers: aping.https(URL_FOLLOWERS, ['identifier'])
});
