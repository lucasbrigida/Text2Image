function CanvasText(params) {
  'use strict';
  var opts = {
    x: 0,
    y: 0,
    borderColor: '#000',
    id: null,
    lineWidth: 0.5,
    margin: {
      left: 0.05,
      top: 0.75
    },
    mouse_select: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    undoIndex: 0
  };

  var canvas = params.canvas || null,
    context = canvas ? canvas.getContext('2d') : null,
    selections = [],
    fieldList = [];


  function init(options) {
    canvas = options.canvas;
    context = canvas.getContext('2d');
    return this;
  }


  function insertSelection(sel) {
    selections.push(sel);
    return this;
  }


  function removeSelection(sel) {
    if ((typeof (sel) === 'number') || (typeof (sel) === 'string')) {
      selections.splice(parseInt(sel), 1);
    }

    if (typeof (sel) === 'object') {
      for (var i in selections) {
        if (selections[i] === sel) {
          selections.splice(i, 1);
          break;
        }
      }
    }

    return this;
  }


  function insertField(field) {
    fieldList.push(field);
    return this;
  }


  function removeField(field) {
    if ((typeof (field) === 'number') || (typeof (field) === 'string')) {
      fieldList.splice(parseInt(fields), 1);
    }

    if (typeof (field) === 'object') {
      for (var i in fieldList) {
        if (fieldList[i] === field) {
          fieldList.splice(i, 1);
          break;
        }
      }
    }

    return this;
  }


  function drawText(textParams) {
    var options = textParams; //refactor

    // Calculate size average
    options.x += options.width * opts.margin.left;
    options.y += options.height * opts.margin.top;

    context.beginPath();

    // Format font and check params
    if (!(options.style.fontsize && options.style.font)) {
      throw new Error('fontsize and/or font params undefined');
    }
    context.font = options.style.fontsize + 'pt ' + options.style.font;

    // Color
    if (options.color) {
      context.fillStyle = options.color;
    }

    // Check text,x,y params
    if (!(options.text && options.x && options.y)) {
      throw new Error('x,y,text params undefined');
    }
    context.fillText(options.text || '', options.x, options.y);
  }


  function add(options) {
    drawText(options);
    insertField(options); //Insert field in field list
    return this;
  }


  function drawSelection(selParams) {
    var options = selParams; // refactor
    
    var rect = canvas.getBoundingClientRect();
    options.x -= rect.left;
    options.y -= rect.top;
        
    //Check params
    if (!(options.x && options.y && options.width && options.height)) {
      throw new Error('x,y,width,height params undefined');
    }

    opts.x = options.x;
    opts.y = options.y;

    context.beginPath();
    context.rect(options.x, options.y, options.width, options.height);
    context.lineWidth = options.lineWidth || opts.lineWidth;
    context.strokeStyle = options.borderColor || opts.borderColor;
    context.stroke();
  }


  function selection(options) {
    drawSelection(options);
    insertSelection({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height
    });
    return this;
  }


  function on(event, cb) {
    switch (event) {
    case 'mouse-select':
      canvas.addEventListener('mousedown', function (e) {
        opts.mouse_select.x = e.x;
        opts.mouse_select.y = e.y;
      }, false);

      canvas.addEventListener('mouseup', function (e) {
        opts.mouse_select.width = e.x - opts.mouse_select.x;
        opts.mouse_select.height = e.y - opts.mouse_select.y;
        cb(opts.mouse_select);
      }, false);
      break;
    }

    return this;
  }


  function all(type) {
    switch (type) {
    case 'selections':
      return selections;
      break;
    case 'texts':
      return fieldList;
      break;
    }
  }


  function fields(cb) {
    cb(fieldList);
    return this;
  }


  function undo() {
    canvas.clearRect();
    return this;
  }


  function redo() {
    return this;
  }


  function refresh(mode) {
    switch (mode) {
    case 'selections':
      all('selections').forEach(function (sel) {
        console.log(sel);
        drawSelection(sel);
      });
      break;
    case 'texts':
      all('texts').forEach(function (text) {
        console.log(text);
        drawText(text)
      });
      break;
    default:
      refresh('selections');
      refresh('texts');
      break;
    }
  }


  function debug() {
    canvas.addEventListener('mousemove', function (e) {
      var rect = document.getElementById('canvas-template').getBoundingClientRect();
      console.log(e.x, e.y, e.x - rect.left, e.y - rect.top);
    }, false);
    return this;
  }


  return ({
    init: init,
    selection: selection,
    add: add,
    on: on,
    fields: fields,
    debug: debug,
    all: all,
    removeSelection: removeSelection,
    removeField: removeField,
    refresh: refresh
  });
}