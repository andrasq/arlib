/**
 * Export all components in arlib, or require them by name.
 */
module.exports = {
    tempnam: require('./tempnam.js'),
    getopt: require('./getopt.js'),
    nextopt: require('./getopt.js').nextopt,
    // mongoid has been moved into its own package
    mongoid: require('mongoid-js').mongoid,
    MongoId: require('mongoid-js').MongoId,
    phpdate: require('./phpdate.js'),
    str_repeat: require('./lib/str_repeat.js'),
    timeit: require('./lib/timeit.js'),
    http_build_query: require('./http_build_query.js'),
    http_parse_query: require('./http_parse_query.js'),
    urldecode: require('./http_parse_query.js').urldecode,
    getrusage: require('./getrusage'),
    fptime: require('./fptime'),

/***
    // FIXME: either remove passthrough or make fgets/fputs a dependency
    // pass-through includes from related packages (must be installed separately)
    Fgets: require('qfgets'),
    FileReader: require('qfgets').FileReader,
    Fputs: require('qfputs'),
    FileWriter: require('qfputs').FileWriter,
***/
};
