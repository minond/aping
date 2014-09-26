'use strict';

var Q = require('q'),
    inherits = require('util').inherits,
    debug = require('debug');

var defaults = require('lodash-node/modern/objects/defaults'),
    every = require('lodash-node/modern/collections/every'),
    template = require('lodash-node/modern/utilities/template');

/**
 * returns a function that joins a list of buffers, json decodes that, then
 * resolves a Q promise with that object
 *
 * @function resolve
 * @param {Q.deferred} deferred
 * @param {Array} buffers
 * @param {Function} log
 * @return {Function}
 */
function resolve (deferred, buffers, log) {
    var joined;

    return function () {
        try {
            joined = buffers.join('');
            joined = JSON.parse(joined);
            log('resolving request');
            deferred.resolve(joined);
        } catch (err) {
            log('invalid json response: %s', joined);
            deferred.reject(err);
        }
    };
}

/**
 * returns a function that is used to resolve completed requests
 *
 * @function complete
 * @param {Q.deferred} deferred
 * @param {Function} log
 * @return {Function}
 */
function complete (deferred, log) {
    return function (err, data) {
        if (err) {
            log('reject request');
            deferred.reject(err);
        } else {
            log('resolving request');
            deferred.resolve(JSON.parse(data));
        }
    };
}

/**
 * generates parameters for request functions
 * @function params
 * @param {Array} arglist expected arguments (ie. date, page, username, etc.)
 * @param {Array} args parameters passed to function
 * @return {Object}
 */
function params (arglist, args) {
    var data = {};

    (arglist || []).forEach(function (val, index) {
        data[ val ] = args[ index ];
    });

    return data;
}

/**
 * uses a refresh token to get a new access token
 * @function request_new_access_token
 * @param {ApingClient} me an instance of an ApingClient object
 * @param {Function} callback ran after setting access token and expiration
 */
function request_new_access_token (me, callback) {
    var querystring = require('querystring'),
        https = require('https');

    var refresh = https.request({
        method: 'POST',
        host: me.$auth.refresh_token_url_base,
        path: me.$auth.refresh_token_url_path,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    }, function (res) {
        var buffers = [];
        res.on('data', buffers.push.bind(buffers));
        res.on('end', function () {
            var auth = JSON.parse(buffers.join(''));
            me.$auth.access_token = auth.access_token;
            me.$auth.expires_in = Date.now() + auth.expires_in * 1000;
            me.$log('new access token expires on %s', new Date(me.$auth.expires_in));
            callback();
        });
    });

    me.$log('requesting new access token');
    refresh.write(querystring.stringify(me.$refresh()));
    refresh.end();
}

/**
 * checks if a new access token is in need
 * @param {ApingClient} me an instance of an ApingClient object
 * @return {boolean}
 */
function needs_new_access_token (me) {
    return !me.$auth.access_token || me.$auth.expires_in <= Date.now();
}

/**
 * generates an api call method
 *
 * @function http_request
 * @param {string} method
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @param {Object} proxy client used to make request
 * @return {Function}
 */
function http_request (method, url, arglist, proxy) {
    return function () {
        var deferred = Q.defer(),
            options = this.$options(url, params(arglist, arguments)),
            log = this.$log;

        log('requesting %s', options.path);
        proxy[ method ](options, function (res) {
            var buffers = [];

            log('downloading %s', options.path);
            res.on('data', buffers.push.bind(buffers));
            res.on('end', resolve(deferred, buffers, log));
        }).on('error', function (err) {
            log('error getting %s', options.path);
            deferred.reject(err);
        });

        return deferred.promise;
    };
}

/**
 * generates an oauth api call method
 *
 * @function oauth_request
 * @param {string} method
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @return {Function}
 */
function oauth_request (method, url, arglist) {
    var OAuth = require('oauth').OAuth;

    return function () {
        var deferred = Q.defer();

        if (!this.$oauth) {
            this.$oauth = new OAuth(
                this.$auth.request_token_url,
                this.$auth.request_access_url,
                this.$auth.consumer_key,
                this.$auth.application_secret,
                this.$auth.api_version,
                null,
                this.$auth.signature_method
            );
        }

        this.$log('requesting %s', template(url, params(arglist, arguments)));
        this.$oauth.get(
            template(url, params(arglist, arguments)),
            this.$auth.user_token,
            this.$auth.user_secret,
            complete(deferred, this.$log)
        );

        return deferred.promise;
    };
}

