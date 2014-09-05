function ImageUtils(params) {
  'use strict';

  var Ctx = params.canvas.getContext('2d'),
    stepScale = 0.5;

  function stepDown(image) {
    var temp = {};
    temp.canvas = document.createElement('canvas');
    temp.ctx = temp.canvas.getContext('2d');
    temp.canvas.width = (image.width * stepScale) + 1;
    temp.canvas.height = (image.height * stepScale) + 1;
    temp.ctx.scale(stepScale, stepScale);
    temp.ctx.drawImage(image, 0, 0);
    return temp.canvas;
  }

  function scaleDown(image, targetScale) {
    var currentScale = 1;
    while (currentScale * stepScale > targetScale) {
      currentScale *= stepScale;
      image = stepDown(image);
    }
    return {
      image: image,
      remainingScale: targetScale / currentScale
    };
  }

  function applyScale(scale, mode) {
    var scaledData;
    if (typeof scale !== 'number') {
      scale = scale.value;
    }
    params.canvas.width = Math.floor(params.img.width * scale) + 4;
    params.canvas.height = Math.floor(params.img.height * scale) + 4;

    scaledData = scaleDown(params.img, scale);

    switch (mode) {
    case 'smooth':
      Ctx.scale(scaledData.remainingScale, scaledData.remainingScale);
      Ctx.drawImage(scaledData.image, params.x || 0, params.y || 0);
      break;
    default:
      Ctx.scale(scale, scale);
      Ctx.drawImage(params.img, params.x || 0, params.y || 0);
      break;
    }
  }

  return ({
    applyScale: applyScale
  });
}