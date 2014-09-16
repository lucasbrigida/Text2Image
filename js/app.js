var app = new App({
  env: document.getElementById('mode').value,
  canvas: document.getElementById('canvas-template')
});

var rf = new Reader;
rf.load();


function removeField(e) {
  var field = e.target.parentNode,
    index = parseInt(field.className);

  field.remove();
  app.removeField(index);
}

function addFields(fields) {
  document.querySelector('#fieldlist .list').remove();
  var list = document.createElement('div');
  list.className = 'list';
  document.querySelector('#fieldlist').appendChild(list);

  var _fieldTemplate = [];

  for (var i in fields) {
    var field = document.createElement('p'),
      name = document.createElement('input'),
      association = document.createElement('input'),
      removeBtn = document.createElement('input');

    field.className += [' ', i].join('');
    name.placeholder = 'Type Text';
    name.name = 'name';
    association.value = i;
    association.disabled = 'true';
    removeBtn.type = 'button';
    removeBtn.value = 'Remove';
    removeBtn.addEventListener('click', removeField, false);

    field.textContent += ' Field: ';
    field.appendChild(association);
    field.appendChild(name);
    field.appendChild(removeBtn);

    _fieldTemplate.push(field);
  }

  while (_fieldTemplate.length > 0) {
    document.querySelector('#fieldlist .list').appendChild(_fieldTemplate.shift());
  }
}


// Render Fields in template
function renderFieldSelection(opts) {
  app.text
    .init(opts)
    .on('mouse-select', function (options) {
      /*var rect = canvas.getBoundingClientRect();
      options.x -= rect.left;
      options.y -= rect.top;*/

      app.text.selection(options); // Draw selection area
      app.text.add({ // Draw Text
        style: {
          fontsize: options.height * 0.5,
          font: 'Calibri'
        },
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        text: 'Field ' + String(parseInt(app.text.all('selections').length) - 1),
        color: 'red'
      });
      app.text.fields(addFields); // Add field on fieldlist (HTML element)
    });
}


app.on('onload', function () {
  renderFieldSelection({
    canvas: document.getElementById('canvas-template'),
    scale: parseFloat(document.getElementById('scale').value)
  });
});


// Load Template
document.getElementById('template-form').addEventListener('submit', function (e) {
  e.preventDefault();
  app.setOptions('env', document.getElementById('mode').value);
  app.loadCanvas({
    id: 'canvas-template',
    scale: document.getElementById('scale').value,
    scaling: document.getElementById('scaling').value
  });
});