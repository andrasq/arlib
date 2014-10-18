/**
 * php.date() work-alike, for most of the conversions
 *
 * 2014-10-18 - AR.
 */

'use strict';

module.exports = phpdate;
module.exports.gmdate = gmdate;

function phpdate( format, timestamp ) {
    var dt = (typeof timestamp === 'number') ? new Date(timestamp) : new Date();
    return applyFormat(format, dt);
}

function gmdate( format, timestamp ) {
    var dt = (typeof timestamp === 'number') ? new Date(timestamp) : new Date();
    var tz = tzInfo(dt);
    // FIXME: this is simplistic, a 'c' conversion would get double-shifted
    return phpdate(format, dt.getTime() + tz.offs * 60000);
}

function applyFormat( format, now ) {
    var i, output = "";
    for (i=0; i<format.length; i++) {
        var c = format[i];
        if (formatters[c]) output += formatters[c](now);
        else if (c === '\\' && ++i < format.length) output += format[i];
        else output += c;
    }
    return output;
}

function padFormat( width, number, base ) {
    'use strict';
    var s = number.toString(base ? base : 10);
    while (s.length + 2 < width) s = "00" + s;
    while (s.length < width) s = "0" + s;
    return s;
}

var formatters = {
    d: function(now){ return padFormat(2, now.getDate()); },
    D: function(now){ return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][now.getDay()]; },
    j: function(now){ return now.getDate(); },
    l: function(now){ return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][now.getDay()]; },
    h: function(now){ return padFormat(2, hour1to12(now)); },
    N: function(now){ return padFormat(2, iso8601day(now.getDay())); },          // Mon=1 .. Sun=7
    S: function(now){ return dayNumberOrdinalSuffix(now); },
    w: function(now){ return now.getDay(); },
    z: function(now){ return weekdayOffset().year; },

    // W: ISO 8601 week number of the year, weeks starting on Monday

    F: function(now){ return padFormat(2, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()]); },
    m: function(now){ return padFormat(2, now.getMonth() + 1); },
    M: function(now){ return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]; },
    n: function(now){ return padFormat(1, now.getMonth() + 1); },
    t: function(now){ return weekdayOffset(now).mdays; },

    L: function(now){ return weekdayOffset().leap; },
    // o: ISO 8601 year number
    Y: function(now){ return padFormat(4, now.getFullYear()); },
    y: function(now){ return padFormat(4, now.getFullYear() % 100); },

    a: function(now){ return now.getHours() < 12 ? "am" : "pm"; },
    A: function(now){ return now.getHours() < 12 ? "AM" : "PM"; },
    B: function(now){ return Math.floor(1000 * (new Date().getTime() % 86400000) / 86400000); },
    g: function(now){ return padFormat(1, hour1to12(now)); },
    G: function(now){ return padFormat(1, now.getHours()); },
    H: function(now){ return padFormat(2, now.getHours()); },
    i: function(now){ return padFormat(2, now.getMinutes()); },
    s: function(now){ return padFormat(2, now.getSeconds()); },
    u: function(now){ return padFormat(6, now % 1000 * 1000); },

    e: function(now){ var tz = tzInfo(now); return tz.tzname; },
    I: function(now){ var tz = tzInfo(now); return tz.isDst ? 1 : 0; },
    O: function(now){ var tz = tzInfo(now); return tz.sign + padFormat(2, tz.h) + padFormat(2, tz.m); },
    P: function(now){ var tz = tzInfo(now); return tz.sign + padFormat(2, tz.h) + ":" + padFormat(2, tz.m); },
    T: function(now){ var tz = tzInfo(now); return tz.tz; },
    Z: function(now){ var tz = tzInfo(now); return -tz.offs * 60; },

    c: function(now){ var tz = tzInfo(now); return phpdate("Y-m-d\\TH:i:s+00:00", now.getTime() + tz.offs * 60000); },
    r: function(now){ var tz = tzInfo(now); return phpdate("D, d M Y H:i:s +0000", now.getTime() + tz.offs * 60000); },
    U: function(now){ return Math.floor(now.getTime() / 1000); },
};

function iso8601day( dayOfWeek ) {
    // convert php 0..6 Sun-Sat to ISO 1..7 Mon-Sun
    return dayOfWeek > 0 ? dayOfWeek : 7;
}

function hour1to12( now ) {
    var hour = now.getHours() % 12;
    return hour === 0 ? 12 : hour;
}