/**
 * generates an oauth2 call method
 *
 * @function oauth2_request
 * @param {string} method
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @return {Function}
 */
function oauth2_request (method, url, arglist) {
    var request = http_request(method, url, arglist, require('https'));

    return function () {
        var me = this,
            args = arguments,
            deferred = Q.defer();

        if (needs_new_access_token(this)) {
            request_new_access_token(this, function () {
                request.apply(me, args).then(function (data) {
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        } else {
            return request.apply(this, arguments);
        }
    };
}

/**
 * @constructor
 * @class ApingClient
 * @param {Object} [fields]
 * @param {String} [request_base]
 */
function ApingClient (fields, request_base) {
    /**
     * available in every string template
     * @property $oauth
     * @type {Object}
     */
    this.$fields = fields || {};

    /**
     * base url of the api
     * @property $$REQUEST_CONFIG
     * @type {Object}
     */
    this.$REQUEST_CONFIG = {
        BASE: request_base
    };

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = debug(request_base);
}

/**
 * @constructor
 * @class ApingTokenClient
 * @extends ApingTokenClient
 * @param {Object} fields
 *   - {String} key api token/key string
 *   - {String} [identifier] some sort of unique identifier. passed as the
 *              User-Agent header if provided
 * @param {String} [request_base]
 */
function ApingTokenClient (fields, request_base) {
    ApingClient.call(this, fields, request_base);

    /**
     * the api key/token
     * @property $token
     * @type {String}
     */
    this.$token = fields.token;
}

inherits(ApingTokenClient, ApingClient);

/**
 * generates a request options object for a refresh token request
 *
 * @method $refresh
 * @return {Object}
 */
ApingClient.prototype.$refresh = function () {
    throw new Error('Method not implemented');
};

/**
 * test request test
 * @method $qtest
 * @param {String} method
 * @param {Array} [args]
 */
ApingClient.prototype.$qtest = function (method, args) {
    this[ method ].apply(this, args).then(function (res) {
        this.$log('done');
        this.$log('res: %s ...', JSON.stringify(res).substr(0, 100));
    }.bind(this), function () {
        this.$log('error');
    }.bind(this));
};

/**
 * generates a request options object
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
ApingClient.prototype.$options = function (path, fields) {
    fields = defaults(fields || {}, {
        fields: this.$fields,
    });

    return {
        headers: {},
        host: this.$REQUEST_CONFIG.BASE,
        path: template(path, fields),
    };
};

/**
 * adds an `auth`` property with the token and sets the User-Agent header to
 * the user identifier, if available
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
ApingTokenClient.prototype.$options = function (path, fields) {
    var req = ApingClient.prototype.$options.call(this, path, fields);

    return defaults({
        auth: this.$token + ':x-oauth-basic',
        headers: defaults({
            'User-Agent': this.$fields.identifier || 'Aping'
        }, req.headers)
    }, req);
};

/**
 * api request function generators
 * @property request
 * @type {Object}
 */
ApingClient.request = {
    http: {},
    https: {},
    oauth: {},
    oauth2: {}
};

/**
 * generates an api call method using http
 *
 * @method request.http.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
ApingClient.request.http.get = function (url, arglist) {
    return http_request('get', url, arglist, require('http'));
};

/**
 * generates an api call method using https
 *
 * @method request.https.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
ApingClient.request.https.get = function (url, arglist) {
    return http_request('get', url, arglist, require('https'));
};

/**
 * generates an api call method using oauth
 *
 * @method request.oauth.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
ApingClient.request.oauth.get = function (url, arglist) {
    return oauth_request('get', url, arglist);
};

/**
 * generates an api call method using oauth2
 *
 * @method request.oauth2.get
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
ApingClient.request.oauth2.get = function (url, arglist) {
    return oauth2_request('get', url, arglist);
};

/**
 * @method extend
 * @param {Object} from parent class
 * @param {String} request_base
 * @return {Object} child class
 */
ApingClient.extend = function (from, request_base) {
    function ApingClientInstance (fields) {
        from.call(this, fields, request_base);
    }

    inherits(ApingClientInstance, from);
    return ApingClientInstance;
};

module.exports = ApingClient;
module.exports.TokenClient = ApingTokenClient;
