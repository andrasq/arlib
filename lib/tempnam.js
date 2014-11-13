/**
 * tempnam -- create a temporary file with a unique name
 *
 * Works like php tempnam(), it returns the pathname of a newly created file.
 * This filepath is guaranteed to not be returned by another tempnam() call
 * until it is removed.  The caller must delete any unneeded files.
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2014-09-23 - AR.
 */

fs = require('fs');

module.exports = tempnam;
tempnam.uniqid = uniqid;

function uniqid( prefix ) {
    prefix = prefix || "";
    return prefix + Math.floor(Math.random() * 0x1000000).toString(16);
}

function tempnam( directory, prefix, callback ) {
    'use strict';

    if (!callback) {
        if (typeof prefix === 'function') { callback = prefix; prefix = null; }
        else if (typeof directory === 'function') { callback = directory; prefix = directory = null; }
    }

    directory = directory || process.env.TMPDIR || process.env.TEMP || process.env.TMP || "/tmp";
    prefix = prefix || "";

    // TODO: allow synchronous use: if called without a callback,
    // return fs.openSync(pathname) or expose thrown Error
    if (!callback) throw new Error("callback required");

    var pathname = directory + "/" + uniqid(prefix);
    fs.open(pathname, "wx+", parseInt("0666", 8), function(err, fd) {
        if (!err) {
            fs.close(fd);
            return callback(null, pathname);
        }
        else if (err.message.indexOf('EEXIST, ') === 0) {
            return tempnam(directory, prefix, callback);
        }
        else {
            return callback(err);
        }
    });
}
