/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-passiveeventlisteners-setclasses !*/
/* prettier-ignore */
!function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,f,l;for(var c in r)if(r.hasOwnProperty(c)){if(e=[],n=r[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)f=e[t],l=f.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),i.push((a?"":"no-")+l.join("-"))}}function t(e){var n=l.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?l.className.baseVal=n:l.className=n)}var i=[],r=[],f={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){r.push({name:e,fn:n,options:s})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var l=n.documentElement,c="svg"===l.nodeName.toLowerCase();Modernizr.addTest("passiveeventlisteners",function(){var n=!1;try{var s=Object.defineProperty({},"passive",{get:function(){n=!0}});e.addEventListener("test",null,s)}catch(o){}return n}),a(),t(i),delete f.addTest,delete f.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document);
/**************************************************************** */
/************* */
const $ = (id) => document.querySelector(id);
const $$ = (c) => document.querySelectorAll(c);
const boxes = $$('.box');
const local = Local();
/* prettier-ignore */
const isPassive = () => Modernizr.passiveeventlisteners ? { passive: true } : false;

/* LOCAL storage */
function Local() {
  return {
    /* prettier-ignore*/
    set: function (key, obj) { localStorage.setItem(key, JSON.stringify(obj)); return obj; },
    /* prettier-ignore*/
    get: function (key) { var obj = {};if (localStorage.getItem(key) !== 'undefined') obj = JSON.parse(localStorage.getItem(key)); return obj; },
    /* prettier-ignore*/
    clear: function () { localStorage.clear(); return this; },
    /* prettier-ignore*/
    remove: function (key) { localStorage.removeItem(key); return this; },
  };
}
let loadLS = (key) => local.get(key);
let saveLS = (key, obj) => local.set(key, obj);

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

        function setLocalDataOnMove() {
          let arr = [];
          for (box of boxes)
            arr.push({
              id: box.id,
              left: box.style.left,
              top: box.style.top,
            });
          saveLS('w_divOffset', arr);
        }

        function mouseMoveHandler(e) {
          container.style.top = e.clientY - offsetY + 'px';
          container.style.left = e.clientX - offsetX + 'px';
          /* automatically add to local storage on move */
          setLocalDataOnMove();
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

/* implementation */
window.addEventListener('load', init); // on first load run init

function init() {
  let mouseMoving = false;
  // attach event listeners to specific html elements
  for (let [i, box] of boxes.entries()) {
    const toggle = () => {
      if (!mouseMoving) box.classList.toggle('active');
    };

    // attach touch/mouse handler to boxes
    box.addEventListener('touchstart', touchHandler, isPassive());
    box.addEventListener('touchmove', touchHandler, isPassive());
    box.addEventListener('touchend', touchHandler, isPassive());
    box.addEventListener('touchcancel', touchHandler, isPassive());

    //get local storage data by key
    let l = loadLS('w_divOffset');
    // if no local storage key exist, create it
    // prettier-ignore
    if (!l) { saveLS('w_divOffset', [{}]); init(); }

    // assign position values from local storage to elements
    for (loc of l) {
      if (loc.id == box.id) {
        box.style.left = loc.left;
        box.style.top = loc.top;
      }
    }

    // make boxes draggable
    draggable(box);

    // if element moving detect it and save state
    box.onmousedown = (e) => (mouseMoving = false);
    box.onmousemove = (e) => (mouseMoving = true);

    // toggle active css class
    box.addEventListener('mouseup', toggle);
    box.addEventListener('touchend', toggle);

    // on end of interaction redraw line
    box.addEventListener('mouseup', runIt);
    box.addEventListener('touchend', runIt);
    box.innerHTML += i + 1;
  }
  // run other functions
  runIt();
}

function connectDivs(leftId, rightId, color, tension) {
  /* prettier-ignore */
  let left = $(leftId), right = $(rightId);

  let leftPos = findAbsolutePosition(left);
  /* prettier-ignore */
  let x1 = (leftPos.x += left.offsetWidth), y1 = (leftPos.y += left.offsetHeight / 2);

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
  connectDivs('#box1', '#box2', 'blue', 0.3);
  connectDivs('#box1', '#box3', 'red', 0.3);
  connectDivs('#box3', '#box4', 'red', 0.3);
  connectDivs('#box2', '#box4', 'red', 0.3);
  connectDivs('#box1', '#box4', 'green', 0.3);
}

/*** ORIGINAL
 */

for (var i = 0; i < 3; i++) {
  var row = $('#table2').insertRow(-1);
  for (var j = 0; j < 3; j++) {
    var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1);
    row.insertCell(-1).innerHTML =
      i && j ? "<input id='" + letter + i + "'/>" : i || letter;
  }
}

let DATA = {}; // helper object
let INPUTS = [...$$('input')]; // all input fields in table
const obj = loadLS('w_Excel') || {}; // loadLS or make localStorrage key
/* prettier-ignore */
let computeAll = () => INPUTS.forEach( (elm) => { try {elm.value = DATA[elm.id]} catch (e) {} });
/** EXCEL enabler */
INPUTS.forEach((elm) => {
    let value = obj[elm.id] || ''; //get value from LS for current element id
    elm.value = value;
    elm.onfocus = (e) => e.target.value = obj[e.target.id] || '' // fill value inside cell/input with matched data
    elm.onblur = (e) => {
      obj[e.target.id] = e.target.value; // write data to obj when focus changed
      elm.value = DATA[elm.id]; // process entered value to DATA object through calculation
      computeAll(); // load all processed data ofr each element
      saveLS('w_Excel', obj); // save obj value to local storage
    };
    let calc = () => {      
      if (value.charAt(0) == '=') with (DATA) return eval(value.substring(1)); // calculate if string starts with '='
      else return isNaN(parseFloat(value)) ? value : parseFloat(value); // return value or integer
    };

    Object.defineProperty(DATA, elm.id, { get: calc }); // process values
    Object.defineProperty(DATA, elm.id.toLowerCase(), { get: calc });

});


/** TABLE enabler */
// (A) GET HTML TABLE
// let table = $('#demoTable');

// // (B) AJAX FETCH CSV FILE
// fetch('dummy.csv')
//   .then((res) => res.text())
//   .then((csv) => {
//     // (B1) REMOVE OLD TABLE ROWS
//     table.innerHTML = '';

//     // (B2) GENERATE TABLE
//     csv = csv.split('\r\n');
//     for (let [i, row] of csv.entries()) {
//       let tr = table.insertRow();
//       tr.id = i;
//       for (let [j, col] of row.split(',').entries()) {
//         let td = tr.insertCell();
//         td.innerHTML = col;
//       }
//     }
//   });
