var ISEViewport = require( 'ise-viewport' );
var randomCubes = require( 'three-random-cubes' );
var THREE = require( 'three' );
// var arrgen = require( 'arr-gen' );

var container = document.getElementById( 'main' );
var viewport = ISEViewport( { container: container } );
// var viewport = ISEViewport();

var renderer = viewport.renderer;
var scene = viewport.scene;
var camera = viewport.camera;
var workplane = viewport.workplane;
var clock = new THREE.Clock();
var cubes = randomCubes( 100 );

cubes.forEach( function( c ) { scene.add( c ); } );

clock.start();
renderer.setClearColor( 0xdddddd );
window.onresize = function() {
  viewport.handleResize();
};

var vel = new THREE.Vector3();

viewport.preStack.push( {
  update: function() {
    workplane.position.x += random( -10, 10 )
      * Math.sin( 5*clock.getElapsedTime() );
  }
} );

viewport.preStack.push( {
  update: function() {
    cubes.forEach( function( c ) {
      vel.set(
        random( -10, 10 ),
        random( -10, 10 ),
        random( -10, 10 )
      );
      c.position.add( vel );
      c.material.color.set( randomColor() );
    } );
  }
} );

function random( a, b ) { return Math.random()*( b - a ) + a; }
function randomColor() {
  return '#' + Math.floor( Math.random()*16777215 ).toString( 16 );
}
