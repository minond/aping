'use strict';

var merge = require('lodash-node/modern/objects/merge');

/**
 * lets you modify a request before it goes out
 * @function reqmod
 * @param {Object} extras
 * @return {Function(Aping)}
 */
module.exports = function reqmod(extras) {
    return function (client) {
        client.on('options', function (req) {
            merge(req, extras);
        });
    };
};
