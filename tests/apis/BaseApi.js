'use strict';

var Aping = require('../..');

function BaseApi() {
    Aping.call(this);
}

Aping.inherits(BaseApi, Aping);
module.exports = BaseApi;
