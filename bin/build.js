
var sh = require( 'shelljs' );
var addFiles = require( './add-files' );

function buildSync() {
  sh.cd( __dirname + '/..' );
  addFiles();
  sh.exec( 'component build -d' );
}

// TODO: Async build
exports.express = function( options ) {
  return function( req, res, next ) {
    buildSync();
    next();
  }
}

if ( require.main === module ) {
  buildSync();
}
