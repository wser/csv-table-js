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

let l = loadLS('w_divOffset'); //get local storage data by key
let mouseMoving = false;
let t2arr;

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

function addTouchListeners(element){
  // attach touch/mouse handler to boxes
  element.addEventListener('touchstart', touchHandler, isPassive());
  element.addEventListener('touchmove', touchHandler, isPassive());
  element.addEventListener('touchend', touchHandler, isPassive());
  element.addEventListener('touchcancel', touchHandler, isPassive());
}

function toggleActiveClass(element){
  const toggle = () => { if (!mouseMoving) element.classList.toggle('active'); };
  // toggle active css class
  element.addEventListener('mouseup', toggle);
  element.addEventListener('touchend', toggle);
}

/* implementation */
window.addEventListener('load', init); // on first load run init

function init() {
  // attach event listeners to specific html elements
  for (let [i, box] of boxes.entries()) {

    if (!l) { saveLS('w_divOffset', [{}]); init(); } // if no local storage key exist, create it

    // assign position values from local storage to elements
    for (loc of l){
      if (loc.id == box.id) {
        box.style.left = loc.left;
        box.style.top = loc.top;
      }
    }

    addTouchListeners(box)

    draggable(box)

    // if element moving detect it and save state
    box.addEventListener('mousedown', (e) => (mouseMoving = false))
    box.addEventListener('mousemove', (e) => (mouseMoving = true))

    toggleActiveClass(box)    

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

  boxes.forEach(e=> e.classList.contains('active'))

  /* draw line between html elements */
  connectDivs('#box1', '#box2', 'blue', 0.3);
  connectDivs('#box1', '#box3', 'red', 0.3);
  connectDivs('#box3', '#box4', 'red', 0.3);
  connectDivs('#box2', '#box4', 'red', 0.3);
  connectDivs('#box1', '#box4', 'green', 0.3);

  //toCSV(tableData)
}


/** TABLE enabler */
// (A) GET HTML TABLE
let table = $('#table2');


function tableToArray(tbl, opt_cellValueGetter) {
  opt_cellValueGetter = opt_cellValueGetter || function(td) { return td.textContent || td.innerText; };
  var twoD = [];
  for (var rowCount = tbl.rows.length, rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    twoD.push([]);
  }
  for (var rowIndex = 0, tr; rowIndex < rowCount; rowIndex++) {
    var tr = tbl.rows[rowIndex];
    for (var colIndex = 0, colCount = tr.cells.length, offset = 0; colIndex < colCount; colIndex++) {
      var td = tr.cells[colIndex], text = opt_cellValueGetter(td, colIndex, rowIndex, tbl);
      while (twoD[rowIndex].hasOwnProperty(colIndex + offset)) {
        offset++;
      }
      for (var i = 0, colSpan = parseInt(td.colSpan, 10) || 1; i < colSpan; i++) {
        for (var j = 0, rowSpan = parseInt(td.rowSpan, 10) || 1; j < rowSpan; j++) {
          twoD[rowIndex + j][colIndex + offset + i] = text;
        }
      }
    }
  }
  return twoD;
}

// (B) AJAX FETCH CSV FILE
fetch('dummy.csv')
  .then((res) => res.text())
  .then((csv) => {
    // (B1) REMOVE OLD TABLE ROWS
    table.innerHTML = '';
    // (B2) GENERATE TABLE
    csv = csv.split('\r\n');
    //let arr = [[]]
    for (const [i, row] of csv.entries()) { //rows
      let tr = table.insertRow(-1); // Insert a row at the end of the table
      let rowsData = row.split(',').entries()
      for (const [j, col] of rowsData) { //columns
        let letter = String.fromCharCode('A'.charCodeAt(0) + j - 1); //returns a string created from the specified sequence of UTF-16 code units
        let cellId = letter + i 
        let td = tr.insertCell(-1); // Insert a cell in the row at end of the row
        td.innerHTML = i && j // check if true / everything with 0 is false
          ? `<input id='${cellId}' placeholder='${col}'/>` // if true add input with id
          : i || letter; // if false add letter to first row, then firstly row num
        //arr.push([i,col])
      }    
    }
  })
  .then((data) => {
    
    /** SET DATA input and helper objects */
    let DATA = {}; // processed data object
    let INPUTS = [...$$('input')]; // all input fields in table
    const obj = loadLS('w_Excel') || {}; // load localStorage data to object
    const displayLSData = (e) => e.value = obj[e.id] || ''; // get value from LS for current element id
    const processData = (e) => e.value = DATA[e.id]; // get procesed data
    
    /** EXCEL enabler */
    INPUTS.forEach((elm) => {
      displayLSData(elm) // display data from LS object
      elm.onfocus = (e) => { displayLSData(e.target) } // fill value inside cell/input with matched data
      elm.onblur = (e) => {
        obj[e.target.id] = e.target.value || ''; // write data to obj when focus changed
        processData(elm); // load all processed data for each element
        saveLS('w_Excel', obj); // save obj values to local storage
      };
      let calc = function(){
        let value = obj[elm.id] || ''; // get object value of blank
        if (value.charAt(0) == '=') with (DATA) return eval(value.substring(1)); // calculate if string starts with '='
        else return isNaN(parseFloat(value)) ? value : parseFloat(value); // return value or integer
      };
      Object.defineProperty(DATA, elm.id, { get: calc }); // process values
      Object.defineProperty(DATA, elm.id.toLowerCase(), { get: calc });
    });
    /** Process all data in another loop to initialy display result*/
    INPUTS.forEach((elm, i) => {try {processData(elm)} catch (e) {} })
    
    t2arr = tableToArray(table)
    console.log(t2arr)
  })

function getEveryNth(arr, nth) {
  const result = [];  
  for (let i = 0; i < arr.length; i += nth) result.push(arr[i]);
  return result;
}
/** EXPORT TO CSV */
function handleClick(){let q = 'Proceed with action?'; confirm(q) == true ? exportL() : false;}

function toCSV(o){
  const items = o;
  const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
  const header = Object.keys(items[0])
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
  console.log(csv)
  return csv;  
}

function exportData(csvContent){
  var element = document.createElement('a');
  element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
  element.target = '_blank';
  element.download = 'export.csv';
  element.click(); 
}

function exportL(){ exportData(toCSV(tableData)) }

//console.log(tableData)


function makeTableHTML(ar) {
  return `<table>${ar.reduce((c, o) => c += `<tr>${o.reduce((c, d) => (c += `<td>${d}</td>`), '')}</tr>`, '')}</table>`
}



function pureFunctionalTable ( data ){ 
    [document.createElement('table')].filter(table => !table.appendChild(
        data.reduce((tbody, row) =>
            !tbody.appendChild(row.reduce((tr, cell) =>
                !tr.appendChild(document.createElement('td'))
                   .appendChild(document.createTextNode(cell)) || tr
                , document.createElement('tr'))
            ) || tbody, document.createElement('tbody'))) || table)[0];}

document.body.appendChild(pureFunctionalTable(t2arr))
