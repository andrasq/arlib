phpdate = require('../index').phpdate;

module.exports = {
    setUp: function(done) {
        this.now = Date.now();
    },

    'should return the year': function(t) {
        var str = phpdate('Y', 86400000);
        t.equal('1970', str);
        t.done();
    },

    // TODO: lots more tests
};
