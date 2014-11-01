/**
 * High-resolution function call timer.
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * Notes:
 *   - the very first time a function is call takes the hit to compile it, is slow
 *   - the very first timed loop in a run shows lower performance than the others
 *     (perhaps due to linux /sys/devices/system/cpu/cpufreq/ondemand/up_threshold)
 *   - node seems to run faster if helper functions are file-level and not inlined
 *
 * 2014-07-01 - AR.
 */

'use strict';


module.exports = timeit;
module.exports.reportit = reportit;
module.exports.fptime = fptime;

function fptime() {
    var t = process.hrtime();
    return t[0] + t[1] * .000000001;
}

// 0.01357 => 0.014
function formatFloat( value, decimals ) {
    var power = 1;
    // convert to fixed-point, make string, and insert decimal point
    for (var i = 0; i < decimals; i++) power *= 10;
    var digits = Math.floor(value * power + .5).toString();
    while (digits.length <= decimals) digits = "0" + digits;
    return digits.slice(0, -decimals) + '.' + digits.slice(-decimals);
}

// print run timing results
function reportit( f, nloops, __duration, msg ) {
    var __rate = nloops/__duration;
    var m1 = (msg ? msg+" " : "")
    console.log(
        (msg ? msg+" " : "") + '"' + f + '"' + ":",
        nloops, "loops in",
        formatFloat(__duration, 4), "sec: ",
        formatFloat(__rate, 2), "/ sec,",
        formatFloat(__duration/nloops*1000, 5), "ms each"
    );
};

function dummy( ) { }

var __timerOverhead;
function calibrate( ) {
    // timer overhead is ~ 1/100k sec, that throws off some timings
    var i, t1, t2;
    t1 = fptime();
    for (i=0; i<100; i++) t2 = fptime();
    __timerOverhead = (t2 - t1) / 100;
    // the call overhead is 1 part in 50m, we dont try to correct for that
}

function timeit( nloops, f, msg, callback ) {
    var __i, __fn = (typeof f === 'function' ? f : Function(f));
    var __t1, __t2;
    if (typeof msg === 'function') { callback = msg; msg = undefined; }

    if (__timerOverhead === undefined) calibrate(nloops);

    if (!callback) {
        // node v0.11.x strongly penalizes parsing the function in the timed loop; v0.10 did not
        // run the test function once to pre-parse it
        __fn();
        __fn();

        __t1 = fptime();
        for (__i=0; __i<nloops; ++__i) {
            __fn();
        }
        __t2 = fptime();

        var __duration = (__t2 - __t1 - __timerOverhead);
        reportit(f, nloops, __duration, msg ? msg : "AR:");
    }
    else {
        // if callback is specified, chain the calls to not run them in parallel
        __fn( function() {
            var __nleft = nloops;
            var __depth = 0;
            var __t1 = fptime();
            (function __launchNext() {
                if (__nleft-- <= 0) {
                    callback();
                    __t2 = fptime();
                    var __duration = (__t2 - __t1 - __timerOverhead);
                    reportit(f, nloops, __duration, msg ? msg : "AR:");
                }
                else {
                    __fn(function() {
                        if (__depth++ > 400) { __depth = 0; setImmediate(__launchNext); }
                        else __launchNext();
                    });
                }
            })();
        });
    }
}
