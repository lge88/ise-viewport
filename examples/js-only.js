var ISEViewport = require( 'ise-viewport' );
var arrgen = require( 'arr-gen' );
var THREE = require( 'three' );

var viewport = ISEViewport();

var renderer = viewport.renderer;
var scene = viewport.scene;
var camera = viewport.camera;
var workplane = new THREE.GridHelper( 500, 25 );
viewport.sceneHelpers.add( workplane );

var clock = new THREE.Clock();
var cubes = [];

clock.start();
renderer.setClearColor( 0xdddddd );
window.onresize = function() {
  viewport.handleResize();
};

arrgen( 100, function( i ) {
  return {
    x: random( -100, 100 ),
    y: random( -100, 100 ),
    z: random( -100, 100 )
  };
} ).map( function( pos ) {
  var c = cube();
  c.position.copy( pos );
  return c;
} ).forEach( function( c ) {
  cubes.push( c );
  scene.add( c );
} );

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
    } );
  }
} );

function cube( w, h, t ) {
  var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;
  var m = new THREE.Mesh(
    new THREE.CubeGeometry( w || 40, h || 40, t || 40 ),
    new THREE.MeshPhongMaterial( { color: randomColor(), ambient: 0x000000, specular: 0x00ffaa, shininess: shininess, metal: true, shading: shading } )
  );
  m.material.wireframe = false;
  return m;
}

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function random( a, b ) {
  return Math.random()*( b - a ) + a;
}
