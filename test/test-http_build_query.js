/**
 * Copyright (C) 2015 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

var http_build_query = require('../http_build_query');

module.exports = {
    'should export by name and aggregate': function(t) {
        var h1 = require('../http_build_query');
        var h2 = require('../index').http_build_query;
        t.equal(h1, h2);
        t.equal(typeof h1, 'function');
        t.done();
    },
};
