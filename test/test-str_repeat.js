str_repeat = require('../index').str_repeat;

module.exports = {
    'it should be exported two ways': function(t) {
        var m1 = require('../index').str_repeat;
        var m2 = require('../str_repeat');
        t.equal(m1, m2);
        t.done();
    },

    'it should repeat a few times': function(t) {
        var i;
        for (i=0; i<=1277; i++)
            t.equal(i, str_repeat("x", i).length);
        t.done();
    },

    'it should repeat many times': function(t) {
        var i;
        for (i=1277; i<=127700; i += 1277)
            t.equal(i, str_repeat("x", i).length);
        t.done();
    },
};
