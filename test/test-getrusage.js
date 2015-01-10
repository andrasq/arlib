var getrusage = require('../getrusage');

module.exports = {
    'should export getrusage': function(t) {
        t.equal(typeof getrusage, 'function');
        t.done();
    },

    'getrusage should return usage': function(t) {
        var usage = getrusage();
        t.ok(usage.utime);
        t.ok(usage.stime);
        t.done();
    },
};
