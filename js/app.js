var app = new App({
  env: document.getElementById('mode').value
});

var rf = new Reader;
rf.load();

//Bind - form
document.getElementById('template-form').addEventListener('submit', function (e) {
  e.preventDefault();
  app.setOptions('env', document.getElementById('mode').value);
  app.loadCanvas({
    id: 'canvas-template',
    scale: document.getElementById('scale').value,
    scaling: document.getElementById('scaling').value
  });
});