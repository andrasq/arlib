/**
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

getopt = require('../getopt').getopt;

module.exports = {
    'should return option': function(t) {
        var opts = getopt("nodejs script.js -v arg1 arg2", "v");
        t.ok(opts.v);
        t.done();
    },

    'should return option param': function(t) {
        var opts = getopt("nodejs script.js -a foo arg1 arg2", "a:");
        t.equal(opts.a, 'foo');
        t.done();
    },

    'should return option param as string': function(t) {
        var opts = getopt("nodejs script.js -a 012 arg1 arg2", "a:");
        t.equal(opts.a, '012');
        t.done();
    },

    'should return option double param': function(t) {
        var opts = getopt("nodejs script.js -a 12 34 arg1 arg2", "a::");
        t.deepEqual(opts.a, [12, 34]);
        t.done();
    },

    'should set and return multiple options': function(t) {
        var opts = getopt("nodejs script.js -a 12 -b 34 56 -c 78", "a:b::c");
        t.equal(opts.a, 12);
        t.deepEqual(opts.b, [34, 56]);
        t.ok(opts.c);
        t.equal(opts._argv[0], 78);
        t.done();
    },

    'should not scan past non-switch argument': function(t) {
        var opts = getopt("nodejs script.js arg1 -a 12", "a:");
        t.ok(!opts.a);
        t.equal(opts._argv[0], 'arg1');
        t.done();
    },

    'should not scan past --': function(t) {
        var opts = getopt("nodejs script.js -- -a 12", "a:");
        t.equal(opts._argv[0], '-a');
        t.done();
    },

    'should return boolean for yes/no option': function(t) {
        var opts = getopt("nodejs script.js -h", "h");
        t.equal(opts.h, true);
        t.equal(typeof opts.h, 'boolean');
        t.done();
    },

    'should return count for repeated yes/no option': function(t) {
        var opts = getopt("nodejs script.js -h -h", "h");
        t.equal(opts.h, 2);
        t.equal(typeof opts.h, 'number');
        t.done();
    },

    'should throw error for unrecognized option': function(t) {
        try { var opts = getopt("nodejs script.js -x", "vc"); t.ok(false, "expected error"); }
        catch (err) { t.ok(true); }
        t.done();
    },
};
