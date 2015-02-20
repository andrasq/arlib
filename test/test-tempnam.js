/**
 * Copyright (C) 2015 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

tempnam = require('../tempnam');

module.exports = {
    'should export tempnam': function(t) {
        t.equal(typeof tempnam, 'function');
        t.done();
    },

    'should export tempnam.uniqid': function(t) {
        t.equal(typeof tempnam.uniqid, 'function');
        t.done();
    },
};
