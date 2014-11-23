var fs = require('fs');
var tempnam = require('../tempnam.js');
var child_process = require('child_process');
var phpdate = require('../phpdate');
var gmdate = phpdate.gmdate;
var assert = require('assert');

module.exports = {
    setUp: function(done) {
        this.now = Date.now();
        this.timestamp = 315682496123;          // 1980-01-02 12:34:56.123000
        done();
    },

    'should pad to 2 places': function(t) {
        assert.equal(gmdate('m', 1), '01');
        t.done();
    },

    'should pad to 3 places': function(t) {
        assert.equal(gmdate('B', 1), '041');
        assert.equal(phpdate('B', 1), '041');
        t.done();
    },

    'should pad to 4 places': function(t) {
        // note that nodejs typesets '123' without a leading zero
        assert.equal(phpdate('Y', new Date("1/1/123")), '0123');
        t.done();
    },

    'should pad to 6 places': function(t) {
        assert.equal(phpdate('u', 1), '001000');
        t.done();
    },

    'should report on timestamp number': function(t) {
        var str = gmdate('Y-m-d', 86400000/2);
        t.equal('1970-01-01', str);
        t.done();
    },

    'should report on current time': function(t) {
        var str = phpdate('Y-m-d');
        t.equal(str.slice(0, 2), '20');
        t.equal(str.length, '2014-01-01'.length);
        t.done();
    },

    'should report on timestamp object': function(t) {
        var str = phpdate('Y-m-d', new Date(86400000/2));
        t.equal('1970-01-01', str);
        t.done();
    },

    'should format Y-m-d H:i:s.u': function(t) {
        var str = phpdate('Y-m-d H:i:s.u', 315682496123);
        t.equal('1980-01-02 12:34:56.123000', str);
        t.done();
    },

    'should format c': function(t) {
        var str = phpdate('c', 315682496123);
        t.equal('1980-01-02T12:34:56-05:00', str);
        t.done();
    },

    'fuzz test phpdate with 10k random timestamps': function(t) {
        var timestampCount = 10000;
        var formats = [
            "a A g G H i s",
            "d D j l N S w",
            "z",                // weekday offset
            "F m M n t L Y y",
            "B",                // swatch time
            "u",                // microseconds, not possible with a fixed timestamp -- php is buggy!
            "e I O P T",
            "Z",
            "c",
            "r U",
// FIXME: W and o broken still
//            "W o",

// FIXME: gmdate broken...
// FIXME: 1194147428: Sun 2007-11-04 3am, 2 hours after DST ended (changed in 2007).
// FIXME: 452052701: 1984-04-28 Sat 9pm, 3 hours before start of DST
        ];
        var i, times = [];
        // pick random dates between 1986 (500m) and 2017 (1500m)
        for (i=0; i<timestampCount; i++) times.push(Math.floor(Math.random() * 1000000000 + 500000000));
        var doneCount = 0;
        for (i in formats) {
            (function(format, i) {
                tempnam("/tmp", "nodeunit-", function(err, tempfile) {
                    if (err) throw err;
                    fs.writeFileSync(tempfile, times.join("\n") + "\n");
                    try {
                        var script =
                            'ini_set("date.timezone", "US/Eastern");' +
                            '$nlines = 0;' +
                            'while ($timestamp = fgets(STDIN)) {' +
                            '    $nlines += 1;' +
                            '    echo date("' + format + '\\n", trim($timestamp));' +
                            '}' +
                            'file_put_contents("/tmp/ar.out", "AR: nlines = $nlines\n");' +
                            '//sleep(10);' +
                            '';
                        child_process.exec("php -r '" + script + "' < " + tempfile, {maxBuffer: 100 * 1024 * 1024}, function(err, stdout, stderr) {
                            var results = stdout.split("\n");
//console.log("AR: results.length", results.length, stderr);
                            results.pop();
                            assert.equal(results.length, times.length);
                            var j;
                            for (j=0; j<times.length; j++) {
                                var php = phpdate(format, times[j]*1000);
if (php !== results[j]) console.log(format, "::", times[j], phpdate("g G   Y-m-d H:i:s", times[j]*1000), "\nPHP\n", php, "\nphp -r\n", results[j]);
                                assert.equal(php, results[j]);
                                //t.equal(phpdate(format, times[j]*1000), results[j]);
                            }
                            fs.unlink(tempfile);
                            doneCount += 1;
                            if (doneCount === formats.length) t.done();
                        });
                    }
                    catch (err) {
                        t.ok(false, "php not installed, cannot fuzz test");
                        doneCount += 1;
                        if (doneCount === formats.length) t.done();
                    }
                });
            })(formats[i], i);
        }
    },

    // TODO: lots more tests
};
