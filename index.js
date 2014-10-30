/**
 * Export all components in arlib, or require them by name.
 */
module.exports = {
    tempnam: require('./tempnam.js'),
    getopt: require('./getopt.js'),
    nextopt: require('./getopt.js').nextopt,
    mongoid: require('./mongoid.js').mongoid,
    MongoId: require('./mongoid.js').MongoId,
    phpdate: require('./lib/phpdate.js'),
    str_repeat: require('./lib/str_repeat.js'),
    timeit: require('./lib/timeit.js'),
    http_build_query: require('./lib/http_build_query.js'),

/***
    // FIXME: either remove passthrough or make fgets/fputs a dependency
    // pass-through includes from related packages (must be installed separately)
    Fgets: require('qfgets'),
    FileReader: require('qfgets').FileReader,
    Fputs: require('qfputs'),
    FileWriter: require('qfputs').FileWriter,
***/
};
