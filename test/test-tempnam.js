/**
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

fs = require('fs');
tempnam = require('../tempnam');

module.exports = {
    'tempnam.uniqid should return a unique id': function(t) {
        var a, b;
        a = tempnam.uniqid('x');
        b = tempnam.uniqid('x');
        t.equals(a[0], 'x');
        t.ok(a != b);
        t.done();
    },

    'returns error if unable to create file': function(t) {
        tempnam("/nonesuch", function(err, filename) {
            t.ok(err, "should signal error if unable to access");
            t.done();
        });
    },

    'creates file in the specified directory with given prefix': function(t) {
        var dir = "/tmp";
        var prefix = "tempnam-test";
        var fd;
        tempnam(dir, prefix, function(err, filename) {
            // FIXME: on error, nodeunit wrongly passes the ifError() test,
            // then dies on the exception from unlink (could not create err)
            t.ifError(err);
            t.ok(fd = fs.openSync(filename, 'r'), "file should exist");
            fs.unlinkSync(filename);
            fs.closeSync(fd);
            t.equals(dir + "/" + prefix, filename.slice(0, dir.length + 1 + prefix.length));
            t.done();
        });
    },

    'different calls create different filenames': function(t) {
        tempnam("/tmp", "maketemp-test", function(err, file1) {
            t.ifError(err);
            tempnam("/tmp", "maketemp-test", function(err, file2) {
                t.ifError(err);
                t.notEqual(file1, file2);
                fs.unlinkSync(file1);
                fs.unlinkSync(file2);
                t.done();
            });
        });
    },
};
