function Reader() {
  var runned = false;

  function showMessage(id, message) {
    return (function (e, file) {
      var elem = '#' + id + ' .progress-message';
      var msg = document.querySelector(elem);
      msg.innerHTML = message;
    });
  }

  function showStart(id){
    return (function (e, file) {
      var elem = '#' + id + ' .bar';
      var bar = document.querySelector(elem);
      bar.style.width = '0%';
      showMessage(id, 'loading...')(e, file);
    });
  }
  
  function showProgress(id) {
    return (function (e, file) {
      var elem = '#' + id + ' .bar';
      var bar = document.querySelector(elem);
      bar.style.width = e.loaded * 100 / file.size + '%';
      showMessage(id, bar.style.width)(e, file);
    });
  }

  function load() {
    if (runned === true) return;
    else runned = true;

    //Read Template
    var optionsTemplate = {
      accept: 'image/*',
      on: {
        loadstart: showStart('template-progress-bar'),
        progress: showProgress('template-progress-bar'),
        loadend: app.renderTemplate,
      }
    };
    FileReaderJS.setupInput(document.getElementById('template'), optionsTemplate);


    //Read .CSV (user Data)
    var optionsUserData = {
      accept: 'text/csv',
      on: {
        loadstart: showMessage('userdata-progress-bar', 'loading...'),
        progress: showProgress('userdata-progress-bar'),
        loadend: function (e, file) {},
      }
    };
    FileReaderJS.setupInput(document.getElementById('userdata'), optionsUserData);
  }

  return ({
    load: load
  });
}