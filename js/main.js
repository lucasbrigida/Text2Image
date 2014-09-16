function App(opts) {
  var self = this,
    defaultOptions = {
      env: 'development',
      x: 0,
      y: 0
    },
    options = opts || defaultOptions,
    imgBase64 = null,
    onEvents = {
      onload: []
    },
    text = new CanvasText({
      canvas: opts.canvas || null
    });


  function setOptions(key, value) {
    if (options[key]) options[key] = value;
    return options[key];
  }


  function clearCanvas() {
    if (!opts.canvas) {
      throw new Error("Canvas isn't defined");
    }
    var context = opts.canvas.getContext('2d');
    context.clearRect(0, 0, opts.canvas.width, opts.canvas.height);
    return this;
  }


  // Render - canvas
  function renderCanvas(params) {
    var canvas = params.canvas,
      imageObj = new Image();

    // Rendering
    imageObj.onload = function () {
      var img2canvas = new ImageUtils({
        canvas: canvas,
        img: imageObj
      });
      img2canvas.applyScale(parseFloat(params.scale), params.scaling);
    };

    // Image Preview - DEBUG
    imageObj.src = params.dataURL;
    imageObj.id = 'app-image-preview';
    imageObj.style.width = '100%';

    //Toggle Image Preview
    if (options.env === 'development') {
      if (!document.getElementById('app-image-preview')) {
        document.body.appendChild(imageObj);
      } else {
        document.getElementById('app-image-preview').src = imageObj.src;
      }
    } else {
      if (document.getElementById('app-image-preview')) {
        document.getElementById('app-image-preview').remove();
      }
    }

    if (typeof params.done === 'function') params.done();
  }


  function loadCanvas(options) {
    var opt = {
      canvas: options.canvas,
      dataURL: options.dataURL || imgBase64,
      scale: options.scale || 1,
      scaling: options.scaling,
      done: options.done
    };

    /* TODO
           - remove the "for" below, when it solves a "bug" when rendering
           the canvas for the first time the image is displayed in half.
        
          renderCanvas(opt); //Normal
        */
    for (var i in [0, 1]) renderCanvas(opt);
  }


  // Render Template
  function renderTemplate(e, file) {
    imgBase64 = e.target.result;
    loadCanvas({
      canvas: document.getElementById('canvas-template'),
      dataURL: e.target.result,
      scale: document.getElementById('scale').value,
      scaling: document.getElementById('scaling').value,
      done: function () {
        send('onload');
      }
    });
  }


  function refresh(cb) {
    //clearCanvas();
    /*loadCanvas({
      canvas: options.canvas,
      dataURL: imgBase64,
      scale: options.scale || 1,
      scaling: options.scaling || 'smooth',
      done: cb
    });*/
    cb();
    return this;
  }


  function on(event, cb) {
    switch (event) {
    case 'onload':
      if (typeof cb === 'function') {
        onEvents.onload.push(cb);
      }
      break;
    }
  }


  function send(event) {
    switch (event) {
    case 'onload':
      onEvents.onload.reverse();
      while (onEvents.onload.length > 0) {
        onEvents.onload.pop()();
      }
      break;
    }
  }


  function removeField(index) {
    refresh(function () {
      text.removeField(index)
        .removeSelection(index)
        .refresh();
    });
    return this;
  }


  return ({
    loadCanvas: loadCanvas,
    renderTemplate: renderTemplate,
    clearCanvas: clearCanvas,
    refresh: refresh,
    setOptions: setOptions,
    renderFieldSelection: renderFieldSelection,
    removeField: removeField,
    on: on,
    text: text
  });
}