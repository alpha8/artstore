/* jshint esnext: true */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  localStorage.__seller = JSON.stringify(seller);
}

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}

export function save(key, val) {
  if (!key) {
    return;
  }

  if (!val) {
    val = '';
  }

  if (window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(val));
  }
}

export function load(key, def) {
  if (!key) {
    return def;
  }
  if (window.localStorage) {
    let val = window.localStorage.getItem(key);
    if (val) {
      return JSON.parse(val);
    }
  }
  return def;
}

export function clear(key) {
  if (!key) {
    return;
  }
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

export function loadCookie(key, def) {
  if (!key) {
    return def;
  }
  var arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
  if (arr) {
    return unescape(arr[2]);
  }
  return def;
}

export function saveCookie(name, value, path, expires) {
  var opts = {
    name: name || '',
    value: value || '',
    expires: isNaN(expires) ? 0 : expires,
    path: path || '/'
  };

  var exp = new Date();
  exp.setTime(exp.getTime() + opts.expires);
  document.cookie = opts.name +
    '=' + escape(opts.value) +
    ';expires=' + exp.toGMTString() +
    ';path=' + opts.path;
}

export function removeCookie(name, path) {
  var opts = {
    name: name || '',
    path: path || '/'
  };

  var exp = new Date();
  exp.setTime(exp.getTime() - 1000);
  document.cookie = opts.name +
    '=;expires=' + exp.toGMTString() +
    ';path=' + opts.path;
}
