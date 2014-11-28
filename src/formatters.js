'use strict';

module.exports = {
    date: {
        /**
         * new Date => 2014-11-28
         * @method iso
         * @param {Date} date
         * @return {String}
         */
        iso: function (date) {
            return date.toISOString()
                .split('T')
                .shift();
        }
    }
};
