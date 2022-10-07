/************* */

/** DRAG enabler*/
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

/** TOUCH enabler */
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-passiveeventlisteners-setclasses !*/
/* prettier-ignore */
!function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,f,l;for(var c in r)if(r.hasOwnProperty(c)){if(e=[],n=r[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)f=e[t],l=f.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),i.push((a?"":"no-")+l.join("-"))}}function t(e){var n=l.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?l.className.baseVal=n:l.className=n)}var i=[],r=[],f={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){r.push({name:e,fn:n,options:s})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var l=n.documentElement,c="svg"===l.nodeName.toLowerCase();Modernizr.addTest("passiveeventlisteners",function(){var n=!1;try{var s=Object.defineProperty({},"passive",{get:function(){n=!0}});e.addEventListener("test",null,s)}catch(o){}return n}),a(),t(i),delete f.addTest,delete f.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document);
function touchHandler(event) {
  /* prettier-ignore */
  var touches = event.changedTouches, first = touches[0], type = '';
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
}

/**************************************************************** */
/* implementation */
const boxes = document.querySelectorAll('.box');
const $ = (id) => document.querySelector(id);
const $$ = (c) => document.querySelectorAll(c);
/* prettier-ignore */
const isPassive = () => Modernizr.passiveeventlisteners ? { passive: true } : false;

window.addEventListener('load', init); // on first load run init

function init() {
  let mouseMoving = false;
  // attach event listeners to specific html elements
  for (const box of boxes) {
    const toggle = () => {
      if (!mouseMoving) box.classList.toggle('active');
    };

    // attach touch/mouse handler to boxes
    box.addEventListener('touchstart', touchHandler, isPassive());
    box.addEventListener('touchmove', touchHandler, isPassive());
    box.addEventListener('touchend', touchHandler, isPassive());
    box.addEventListener('touchcancel', touchHandler, isPassive());

    draggable(box); // make boxes draggable

    box.onmousedown = (e) => (mouseMoving = false);
    box.onmousemove = (e) => (mouseMoving = true);

    // toggle active css class
    box.addEventListener('mouseup', toggle);
    box.addEventListener('touchend', toggle);

    // on end of interaction redraw line
    box.addEventListener('mouseup', runIt);
    box.addEventListener('touchend', runIt);
  }
  // run other functions
  runIt();
}

function connectDivs(leftId, rightId, color, tension) {
  /* prettier-ignore */
  let left = $(leftId), right = $(rightId);

  let leftPos = findAbsolutePosition(left);
  let x1 = (leftPos.x += left.offsetWidth);
  let y1 = (leftPos.y += left.offsetHeight / 2);

  let rightPos = findAbsolutePosition(right);
  /* prettier-ignore */
  let x2 = rightPos.x, y2 = (rightPos.y += right.offsetHeight / 2);

  let line = addElm('path');

  /* prettier-ignore */
  function addElm(name) { return document.createElementNS('http://www.w3.org/2000/svg', name);}

  function createSVG() {
    let svg = $('#svg-canvas');
    if (null == svg) {
      svg = addElm('svg');
      svg.setAttribute('id', 'svg-canvas');
      svg.setAttribute('style', 'position:absolute;top:0px;left:0px;z-index:-1');
      svg.setAttribute('width', document.body.clientWidth);
      svg.setAttribute('height', document.body.clientHeight);
      /* prettier-ignore */
      svg.setAttributeNS('http://www.w3.org/2000/xmlns/','xmlns:xlink','http://www.w3.org/1999/xlink');
      document.body.appendChild(svg);
    }
    return svg;
  }

  function findAbsolutePosition(htmlElement) {
    let x = htmlElement.offsetLeft;
    let y = htmlElement.offsetTop;
    for (let x = 0, y = 0, el = htmlElement; el != null; el = el.offsetParent) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    return {
      x: x,
      y: y,
    };
  }

  function drawCurvedLine(x1, y1, x2, y2, color, tension) {
    let delta, hx1, hy1, hx2, hy2;
    /* prettier-ignore */
    if (tension < 0) { delta = (y2 - y1) * tension; hx1 = x1; hy1 = y1 - delta; hx2 = x2; hy2 = y2 + delta;}
    else { delta = (x2 - x1) * tension; hx1 = x1 + delta; hy1 = y1; hx2 = x2 - delta; hy2 = y2;}
    /* prettier-ignore */
    let path = "M "  + x1 + " " + y1 + 
              " C " + hx1 + " " + hy1 +
              " " + hx2 + " " + hy2 + 
              " " + x2 + " " + y2;
    line.setAttribute('class', 'removable');
    line.setAttributeNS(null, 'd', path);
    line.setAttributeNS(null, 'fill', 'none');
    line.setAttributeNS(null, 'stroke', color);
    line.setAttributeNS(null, 'marker-start', 'url(#triangle)');
    line.setAttributeNS(null, 'marker-end', 'url(#triangleend)');
  }

  let svg = createSVG();
  svg.appendChild(line);

  drawCurvedLine(x1, y1, x2, y2, color, tension);
}

function runIt() {
  /* remove old lines */
  $$('.removable').forEach((e) => e.parentNode.removeChild(e));

  /* draw line between html elements */
  connectDivs('#box1', '#box2', 'blue', 0.2);
  connectDivs('#box1', '#box3', 'red', 0.2);
  connectDivs('#box3', '#box4', 'red', 0.2);
}

/* local storage */
function Local() {
  return {
    /* prettier-ignore*/
    set: function (key, obj) { localStorage.setItem(key, JSON.stringify(obj)); return obj; },
    /* prettier-ignore*/
    get: function (key) { var obj = {};if (localStorage.getItem(key) !== 'undefined') obj = JSON.parse(localStorage.getItem(key));
      return obj; },
    /* prettier-ignore*/
    clear: function () { localStorage.clear(); return this; },
    /* prettier-ignore*/
    remove: function (key) { localStorage.removeItem(key); return this; },
  };
}
var local = Local();
