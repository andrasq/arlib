var getrusage = require('../getrusage');

module.exports = {
    'should export getrusage': function(t) {
        t.equal(typeof getrusage, 'function');
        t.done();
    },

    'getrusage should return usage': function(t) {
        var usage = getrusage();
        t.ok(usage.utime > 0);
        t.ok(usage.maxrss > 0);
        t.ok(usage.minflt > 0);
        t.done();
    },
};
