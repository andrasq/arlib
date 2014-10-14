/**
 * fgets - line buffered stream input
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2014-09-13 - AR.
 */

module.exports = Fgets;

var fs = require('fs');
//var util = require('util');                           // TBD
//var EventEmitter = require('events').EventEmitter;    // TBD
var FileReader = require('./file-reader');

/**
 * line-at-a-time stream reader
 */
function Fgets( stream ) {
    'use strict';
    //EventEmitter.call(this);                          // TBD

    if (typeof stream === 'string') stream = new FileReader(stream);
    stream.pause();

    this.fp = stream;
    this._readbuf = "";
    this._readoffset = 0;
}
//util.inherits(Fgets, EventEmitter);                   // TBD

/**
 * return the next newline-terminated line from the stream,
 * or return an empty string.
 */
Fgets.prototype.fgets = function fgets( ) {
    var eol = this._readbuf.indexOf("\n", this._readoffset);
    if (eol >= 0) {
        return this._readbuf.slice(this._readoffset, this._readoffset = eol + 1);
    }
    else {
        this._fillbuf();
        return "";
    }
};

Fgets.prototype._fillbuf = function _fillbuf( ) {
    if (this._readoffset > 0) {
        // discard the consumed data, retain the unread
        this._readbuf = this._readbuf.slice(this._readoffset);
        this._readoffset = 0;
    }
    var data = this.fp.read();
    if (data) this._readbuf += data.toString();
};
