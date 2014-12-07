'use strict';

var debug = require('debug'),
    counter = 0;

function test(promise, handler) {
    var log, timeout;

    log = debug('test:integration:' + (++counter));
    timeout = setTimeout(function () {
        log(new Error('timeout reached'));
        process.exit(1);
    }, 1000 * 30);

    log('waiting for response');
    return promise
        .then(function () {
            clearTimeout(timeout);
            handler.apply({}, arguments);
        })
        .catch(function (err) {
            log(err);
            process.exit(1);
        });
}

module.exports = {
    test: test
};
