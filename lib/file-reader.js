/**
 * fast file reader to feed data to Fgets
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2014-09-13 - AR.
 */

module.exports = FileReader;

fs = require('fs');

function FileReader( filename ) {
    'use strict';

    if (!this instanceof FileReader) return new FileReader(filename);

    this.filename = filename;
    this.fd = null;
    // use a large enough buffer to capture large payloads too
    this.buf = new Buffer(409600);
    this.str = "";
    this.read = function() { return null; };

    var self = this;
    fs.open(filename, 'r', function(err, fd) {
        if (err) throw err;
        self.fd = fd;

        self.read = function(limit) {
            limit = limit > 0 ? Math.min(limit, self.buf.length) : self.buf.length;
            // faster to not start a second read while the first is in progress
            if (self._reading) return null;
            self._reading = true;
            fs.read(self.fd, self.buf, 0, limit, null, function(err, nBytes, buffer) {
                self._reading = false;
                if (err) throw err;
                self.str += buffer.toString();
            });
            var ret = self.str;
            self.str = "";
            return ret;
        };
    });

    // streams-like pause and resume stubs, for fgets plug-in compatibility
    this.pause = function() { };
    this.resume = function() { };
    this.on = function() { };
}
