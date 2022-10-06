//(A) GET HTML TABLE
// let table = document.getElementById('demoTable');

// //(B) AJAX FETCH CSV FILE
// fetch('dummy.csv')
//   .then((res) => {
//     return res.text();
//   })
//   .then((csv) => {
//     // (B1) REMOVE OLD TABLE ROWS
//     table.innerHTML = '';

//     // (B2) GENERATE TABLE
//     csv = csv.split('\r\n');
//     for (let row of csv) {
//       let tr = table.insertRow();
//       for (let col of row.split(',')) {
//         let td = tr.insertCell();
//         td.innerHTML = col;
//       }
//     }
//   });

/********************* */

// function placeDiv(x_pos, y_pos) {
//   var d = document.getElementById('box1');
//   d.style.position = 'relative';
//   d.style.left = x_pos + 'px';
//   d.style.top = y_pos + 'px';
// }

/************* */
/* TABLE Excle */
// for (let i = 0; i < 6; i++) {
//   var row = document.querySelector('table').insertRow(-1);
//   for (var j = 0; j < 6; j++) {
//     var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1);
//     row.insertCell(-1).innerHTML =
//       i && j ? "<input id='" + letter + i + "'/>" : i || letter;
//   }
// }

// var DATA = {},
//   INPUTS = [].slice.call(document.querySelectorAll('input'));
// INPUTS.forEach((elm) => {
//   elm.onfocus = (e) => (e.target.value = localStorage[e.target.id] || '');

//   elm.onblur = function (e) {
//     localStorage[e.target.id] = e.target.value;
//     computeAll();
//   };
//   var getter = function () {
//     var value = localStorage[elm.id] || '';
//     if (value.charAt(0) == '=') with (DATA) return eval(value.substring(1));
//     else return isNaN(parseFloat(value)) ? value : parseFloat(value);
//   };
//   Object.defineProperty(DATA, elm.id, { get: getter });
//   Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
// });
// (window.computeAll = () => {
//   INPUTS.forEach(function (elm) {
//     try {
//       elm.value = DATA[elm.id];
//     } catch (e) {}
//   });
// })();

/************* */

/** DRAGGING */

function draggable(container, handle) {
  let movable = handle ? handle : container;
  ['mousedown', 'touchstart'].forEach((event) => {
    movable.addEventListener(
      event,
      (e) => {
        //e.preventDefault();
        var offsetX = e.clientX - parseInt(getComputedStyle(container).left);
        var offsetY = e.clientY - parseInt(getComputedStyle(container).top);

        function mouseMoveHandler(e) {
          container.style.top = e.clientY - offsetY + 'px';
          container.style.left = e.clientX - offsetX + 'px';
        }

        function reset() {
          removeEventListener('mousemove', mouseMoveHandler);
          removeEventListener('mouseup', reset);
        }

        addEventListener('mousemove', mouseMoveHandler);
        addEventListener('mouseup', reset);
      },
      Modernizr.passiveeventlisteners ? { passive: true } : false
    );
  });
}

