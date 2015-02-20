/**
 * Copyright (C) 2015 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

'use strict';

var http_parse_query = require('../http_parse_query');

module.exports = {
    'should export via index': function(t) {
        var indexjs = require('../index');
        t.equal(http_parse_query, indexjs.http_parse_query);
        t.equal(typeof http_parse_query, 'function');
        t.done();
    },

    'should export urldecode': function(t) {
        t.equal('function', typeof http_parse_query.urldecode);
        t.done();
    },
};
