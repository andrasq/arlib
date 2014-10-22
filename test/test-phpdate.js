phpdate = require('../index').phpdate;

module.exports = {
    setUp: function(done) {
        this.now = Date.now();
        this.timestamp = 315682496123;          // 1980-01-02 12:34:56.123000
        done();
    },

    'should report on timestamp number': function(t) {
        var str = phpdate('Y-m-d', 86400000/2);
        t.equal('1970-01-01', str);
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

    // TODO: lots more tests
};
