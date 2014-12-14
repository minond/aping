'use strict';

/**
 * lets you set any config item
 * @function config
 * @param {String} namespace
 * @param {Object} conf
 */
module.exports = function config(namespace, conf) {
    return function config_setter(client) {
        client[ '$' + namespace ] = conf;
    };
};
