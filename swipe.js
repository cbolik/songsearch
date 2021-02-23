// Based on: https://stackoverflow.com/questions/46190436/how-to-detect-pull-to-refresh
// With updates for iOS as suggested here: https://stackoverflow.com/questions/63194912/js-touchstart-end-events-not-working-on-ios

var pStart = { x: 0, y: 0 };
var pStop = { x: 0, y: 0 };

function swipeStart(e) {
  if (typeof e["changedTouches"] !== "undefined") {
    var touch = e.changedTouches[0];
    pStart.x = touch.screenX;
    pStart.y = touch.screenY;
  } else {
    pStart.x = e.screenX;
    pStart.y = e.screenY;
  }
}

function swipeMove(e) {
  if (typeof e["changedTouches"] !== "undefined") {
    var touch = e.changedTouches[0];
    pStop.x = touch.screenX;
    pStop.y = touch.screenY;
  } else {
    pStop.x = e.screenX;
    pStop.y = e.screenY;
  }
}

function swipeEnd(e) {
  // Probably still need this for Android?
  /*
  if (typeof e["changedTouches"] !== "undefined") {
    var touch = e.changedTouches[0];
    pStop.x = touch.screenX;
    pStop.y = touch.screenY;
  } else {
    pStop.x = e.screenX;
    pStop.y = e.screenY;
  }
  */

  swipeCheck();
}

function swipeCheck() {
  var changeY = pStart.y - pStop.y;
  var changeX = pStart.x - pStop.x;
  //alert(`pStart.x: ${pStart.x}, pStart.y: ${pStart.y}, pStop.x: ${pStop.x}, pStop.y: ${pStop.y}`);
  if (isPullDown(changeY, changeX)) {
    //alert("Swipe Down!");
    window.location.reload();
  }
}

function isPullDown(dY, dX) {
  // methods of checking slope, length, direction of line created by swipe action
  return (
    dY < 0 && Math.abs(dY) >= 100 && Math.abs(dX) <= 100
    /*
    ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
      (Math.abs(dX) / Math.abs(dY) <= 0.3 && Math.abs(dY) >= 60))
      */
  );
}
