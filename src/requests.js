'use strict';

var Q = require('q'),
    lazy = require('require-lazy-loader'),
    defaults = lazy('lodash-node/modern/objects/defaults'),
    template = lazy('lodash-node/modern/utilities/template');

var timports = {
    imports: {
        format: require('./formatters')
    }
};

/**
 * just a url helper
 * @function make_url
 * @param {String} protocol (http)
 * @param {String} base (google.com)
 * @param {String} path (/search)
 * @return {String} full url (http://google.com/search)
 */
function make_url(protocol, base, path) {
    return template('${ protocol }://${ base }/${ path }', {
        protocol: protocol,
        base: base,
        path: path
    });
}

/**
 * generates a request options object
 *
 * @function gen_options
 * @param {Aping} me an instance of an Aping object
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
function gen_options(me, path, fields) {
    var req;

    fields = defaults(fields || {}, {
        fields: me.$fields
    }, me.$fields);

    req = {
        headers: {},
        host: me.$request_config.base,
        path: template(path, fields, timports)
    };

    me.emit('options', req);
    return req;
}

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
function resolve(deferred, buffers, log) {
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
function complete(deferred, log) {
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
 * @function gen_params
 * @param {Array} arglist expected arguments (ie. date, page, username, etc.)
 * @param {Array} args parameters passed to function
 * @return {Object}
 */
function gen_params(arglist, args) {
    var data = {};

    (arglist || []).forEach(function (val, index) {
        data[ val ] = args[ index ];
    });

    return data;
}

/**
 * uses a refresh token to get a new access token
 * @function request_new_access_token
 * @param {Aping} me an instance of an Aping object
 * @param {Function} callback ran after setting access token and expiration
 */
function request_new_access_token(me, callback) {
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
            me.$fields.access_token = auth.access_token;
            me.$auth.expires_in = Date.now() + auth.expires_in * 1000;

            if (auth.error) {
                me.$log('error requesting token %o', auth);
            } else {
                me.$log('new access token expires on %s', new Date(me.$auth.expires_in));
            }

            callback();
        });
    });

    me.$log('requesting new access token');
    refresh.write(querystring.stringify(me.$refresh()));
    refresh.end();
}

/**
 * checks if a new access token is in need
 * @param {Aping} me an instance of an Aping object
 * @return {boolean}
 */
function needs_new_access_token(me) {
    return !me.$fields.access_token || me.$auth.expires_in <= Date.now();
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
function http_request(method, url, arglist, proxy) {
    return function () {
        var deferred = Q.defer(),
            params = gen_params(arglist, arguments),
            options = gen_options(this, url, params);

        this.$log('requesting %s', options.path);
        proxy[ method ](options, function (res) {
            var buffers = [];

            this.$log('downloading %s', options.path);
            res.on('data', buffers.push.bind(buffers));
            res.on('end', resolve(deferred, buffers, this.$log));
        }.bind(this)).on('error', function (err) {
            this.$log('error getting %s', options.path);
            deferred.reject(err);

            // triggering an error event without listeners kills the process
            if (this.listeners('error').length) {
                this.emit('error', err, method, url, params);
            }
        }.bind(this));

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
function oauth_request(method, url, arglist) {
    var OAuth = require('oauth').OAuth,
        req_url;

    return function () {
        var deferred = Q.defer();

        url = make_url('https', this.$request_config.base, url);
        req_url = template(url, gen_params(arglist, arguments), timports);

        if (!this.$oauth) {
            this.$oauth = new OAuth(
                this.$auth.request_token_url,
                this.$auth.request_access_url,
                this.$fields.consumer_key,
                this.$fields.application_secret,
                this.$auth.api_version,
                null,
                this.$auth.signature_method
            );
        }

        this.$log('requesting %s', req_url);
        this.$oauth.get(
            req_url,
            this.$fields.user_token,
            this.$fields.user_secret,
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
function oauth2_request(method, url, arglist) {
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
        }

        return request.apply(this, arguments);
    };
}

module.exports = {
    $complete: complete,
    $gen_options: gen_options,
    $gen_params: gen_params,
    $make_url: make_url,
    $needs_new_access_token: needs_new_access_token,
    $request_new_access_token: request_new_access_token,
    $resolve: resolve,
    http_request: http_request,
    oauth2_request: oauth2_request,
    oauth_request: oauth_request
};
