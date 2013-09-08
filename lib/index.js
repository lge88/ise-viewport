
var THREE = require( 'three' );

module.exports = exports = ISEViewport;

function ISEViewport( options ) {

  if ( !(this instanceof ISEViewport) ) {
    return new ISEViewport( options );
  }

  var scope = this;
  options || ( options = {} );

  var container = options.container || document.createElement( 'div' );
  if ( options.container ) {
    container = options.container;
  } else {
    container = document.createElement( 'div' );
    container.className = 'ise-viewport';
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';
    document.body.style.overflow = 'hidden';
    document.body.appendChild( container );
  }
  scope.container = container;

  scope.init = function() {
    var container = scope.container;

    if ( options.camera ) {
      scope.camera = options.camera;
    } else {
      scope.camera = options.camera || new THREE.PerspectiveCamera(
        50,
        container.offsetWidth / container.offsetHeight,
        1,
        10000
      );
      scope.camera.position.set( 0, 500, 500 );
      scope.camera.lookAt( new THREE.Vector3() );
    }

    scope.scene = options.scene || new THREE.Scene();
    scope.sceneHelpers = options.sceneHelpers || new THREE.Scene();

    // To do put those into a ise-scene-helpers repo
    scope.workplane = new THREE.GridHelper( 500, 25 );
    scope.sceneHelpers.add( scope.workplane );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 0, 1 ).normalize();
    scope.scene.add( light );

    scope.renderer = new THREE.WebGLRenderer( { antialias: true } );
    scope.renderer.setSize( container.offsetWidth, container.offsetHeight );
    scope.renderer.autoClear = false;
    scope.renderer.autoUpdateScene = false;
    scope.canvas3D = scope.renderer.domElement;
    scope.canvas3D.className = 'ise-canvas';
    scope.container.appendChild( scope.canvas3D );

    scope.canvas2D = document.createElement( 'canvas' );
    scope.canvas2D.width = container.offsetWidth;
    scope.canvas2D.height = container.offsetHeight;
    scope.canvas2D.className = 'ise-canvas';
    container.appendChild( scope.canvas2D );

  };
  scope.init();

  ( function() {
    var frameCount = 0;
    function animate() {
      if ( frameCount > 0 ) {
        requestAnimationFrame( animate );
        render();
      }
    }

    function stop() {
      frameCount = 0;
    }

    function render() {
      scope.preStack.forEach( function( fn ) {
        fn.update( frameCount );
      } );
      scope.renderer.clear();
      scope.renderer.render( scope.scene, scope.camera );
      scope.renderer.render( scope.sceneHelpers, scope.camera );
      frameCount++;
      scope.postStack.forEach( function( fn ) {
        fn.update( frameCount );
      } );
    }
    scope.start = function() {
      frameCount = 1;
      animate();
    };
    scope.stop = stop;
    scope.render = render;
    scope.preStack = [];
    scope.postStack = [];
  } )();
  scope.start();


  scope.handleResize = function() {
    var container = scope.container, camera = scope.camera;
    var renderer = scope.renderer, render = scope.render;

	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	render();
  }
  scope.handleResize();

};
