/* jshint esnext: true */
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
      try {
        return JSON.parse(val);
      } catch (e) {
        return def;
      }
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

export function saveSession(key, val) {
  if (!key) {
    return;
  }

  if (!val) {
    val = '';
  }

  if (window.sessionStorage) {
    window.sessionStorage.setItem(key, JSON.stringify(val));
  }
}

export function loadSession(key, def) {
  if (!key) {
    return def;
  }
  if (window.sessionStorage) {
    let val = window.sessionStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return def;
      }
    }
  }
  return def;
}

export function loadCookie(key, def) {
  if (!key) {
    return def;
  }
  var arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
  if (arr) {
    try {
      return unescape(arr[2]);
    } catch (e) {
      return def;
    }
  }
  return def;
}

export function saveCookie(name, value, path, domain, expires) {
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
    ';path=' + opts.path +
    (domain ? ';domain=' + domain : '');
}

export function removeCookie(name, path, domain) {
  var opts = {
    name: name || '',
    path: path || '/'
  };
  var exp = new Date();
  exp.setTime(exp.getTime() - 1000);
  document.cookie = opts.name +
    '=;expires=' + exp.toGMTString() +
    ';path=' + opts.path +
    (domain ? ';domain=' + domain : '');
}

export function parseJson(val, def) {
  try {
    val = JSON.parse(val);
  } catch (e) {
    val = def;
  }
  return val;
}
