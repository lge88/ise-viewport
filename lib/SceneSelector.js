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
