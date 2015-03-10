arlib
=====


## Andras' Library of Handy Utilities

This is a placeholder for some of the code I've been working on
that I want easy access to.  Feel free to browse and use!

Note: [qfgets](https://www.npmjs.org/package/qfgets) which first appeared here
was moved into its own package.


### Installation

        npm install arlib
        npm test arlib

## Contents

The components are all available with `require('arlib')` as eg
`require('arlib').tempnam`, or separately with eg `require('arlib/tempnam')`.


### tempnam( [directory], [prefix], callback(err, filename) )

`tempnam` from the [tempnam](https://www.npmjs.org/package/tempnam) package.

[php tempnam](http://php.net/manual/en/function.tempnam.php)
equivalent, creates a filename that does not exist on the
system.  Like php, it also creates the file to prevent the name from
being reused.  The default directory is process.env.TMPDIR (else /tmp),
and the default prefix is the empty string.

        var tempnam = require('arlib/tempnam');
        tempnam("/tmp", "my-prefix-", function(err, filename) {
            // => /tmp/my-prefix-a7259b
        });

For full details, please see the package.  Tempnam was originally published
here, but was split out into its own package in arlib version 0.2.5.


### getopt( argv, optspec )

traditional unix command option extractor, returns an object with the options
set as properties.  Like traditional unix, getopt only checks for option
switches at the beginning of the argument list, before non-switch arguments.
It recognizes '-' as a filename and '--' as the special marker that stops
further argument scanning.

        var getopt = require('arlib/getopt').getopt;
        var options = getopt(process.argv, "f:h");
        // { f: 'filename', h: true }
        var options = getopt(process.argv, "(-file):(-help)");
        // {file: 'filename', help: true}


### mongoid( ), new MongoId().fetch( )
### MongoId.getTimestamp( idString )
### MongoId.parse( idString )

`mongoid` from the [mongoid-js](https://www.npmjs.org/package/mongoid-js) package.

very fast, light-weight mongodb compatible timestamped unique id
generator.  Can be used as a convenience function to return unique-ish
(random) ids, or as an id factory configured with a unique system id
to return locale-specific guaranteed unique ids.

The mongoid functionality of arlib was made into separate package, arlib
now includes it as a dependency.
See [mongoid-js](https://www.npmjs.org/package/mongoid-js) for details.


### phpdate( format, [timestamp] )

`phpdate` from the [phpdate-js](htts://www.npmjs.org/package/phpdate-js) package.

return a formatted date string like PHP's date() does.  Supports all the php
conversions, though timezone and localization support is very basic.  North
America timezones should work.

See php's [date](http://php.net/manual/en/function.date.php) for the list of
supported conversions.  As of phpdate-js 1.0.0, all documented conversions are
supported and work identically to php.

Format is the conversion specification.  Each character is a time element spec
or a literal.  Backslash escaping inserts a literal instead of the converted
time element.  The timestamp is either a JavaScript millisecond timestamp
or a Date object.  If omitted, the current time `Date.now()` is used.

        var phpdate = require('arlib/phpdate');
        phpdate('Y-m-d H:i:s.u T');     // 2014-10-18 04:56:53.437000 EDT

        var gmdate = require('arlib/phpdate').gmdate;
        gmdate('Y-m-d H:i:s.u T');      // 2014-10-18 08:56:53.438000 GMT

[Phpdate](htts://www.npmjs.org/package/phpdate-js), originally included as
part of arlib, was made into a separate package.  Arlib now includes it as a
dependency.


### str_repeat( string, count )

return the string concatenated with itself count times.
See php's [str_repeat](http://php.net/manual/en/function.str-repeat.php)

        var str_repeat = require('arlib/str_repeat');
        str_repeat("x", 5);             // "xxxxx"


### timeit( count, function, [message], [callback] )

run the function count + 1 times, and print the run timings to the console.
If function is a string it will be eval-d.  The function under test is run
twice to compile it (and not include the cost of compilation in the timings)
and prime the node optimizer,
then count times back-to-back for the benchmark.

        var timeit = require('arlib/timeit');
        var fs = require('fs');

        function opencloseSync() {
            var fd = fs.openSync('/etc/motd', 'r');
            fs.closeSync(fd);
        }
        timeit(10000, function(){ opencloseSync(); });
        // AR: "function (){ opencloseSync(); }": 10000 loops in 0.0210 sec:  475221.68 / sec, 0.00210 ms each

        function opencloseAsync(cb) {
            fs.open('/etc/motd', 'r', function(err, fd) {
                if (err) throw err;
                fs.close(fd, function(err) { cb(fd); });
            });
        }
        timeit(10000, function(cb){ opencloseAsync(function(){ cb(); }); }, "async open/close:", function(){ });
        // async open/close: "function (cb){ opencloseAsync(function(){ cb(); }); }": 10000 loops in 0.2890 sec:  34598.11 / sec, 0.02890 ms each


### timeit.fptime( )

nanosecond-resolution floating-point timestamp from process.hrtime().  The
timestamp returned does not have an absolute meaning (on Linux, it's uptime(1),
the number of seconds since the last boot), but differeces between timestamp
are accurate -- a difference of 1.00 is 1 elapsed second.  The overhead is as
low as .6 microseconds per call, about 3x slower than Date.now().

        var fptime = require('arlib/timeit').fptime
        var t1 = fptime();      // 1809688.215437152
        var t2 = fptime();      // 1809688.215462518
        var t3 = fptime();      // 1809688.215466353
        // 25.4 usec for the first call, 3.84 for the second
        // uptime of 20 days, 22:40 hours


### http_build_query( queryParams, [options] )

`http_build_query` from the [qhttp](https://www.npmjs.org/package/qhttp) package.

format a query string like PHP's [http_build_query](http://php.net/manual/en/function.http-build-query.php).
In particular, it handles nested objects and nested arrays.

This function was moved and is now republished from the
[qhttp](https://www.npmjs.org/package/qhttp) package.  Please see qhttp
for details.

        var http_build_query = require('arlib/http_build_query');
        var params = {a: 1, b: 2, c: [3, 4, [5, 6]]};
        var queryString = http_build_query(params, {leave_brackets: true});
        // => "a=1&b=2&c[0]=3&c[1]=4&c[2][0]=5&c[2][1]=6"


### http_parse_query( string )

`http_parse_query` from the [qhttp](https://www.npmjs.org/package/qhttp) package.

build up the parameters hash from the PHP-style query string.  Parses
name-value pairs as expected, `a=1&b=2` is `{a:1, b:2}`.  names value-less
names as if set to one, i.e. `a&b` becomes {a:1, b:1}.  Unlike PHP, gathers
repeated parameters into arrays (e.g., `a=1&a=2` is `{a: [1, 2]}` and not a=2.
Like PHP, parses hierarchical values like `a[i][j]=1` into `{a: {i: {j:1}}}`.

This function was moved and is now replushed from the
[qhttp](https://www.npmjs.org/package/qhttp) package.  Please see qhttp
for details.

        var http_parse_query = require('arlib/http_parse_query');
        var params = http_parse_query("a=1&b=2&c[0]=3&c[1]=4&c[2][0]=5");
        // => {a:1, b:2, c:{'0':3, '1':4, '2':{'0':5}}}


### getrusage

the unix `getrusage(2)` system call, from the
[qrusage](https://www.npmjs.org/package/qrusage) package.  See the package for
details.  The fields names have the ru_ stripped, and the struct timevals are
combined into floating-point time values.

        var getrusage = require('arlib/getrusage');
        var usage = getrusage();


### fptime

`fptime` from the [qrusage](https://www.npmjs.org/package/qrusage) package

the current microsecond precision timestamp as a floating point number.
Analogous to the `time(2)` system call (implemented with `gettimeofday(2)`).
Also from the [qrusage](https://www.npmjs.org/package/qrusage) package.

        var fptime = require('arlib/fptime');
        var timestamp = fptime();

## Todo

- split out getopt into its own package
- republish qunit.printf
