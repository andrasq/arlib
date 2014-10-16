/**
 * Export all components in arlib, or require them by name.
 */
module.exports = {
    tempnam: require('./tempnam.js'),
    getopt: require('./getopt.js'),
    nextopt: require('./getopt.js').nextopt,
    mongoid: require('./mongoid.js').mongoid,
    MongoId: require('./mongoid.js').MongoId,
    Fgets: require('./fgets.js'),
    FileReader: require('./lib/file-reader.js'),
};
