
var sh = require( 'shelljs' );

var excludedPatterns = [
    /^(bin|build|components|node_modules|examples|test)\//,
    /^\./,
    /tmp/
];
var scriptsPattern = /\.js$/;
var stylesPattern = /\.(css|styl)$/;

if ( require.main === module ) {
  addFiles()
}

function addFiles( root ) {
  root || ( root = __dirname + '/..' );
  sh.cd( root );
  var config = JSON.parse( sh.cat( 'component.json' ) );

  var files =  sh.ls( '-R', root )
    .filter( function( f ) {
      var shouldBeExcluded = excludedPatterns.some( function( p ) {
        return p.test( f );
      } );
      return !shouldBeExcluded;
    } );

  config.scripts = files
    .filter( function( f ) {
      return scriptsPattern.test( f );
    } );

  config.styles = files
    .filter( function( f ) {
      return stylesPattern.test( f );
    } );

  sh.cp( '-f', 'component.json', 'bin/component.json.bak' );
  JSON.stringify( config, null, 2 ).to( 'component.json' );
}

module.exports = exports = addFiles;
