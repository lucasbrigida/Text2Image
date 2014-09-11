function Text() {
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

  var canvas, context, selections = [];

  function init(options) {
    //Check params
    if (!options.id) return (null);

    opts.id = options.id;

    canvas = document.getElementById(options.id);
    context = canvas.getContext('2d');
    return (this);
  }

  function insertFields(field) {
    selections.push(field);
    return this;
  }

  function fields(cb) {
    cb(selections);
    return this;
  }

  function undo() {
    canvas.clearRect();
    return this;
  }

  function redo() {
    return this;
  }

  function debug() {
    canvas.addEventListener('mousemove', function (e) {
      var rect = document.getElementById('canvas-template').getBoundingClientRect();
      console.log(e.x, e.y,e.x-rect.left, e.y-rect.top);
    }, false);
    return this;
  }

  function add(options) {
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

    return this;
  }

  function selection(options) {
    //Check params
    if (!(options.x && options.y && options.width && options.height)) {
      throw new Error('x,y,width,height params undefined');
    }

    //console.log(options);
    
    opts.x = options.x;
    opts.y = options.y;

    insertFields({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height
    });

    context.beginPath();
    context.rect(options.x, options.y, options.width, options.height);
    context.lineWidth = options.lineWidth || opts.lineWidth;
    context.strokeStyle = options.borderColor || opts.borderColor;
    context.stroke();
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

  return ({
    init: init,
    selection: selection,
    add: add,
    on: on,
    fields: fields,
    debug: debug
  });
}