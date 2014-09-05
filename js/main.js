function App(opts) {
  var defaultOptions = {
      env: 'development',
      x: 0,
      y: 0
    },
    options = opts || defaultOptions,
    imgBase64 = null;

  function setOptions(key, value) {
    if (options[key]) options[key] = value;
    return options[key];
  }

  // Render - canvas
  function renderCanvas(params) {
    var canvas = document.getElementById(params.id),
      imageObj = new Image();

    // Rendering
    imageObj.onload = function () {
      var img2canvas = new ImageUtils({
        canvas: canvas,
        img: imageObj
      });
      img2canvas.applyScale(parseFloat(params.scale), params.scaling);
    };

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
  }

  function loadCanvas(options) {
    var opt = {
      id: options.id,
      dataURL: options.dataURL || imgBase64,
      scale: options.scale || 1,
      scaling: options.scaling
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
      id: 'canvas-template',
      dataURL: e.target.result,
      scale: document.getElementById('scale').value,
      scaling: document.getElementById('scaling').value
    });
  }

  return ({
    loadCanvas: loadCanvas,
    renderTemplate: renderTemplate,
    setOptions: setOptions
  });
}