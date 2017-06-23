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
  if (!key || !val) {
    return;
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
