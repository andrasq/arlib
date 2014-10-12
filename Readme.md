# arlib

### Andras' Library of Handy Utilities

This is a placeholder for some of the code I've been working on
that I want easy access to.  Feel free to browse and use!

## Contents

### getopt

traditional unix command option extractor, returns an object with
the options set as properties.

        var getopt = require('arlib/getopt').getopt;
        var options = getopt(process.argv, "f:h");
        // {f: 'filename', h: true}
        var options = getopt(process.argv, "(-file):(-help)");
        // {file: 'filename', help: true}

### tempnam

php tempnam equivalent, creates a filename that does not exist on the
system.  Like php, it also creates the file to prevent the name from
being reused.

        var tempnam = require('arlib/tempnam');
        var filename = tempnam("/usr/tmp", "filename-prefix-");
        // /usr/tmp/filename-prefix-a7259b
