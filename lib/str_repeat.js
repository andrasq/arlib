/**
 * str_repeat() a la php
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2014-09-07 - AR.
 */

module.exports = str_repeat;

function str_repeat( s, n ) {
    'use strict';
    var ret = "";

    s = s + "";

    if (n > 40) {
        var s10 = "" + s + s + s + s + s + s + s + s + s + s;
        while (n >= 10) { ret += s10; n -= 10; }
    }

    if (n > 16) {
        var s4 = "" + s + s + s + s;
        while (n >= 4) { ret += s4; n -= 4; }
    }

    while (n-- > 0) { ret += s; }

    return ret;
}

// quick test:
/**

function str_repeat2( input, multiplier ) {
    // recursive str_repeat is 8% faster for %02, 32% faster for %08:
    if (multiplier < 3) {
        if (multiplier < 1) return ""
        if (multiplier < 2) return input
        return input + input
    }
    var half = (multiplier - (multiplier & 1)) >>> 1
    var halfPad = str_repeat(input, half)
    return (multiplier & 1) ? (halfPad + halfPad + input) : (halfPad + halfPad)
}

assert = require('assert');
console.log(str_repeat("x", 45));
for (i=0; i<1277; i++) assert(str_repeat("x", i).length === i, i + ": not same");

timeit = require('./timeit');
//timeit(100000, function(){ str_repeat("x", 99); });
// 110k/s singly, 3.3m/s by 4s, 6m/s by 10s then 4s
timeit(1000000, function(){ str_repeat("x", 40); });

for (var i=2; i<40; i+=4) {
    timeit(1000000, function(){ str_repeat("x", i); });
    timeit(1000000, function(){ str_repeat("x", i); });
    timeit(1000000, function(){ str_repeat2("x", i); });
    timeit(1000000, function(){ str_repeat2("x", i); });
    console.log("")
}

/**/
