var selected_locales = [
  'fr-CH', 'de-CH'
];

var locales = {
  'cs': {'source_name': 'Czech', 'code': 'cs'},
  'en': {'source_name': 'English', 'code': 'en'},
  'fr': {
    'source_name': 'French',
    'code': 'fr',
    'sub': {
      'fr-BE': {'source_name': 'French (Belgium)', 'code': 'fr-BE'},
      'fr-CA': {'source_name': 'French (Canada)', 'code': 'fr-CA'},
      'fr-FR': {'source_name': 'French (France)', 'code': 'fr-FR'},
      'fr-CH': {'source_name': 'French (Switzerland)', 'code': 'fr-CH'},
    }
  },
  'de': {
    'source_name': 'German',
    'code': 'de',
    'sub': {
      'de-CH': {'source_name': 'German (Switzerland)', 'code': 'de-CH'},
      'de-DE': {'source_name': 'German (Germany)', 'code': 'de-DE'},
    }
  },
  'hu': {'source_name': 'Hungarian', 'code': 'hu'},
  'it': {'source_name': 'Italian', 'code': 'it'},
  'pl': {'source_name': 'Polish', 'code': 'pl'},
  'es': {'source_name': 'Spanish', 'code': 'es'},
};

function toggleSelected(e) {
  var elem = e.target;
  var code = elem.parentNode.dataset.code; 

  var pos = selected_locales.indexOf(code);
  if (pos !== -1) {
    delete selected_locales[pos];
  } else {
    selected_locales.push(code);
  }
  drawList();
}

function findLocale(code, root) {
  if (!root) {
    root = locales;
  }
  if (root[code]) {
    return root[code];
  }
  for (var i in root) {
    var subRoot = root[i];
    if (subRoot.sub) {
      var ret = findLocale(code, subRoot.sub);
      if (ret) {
        return ret;
      }
    }
  }
  return false;
}

function buildRow(locale, sortable, index) {
  if (!index) {
    index = 0;
  }
  var li = document.createElement('li');

  li.dataset.code = locale.code;
  

  if (sortable) {
    li.classList.add('selected');
    var span = document.createElement('span');
    span.classList.add('handle');
    span.textContent = '::';
    li.appendChild(span);
  } else {
    var span = document.createElement('span');
    span.classList.add('pseudo_handle');
    span.innerHTML = "&nbsp;&nbsp;";
    li.appendChild(span);
  }

  var span = document.createElement('span');

  var prefix = '';
  for (var i=0; i < index; i++) {
    prefix += '&nbsp;&nbsp;&nbsp;&nbsp;';
  }
  span.innerHTML = prefix + locale['source_name'];
  li.appendChild(span);

  var checkbox = document.createElement('input');
  checkbox.classList.add('select');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.addEventListener('click', toggleSelected);

  if (sortable) {
    checkbox.setAttribute('checked', 'checkbox');
  }
  li.appendChild(checkbox);
  return li;
}

function buildHR() {
  var li = document.createElement('li');
  li.classList.add('separator');

  return li;
}

function buildDesc(desc) {
  var li = document.createElement('li');
  li.classList.add('desc');
  li.textContent = desc;

  return li;
}

function drawLocales(rootNode, locales, index) {
  for(var i in locales) {
    var locale = locales[i];

    if (selected_locales.indexOf(locale.code) !== -1) {
      continue;
    }

    var li = buildRow(locale, false, index);
    rootNode.appendChild(li);

    if (locale.sub) {
      drawLocales(rootNode, locale.sub, index+1);
    }
  }
}

function drawList() {
  var rootNode = document.getElementById('sortable-with-handles');

  while (rootNode.lastChild) {
    rootNode.removeChild(rootNode.lastChild);
  }

  rootNode.appendChild(buildDesc('selected:'));
  for (var i in selected_locales) {
    var code = selected_locales[i];
    var locale = findLocale(code);
    var li = buildRow(locale, true);
    rootNode.appendChild(li);
  }

  rootNode.appendChild(buildHR());

  rootNode.appendChild(buildDesc('available:'));

  drawLocales(rootNode, locales, 0);


  $('.sortable').sortable({
    handle: 'span',
    items: '.selected',
  });
}

function main() {
  drawList();
}
