var phpdate = require('../phpdate.js');
var gmdate = require('../phpdate.js').gmdate;

module.exports = {
    'should format date': function(t) {
        var str = gmdate('Y-m-d H:i:s', 2000000000000);
        t.equal(str, '2033-05-18 03:33:20');
        t.done();
    },
};
