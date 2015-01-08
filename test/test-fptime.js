var fptime = require('../fptime');

module.exports = {
    'should return floating-point timestamp': function(t) {
        var tm = fptime();
        t.ok(Math.abs(tm - Date.now()/1000) < .001);
        var tm2 = fptime();
        t.ok(tm - tm % 1 > 0 || tm2 - tm2 % 1 > 0);
        t.done();
    },
};
