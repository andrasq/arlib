var arlib = require('../');

module.exports = {
    'should parse package.json': function(t) {
        t.expect(1);
        var json = require('../package.json');
        t.ok(json.name);
        t.done();
    },

    'should export expected functions': function(t) {
        var expected = [
            'tempnam', 'getopt', 'nextopt', 'mongoid', 'MongoId', 'phpdate', 'str_repeat', 'timeit',
            'qhttp', 'http_build_query', 'http_parse_query', 'urldecode', 'getrusage', 'fptime',
        ];
        for (var i=0; i<expected.length; i++) {
            t.equal(typeof arlib[expected[i]], 'function', expected[i]);
        }
        t.done();
    },

    'should export expected secondary functions': function(t) {
        var arlib = require('../');
        t.equal(typeof arlib.getopt.getopt, 'function');
        t.equal(typeof arlib.getopt.nextopt, 'function');
        t.equal(typeof arlib.phpdate.gmdate, 'function');
        t.equal(typeof arlib.timeit.fptime, 'function');
        t.equal(typeof arlib.timeit.bench, 'function');
        t.equal(typeof arlib.getrusage.microtime, 'function');
        t.done();
    },
};
