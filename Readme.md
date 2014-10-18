# arlib

### Andras' Library of Handy Utilities

This is a placeholder for some of the code I've been working on
that I want easy access to.  Feel free to browse and use!

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
        var mongoid = require('arlib').mongoid;
        id = mongoid();                 // 543f376340e2816497000001
        id = mongoid();                 // 543f376340e2816497000002

        // id factory, configured for the unique system identifier 1
        var MongoId = require('arlib').MongoId;
        var idFactory = new MongoId(1);
        id = idFactory.fetch();         // 543f3789000001649f000001
        id = idFactory.fetch();         // 543f3789000001649f000002

### Fgets

synchronous line-at-a-time stream reader.  Returns the next buffered
line or the empty string "" if the buffer is currently empty.  3x faster
than require('readline'), and works like C fgets(), it doesn't modify
the input.  Note: the caller must periodically yield with setImmediate
or setTimeout to allow the buffer to fill.

NOTE: Fgets is being split out of arlib as its own module [qfgets](https://www.npmjs.org/package/qfgets).

#### fgets( )

        var fs = require('fs');
        var Fgets = require('arlib').Fgets;
        var fp = new Fgets(fs.createReadStream('/etc/motd', 'r'));
        // line = fp.fgets();

#### feof( )

returns true when fgets has no more lines to return

        var Fgets = require('arlib').Fgets;
        var fp = new Fgets('/etc/motd');        // use buit-in FileReader
        var contents = "";
        (function readfile() {
            for (var i=0; i<40; i++) contents += fp.fgets();
            if (!fp.feof()) setImmediate(readfile);     // yield periodically
        })();

#### FileReader

fast file reader to feed data to fgets.  A smidge faster than a read stream
created with a reasonable highWaterMark (50% faster than a stream created with
defaults)

        var FileReader = require('arlib').FileReader;
        var fp = new Fgets(new FileReader('/etc/motd'));
        // line = fp.fgets();

### phpdate( format, timestamp )

return a formatted date string like PHP's date() does.  Supports most of the
conversions (but not the ISO-8601), though timezone and localization support
is rather lacking.  North America timezones should work.

See [php's date](http://php.net/manual/en/function.date.php) for the list of
supported conversions.  Of them, W and o are not implemented.

                phpdate('Y-m-d H:i:s.u T');     // 2014-10-18 04:56:53.437000 EDT

### str_repeat( string, count )

return the string concatenated with itself count times

                str_repeat("x", 5);             // "xxxxx"

### timeit( count, function, [message], [callback] )

run the function count + 1 times, and print the run timings to the console.
If function is a string it will be eval-d.  The function under test is run
once to compile it (and not include the cost of compilation in the timings),
then count times back-to-back for the benchmark.

        timeit = require('./timeit');
        var fs = require('fs');
        function opencloseSync() { var fd = fs.openSync('/etc/motd', 'r'); fs.closeSync(fd); }
        timeit(10000, function(){ opencloseSync(); });
        // AR: "function (){ opencloseSync(); }": 10000 loops in 0.0210 sec:  475221.68 / sec, 0.00210 ms each

        function openclose(cb) { fs.open('/etc/motd', 'r', function(err, fd) { cb(fd); }); }
        timeit(10000, function(cb){ openclose(function(){ cb(); }); }, "async open/close:", function(){ });
        // async open/close: "function (cb){ openclose(function(){ cb(); }); }": 10000 loops in 0.2396 sec:  41740.64 / sec, 0.02396 ms each
