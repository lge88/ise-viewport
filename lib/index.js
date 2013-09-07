
var THREE = require( 'three' );

module.exports = exports = ISEViewport;

function ISEViewport( options ) {

  if ( !(this instanceof ISEViewport) ) {
    return new ISEViewport( options );
  }

  var scope = this;

  var container = options.container || document.createElement( 'div' );

  this.init = function() {
    container.className = 'ise-viewport';
    this.domElement = container;

    this.camera = new THREE.PerspectiveCamera(
      50,
      container.offsetWidth / container.offsetHeight,
      1,
      10000
    );
    this.camera.position.set( 0, 500, 500 );
    this.camera.lookAt( new THREE.Vector3() );

    this.scene = new THREE.Scene();
    this.sceneHelpers = new THREE.Scene();

    this.workplane = new THREE.GridHelper( 500, 25 );
    this.sceneHelpers.add( this.workplane );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 0, 1 ).normalize();
    this.scene.add( light );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( container.offsetWidth, container.offsetHeight );
    this.renderer.autoClear = false;
    // this.renderer.autoUpdateScene = false;
    this.canvas3D = this.renderer.domElement;
    this.canvas3D.className = 'ise-canvas';
    this.domElement.appendChild( this.canvas3D );

    this.canvas2D = document.createElement( 'canvas' );
    this.canvas2D.width = container.offsetWidth;
    this.canvas2D.height = container.offsetHeight;
    this.canvas2D.className = 'ise-canvas';
    container.appendChild( this.canvas2D );

    // this.context2D =  Canvas2DContext( this.canvas2D );
    // this.context2D
    //   .lineWidth( 4 )
    //   .font( '20px Georgia' )
    //   .fillStyle( 'red' )
    //   .strokeStyle( 'rgb( 0, 0, 255 )' );

    // this.controls = new EditorControls( this.camera, this.canvas2D );
  };
  this.init();

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
  this.start();


  this.handleResize = function() {
	this.camera.aspect = container.offsetWidth / container.offsetHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( container.offsetWidth, container.offsetHeight );
	this.render();
  }
  this.handleResize();

  // events

  ( function() {
    var ray = new THREE.Raycaster();
    var projector = new THREE.Projector();

    this.getIntersects = function( event, object ) {
      var vector = new THREE.Vector3(
	    ( event.layerX / scope.canvas2D.offsetWidth ) * 2 - 1,
	      - ( event.layerY / scope.canvas2D.offsetHeight ) * 2 + 1,
	    0.5
      );
      projector.unprojectVector( vector, scope.camera );
      ray.set( scope.camera.position, vector.sub( scope.camera.position ).normalize() );

      if ( object instanceof Array ) {
	    return ray.intersectObjects( object );
      }
      return ray.intersectObject( object );
    };


    this.getPointFromTouchEvent = function( ev ) {
      var offset = getOffsetToWindow( scope.innerContainer );
      var left = offset.left, top = offset.top;

      return function( ev ) {
        var x = ev.touches[0].clientX - left, y = ev.touches[0].clientY - top;
        return {
          x: x,
          y: y
        };
      };
    };

    function getOffsetToWindow( el ) {
      var x = el.offsetLeft, y = el.offsetTop;

      el = el.offsetParent;

      while ( el )  {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return {
        left: x,
        top: y
      };
    }

  } )();
};
