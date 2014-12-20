var timeit = require('../index').timeit;

module.exports = {
    'should export two ways': function(t) {
        var m1 = require('../index').timeit;
        var m2 = require('../timeit');
        t.equal(m1, m2);
        t.done();
    },

    'should export timeit, reportit and fptime': function(t) {
        t.equal('function', typeof timeit);
        t.equal('function', typeof timeit.reportit);
        t.equal('function', typeof timeit.fptime);
        t.done();
    },

    'fptime should return floating-point monotonically increasing values': function(t) {
        var i, times = [];
        for (i = 0; i < 10000; i++) times.push(timeit.fptime());
        for (i=1; i<times.length; i++) t.ok(times[i-1] <= times[i]);
        t.done();
    },

    'timeit should time function': function(t) {
        // 150m/s for 1m, 810m/s for 10m
        timeit(1000000, function(){ }, '/* NOOUTPUT */');
        t.done();
    },

    'timeit should time functions with callback': function(t) {
        // 15m/s for 1m, 16.8m/s for 10m
        t.expect(1);
        timeit(1000000, function(cb){ cb(); }, '/* NOOUTPUT */', function(){ t.ok(1); t.done(); });
    }
};
