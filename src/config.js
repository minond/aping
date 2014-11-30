'use strict';

/**
 * let's you set any config item
 * @function config
 * @param {String} namespace
 * @param {Object} conf
 */
module.exports = function config(namespace, conf) {
    return function signature(client) {
        client[ '$' + namespace ] = conf;
    };
};