// return timezone info about the date
function tzInfo( now ) {
    var offset = now.getTimezoneOffset();
    var winterOffset = new Date(0).getTimezoneOffset();
    var west = (winterOffset > 0);
    var isDst = (offset !== winterOffset);
    var mins = Math.abs(offset) % 60;
    var hrs = (Math.abs(offset) - mins) / 60;
    var tzMap = {
        '0': ['UTC', 'UTC', 'UTC'],
        '240': ['AST', 'ADT', 'Atlantic'],
        '300': ['EST', 'EDT', 'US/Eastern'],
        '360': ['CST', 'CDT', 'US/Central'],
        '420': ['MST', 'MDT', 'US/Mountain'],
        '480': ['PST', 'PDT', 'US/Pacific'],
        // Juneau
        // Hawaii
    };
    // FIXME: only detects a few timezone abbreviations, and presumes US
    var tz = tzMap[winterOffset] ? tzMap[winterOffset][0 + isDst] : '???';
    var tzname = tzMap[winterOffset] ? tzMap[winterOffset][2] : '???';
    return {
        offs: offset,
        h: hrs,
        m: mins,
        dst: isDst,
        tz: tz,
        sign: west ? "-" : "+",
        tzname: tzname,
    };
}

// return relative offsets of the date
function weekdayOffset( now ) {
    var yr = now.getFullYear();
    var mo = now.getMonth();
    var isLeap = (yr % 4) === 0 && ((yr % 100) !== 0 || (yr % 400) === 0);

    var days = [31, 28 + isLeap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var dy;
    for (var i=0; i<mo; i++)
        dy += days[i];
    dy += now.getDate() - 1;

    return {
        leap: isLeap,
        week: now.getDay(),             // day of week, 0=Sunday
        month: now.getDate() - 1,       // day of month, 0=1st
        year: dy,                       // day of year, 0=Jan1
        mdays: days[now.getDate()-1],   // days in month
    };
}

// return st, nd, rd, or th, depending on the date
function dayNumberOrdinalSuffix( now ) {
    var date = now.getDate();
    if (date > 10 && date < 20) return 'th';
    else return ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][date % 10];
}

/*** ---------------------------------------------------------------- ***\
From php.net/manual/en/function.date.php as of 2014-09-15:

d	Day of the month, 2 digits with leading zeros	01 to 31
D	A textual representation of a day, three letters	Mon through Sun
j	Day of the month without leading zeros	1 to 31
l (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
N	ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)	1 (for Monday) through 7 (for Sunday)
S	English ordinal suffix for the day of the month, 2 characters	st, nd, rd or th. Works well with j
w	Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
z	The day of the year (starting from 0)	0 through 365
Week	---	---
W	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
Month	---	---
F	A full textual representation of a month, such as January or March	January through December
m	Numeric representation of a month, with leading zeros	01 through 12
M	A short textual representation of a month, three letters	Jan through Dec
n	Numeric representation of a month, without leading zeros	1 through 12
t	Number of days in the given month	28 through 31
Year	---	---
L	Whether it's a leap year	1 if it is a leap year, 0 otherwise.
o	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
Y	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
y	A two digit representation of a year	Examples: 99 or 03
Time	---	---
a	Lowercase Ante meridiem and Post meridiem	am or pm
A	Uppercase Ante meridiem and Post meridiem	AM or PM
B	Swatch Internet time	000 through 999
g	12-hour format of an hour without leading zeros	1 through 12
G	24-hour format of an hour without leading zeros	0 through 23
h	12-hour format of an hour with leading zeros	01 through 12
H	24-hour format of an hour with leading zeros	00 through 23
i	Minutes with leading zeros	00 to 59
s	Seconds, with leading zeros	00 through 59
u	Microseconds (added in PHP 5.2.2). Note that date() will always generate 000000 since it takes an integer parameter, whereas DateTime::format() does support microseconds.	Example: 654321
Timezone	---	---
e	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
I (capital i)	Whether or not the date is in daylight saving time	1 if Daylight Saving Time, 0 otherwise.
O	Difference to Greenwich time (GMT) in hours	Example: +0200
P	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
T	Timezone abbreviation	Examples: EST, MDT ...
Z	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
Full Date/Time	---	---
c	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
r	» RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
U	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()
\*** ---------------------------------------------------------------- ***/


// quick test:
/**

var timeit = require('./timeit');
var moment = require('moment');

console.log(phpdate("c"));

var s;
//timeit(100000, function() { s = new Date().toISOString() });
//console.log(s);
// 850k/s

timeit(100000, function() { s = phpdate("Y-m-d H:i:s.u T"); });
console.log(s);
// 107k/s sprintf(), 340k/s padFormat() switch, 435/s external dispatch table split out functions,
// w/o .u microseconds 550k/s

//timeit(100000, function() { s = phpdate("c"); });
//console.log(s);
// 265k/s

//timeit(40000, function() { s = moment.utc().format() });
//console.log(s);
// 150k/s

// php:
// % timeit php -r 'for ($i=0; $i<100000; ++$i) $x = date("Y-m-d H:i:s\n"); echo $x;'
// 2014-10-17 23:37:34
// 1.1040u 0.0040s 00:1.11033 99.79%        0+11812k 0+0io 0pf+0w
// ie 90k/s

/**/
