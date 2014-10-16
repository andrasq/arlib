# arlib

### Andras' Library of Handy Utilities

This is a placeholder for some of the code I've been working on
that I want easy access to.  Feel free to browse and use!

## Contents

The components are all available with `require('arlib')`, or each component
is loadable separately with eg `require('arlib/tempnam')`.

### tempnam

php tempnam equivalent, creates a filename that does not exist on the
system.  Like php, it also creates the file to prevent the name from
being reused.

        var tempnam = require('arlib/tempnam');
        var filename = tempnam("/usr/tmp", "filename-prefix-");
        // /usr/tmp/filename-prefix-a7259b

### getopt

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

### mongoid

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


        var fs = require('fs');
        var Fgets = require('arlib').Fgets;
        var fp = new Fgets(fs.createReadStream('/etc/motd', 'r'));
        // line = fp.fgets();

#### feof

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
created with a reasonable highWaterMark (50% faster than with defaults)

        var FileReader = require('arlib').FileReader;
        var fp = new Fgets(new FileReader('/etc/motd'));
        // line = fp.fgets();
