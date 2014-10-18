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
assert = require('assert');
console.log(str_repeat("x", 45));
for (i=0; i<1277; i++) assert(str_repeat("x", i).length === i, i + ": not same");

timeit = require('./timeit');
//timeit(100000, function(){ str_repeat("x", 99); });
// 110k/s singly, 3.3m/s by 4s, 6m/s by 10s then 4s
timeit(1000000, function(){ str_repeat("x", 40); });

/**/
