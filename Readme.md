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

traditional unix command option extractor, returns an object with
the options set as properties.

        var getopt = require('arlib/getopt').getopt;
        var options = getopt(process.argv, "f:h");
        // {f: 'filename', h: true}
        var options = getopt(process.argv, "(-file):(-help)");
        // {file: 'filename', help: true}

### Fgets

synchronous line-at-a-time stream reader.  Returns the next buffered line
or the empty string "" when the buffer is empty.

        var fs = require('fs');
        var Fgets = require('arlib').Fgets;
        var fp = new Fgets(fs.createReadStream(filename, 'r'));
        // line = fp.fgets();

#### FileReader

fast file reader to fee data to fgets, 30% faster than read streams.

        var FileReader = require('arlib').FileReader;
        var fp = new Fgets(new FileReader(filename));
        // line = fp.fgets();