function touchHandler(event) {
  /* prettier-ignore */
  var touches = event.changedTouches, 
    first = touches[0], 
    type = '';
  /* prettier-ignore */
  switch(event.type){
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //                screenX, screenY, clientX, clientY, ctrlKey,
  //                altKey, shiftKey, metaKey, button, relatedTarget);

  var simulatedEvent = document.createEvent('MouseEvent');
  /* prettier-ignore */
  simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

  first.target.dispatchEvent(simulatedEvent);
  //event.preventDefault();
}

/* implementation */

const $ = (id) => document.querySelector(id);

window.addEventListener('mouseup', runIt);
window.addEventListener('touchend', runIt);

function isPassive() {
  return Modernizr.passiveeventlisteners ? { passive: true } : false;
}

window.addEventListener('load', (e) => {
  runIt();
  draggable($('#box1'));
  draggable($('#box2'));
  draggable($('#box3'));

  $('#movables').addEventListener('touchstart', touchHandler, isPassive());
  $('#movables').addEventListener('touchmove', touchHandler, isPassive());
  $('#movables').addEventListener('touchend', touchHandler, isPassive());
  $('#movables').addEventListener('touchcancel', touchHandler, isPassive());

  const boxes = document.querySelectorAll('.box');
  for (const box of boxes) {
    // box.addEventListener('mouseup', touchHandler);
    box.addEventListener('mouseup', () => box.classList.toggle('active'), false);
    //  box.addEventListener('touchend', touchHandler);
    box.addEventListener(
      'touchend',
      () => box.classList.toggle('active'),
      false
    );
  }
});

function connectDivs(leftId, rightId, color, tension) {
  var left = document.querySelector(leftId);
  var right = document.querySelector(rightId);

  var leftPos = findAbsolutePosition(left);
  var x1 = leftPos.x;
  var y1 = leftPos.y;
  x1 += left.offsetWidth;
  y1 += left.offsetHeight / 2;

  var rightPos = findAbsolutePosition(right);
  var x2 = rightPos.x;
  var y2 = rightPos.y;
  y2 += right.offsetHeight / 2;

  var width = x2 - x1;
  var height = y2 - y1;

  //drawCircle(x1, y1, 3, color);
  // drawCircle(x2, y2, 3, color);

  addDefs();
  drawCurvedLine(x1, y1, x2, y2, color, tension);

  function addElm(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  function createSVG() {
    var svg = document.getElementById('svg-canvas');
    if (null == svg) {
      svg = addElm('svg');
      svg.setAttribute('id', 'svg-canvas');
      svg.setAttribute('style', 'position:absolute;top:0px;left:0px;z-index:-1');
      svg.setAttribute('width', document.body.clientWidth);
      svg.setAttribute('height', document.body.clientHeight);
      svg.setAttributeNS(
        'http://www.w3.org/2000/xmlns/',
        'xmlns:xlink',
        'http://www.w3.org/1999/xlink'
      );
      document.body.appendChild(svg);
    }
    return svg;
  }

  function findAbsolutePosition(htmlElement) {
    var x = htmlElement.offsetLeft;
    var y = htmlElement.offsetTop;
    for (var x = 0, y = 0, el = htmlElement; el != null; el = el.offsetParent) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    return {
      x: x,
      y: y,
    };
  }

  function setMarker(id, color = 'black', reverse = false) {
    var marker = addElm('marker');
    marker.setAttribute('id', id);

    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerUnits', 'strokeWidth');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('orient', 'auto');

    var mpath = addElm('path');
    if (reverse) mpath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z'); // normal
    else mpath.setAttribute('d', 'M 0,5 10,0 10,10 Z'); // reversed

    // mpath.setAttributeNS(null, 'transform', 'rotate(45)');
    mpath.setAttributeNS(null, 'fill', color);

    marker.appendChild(mpath);
    return marker;
  }

  function addDefs() {
    let svg = createSVG();
    let defs = addElm('defs');
    defs.setAttribute('class', 'removable');

    defs.appendChild(setMarker('trianglebackwards', 'green', true)); // start

    defs.appendChild(setMarker('triangle', 'red')); // end

    svg.appendChild(defs);
  }

  function drawCircle(x, y, radius, color) {
    var svg = createSVG();
    var shape = addElm('circle');
    shape.setAttribute('class', 'removable');
    shape.setAttributeNS(null, 'cx', x);
    shape.setAttributeNS(null, 'cy', y);
    shape.setAttributeNS(null, 'r', radius);
    shape.setAttributeNS(null, 'fill', color);
    svg.appendChild(shape);
  }

  function drawCurvedLine(x1, y1, x2, y2, color, tension) {
    let svg = createSVG();
    let shape = addElm('path');
    let delta, hx1, hy1, hx2, hy2;
    if (tension < 0) {
      delta = (y2 - y1) * tension;
      hx1 = x1;
      hy1 = y1 - delta;
      hx2 = x2;
      hy2 = y2 + delta;
    } else {
      delta = (x2 - x1) * tension;
      hx1 = x1 + delta;
      hy1 = y1;
      hx2 = x2 - delta;
      hy2 = y2;
    }
    /* prettier-ignore */
    let path = "M "  + x1 + " " + y1 + 
              " C " + hx1 + " " + hy1 +
              " " + hx2 + " " + hy2 + 
              " " + x2 + " " + y2;
    shape.setAttribute('class', 'removable');
    shape.setAttributeNS(null, 'd', path);
    shape.setAttributeNS(null, 'fill', 'none');
    shape.setAttributeNS(null, 'stroke', color);
    shape.setAttributeNS(null, 'marker-start', 'url(#trianglebackwards)');
    shape.setAttributeNS(null, 'marker-end', 'url(#triangle)');
    svg.appendChild(shape);
  }
}

function removeOldLines() {
  var e = document.querySelectorAll('.removable');
  e.forEach((userItem) => userItem.parentNode.removeChild(userItem));
}

function runIt() {
  removeOldLines();
  connectDivs('#box1', '#box2', 'blue', 0.2);
  connectDivs('#box2', '#box3', 'red', 0.2);
}
