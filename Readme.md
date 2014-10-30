# arlib

### Andras' Library of Handy Utilities

This is a placeholder for some of the code I've been working on
that I want easy access to.  Feel free to browse and use!

Note: [qfgets](https://www.npmjs.org/package/qfgets) which first appeared here
was moved into its own package.

## Contents

The components are all available with `require('arlib')`, or each component
is loadable separately with eg `require('arlib/tempnam')`.

### tempnam( [directory], [prefix] )

php tempnam equivalent, creates a filename that does not exist on the
system.  Like php, it also creates the file to prevent the name from
being reused.

        var tempnam = require('arlib/tempnam');
        var filename = tempnam("/usr/tmp", "filename-prefix-");
        // /usr/tmp/filename-prefix-a7259b

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

very fast, light-weight mongodb compatible timestamped unique id
generator.  Can be used as a convenience function to return unique-ish
(random) ids, or as an id factory configured with a unique system id
to return locale-specific guaranteed unique ids.

        // convenience function, picks a random system id
        var mongoid = require('arlib/mongoid');
        id = mongoid();                 // 543f376340e2816497000001
        id = mongoid();                 // 543f376340e2816497000002

        // id factory, configured for the system identifier 4656 (0x001230)
        var MongoId = require('arlib/mongoid').MongoId;
        var idFactory = new MongoId(4656);
        id = idFactory.fetch();         // 543f3789001230649f000001
        id = idFactory.fetch();         // 543f3789001230649f000002

### MongoId.getTimestamp( idString )

return the timestamp from the mongoid string in JavaScript format.
Note that JavaScript timestamps have millisecond precision, but mongoid
only stores seconds precision, so the last 3 digits will be 000.

        MongoId.getTimestamp("543f3789001230649f000001")
        // => 1413429129000

#### MongoId.parse( idString )

return the mongoid string split into its component fields.
For example, "5451a297f7e0f13c3a000001" parses to `{ timestamp: 1414636183,
machineid: 16244977, pid: 15418, sequence: 1 }`

Note that the timestamp field is a Unix timestamp (seconds since epoch),
while getTimestamp() return a JavaScript timestamp (milliseconds since epoch).

### phpdate( format, timestamp )

return a formatted date string like PHP's date() does.  Supports most of the
conversions (but not the ISO-8601), though timezone and localization support
is rather lacking.  North America timezones should work.

See php's [date](http://php.net/manual/en/function.date.php) for the list of
supported conversions.  Of the conversions as of 2014-09-15 (php 5.1.0),
W and o are not yet implemented.

        var phpdate = require('arlib/phpdate');
        phpdate('Y-m-d H:i:s.u T');     // 2014-10-18 04:56:53.437000 EDT

### str_repeat( string, count )

return the string concatenated with itself count times.
See php's [str_repeat](http://php.net/manual/en/function.str-repeat.php)

        var str_repeat = require('arlib/str_repeat');
        str_repeat("x", 5);             // "xxxxx"

### timeit( count, function, [message], [callback] )

run the function count + 1 times, and print the run timings to the console.
If function is a string it will be eval-d.  The function under test is run
once to compile it (and not include the cost of compilation in the timings),
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

### http_build_query( objectOrArray, options )

format a query string like PHP's [http_build_query](http://php.net/manual/en/function.http-build-query.php).
In particular, it handles nested objects and nested arrays.

        var http_build_query = require('arlib/http_build_query');
        var params = {a: 1, b: 2, c: [3, 4, [5, 6]]};
        var queryString = http_build_query(params, {leave_brackets: true});
        // => "a=1&b=2&c[0]=3&c[1]=4&c[2][0]=5&c[2][1]=6"

        var params = {d: {a: 1, b: 2, c: {a: 1, b: 2}}};
        var queryString = http_build_query(params, {leave_brackets: true});
        // => "d[a]=1&d[b]=2&d[c][a]=1&d[c][b]=2"

        var params = [1, 2, 3];
        var queryString = http_build_query(params, {numeric_prefix: 'idx'});
        // => "idx0=1&idx1=2&idx2=3"

options:

        arg_separator   '&'
        eq_sign         '='
        numeric_prefix  string to prepend to numeric keys
        encoding        'PHP_QUERY_RFC1738' (default) - encode spaces as '+'
                        'PHP_QUERY_RFC3986' - encode spaces as '%20'
        leave_brackets  encode {a:[3]} as "a[0]=3" and not "a%5B0%5D=3"
