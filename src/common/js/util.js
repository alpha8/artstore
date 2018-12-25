/* jshint esnext: true */
/**
 * 解析url参数
 * @example ?id=1111&a=b
 * @return Object {id: 1111, a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let o = {};
  let regex = /[?&][^?&]+=[^?&]*/g;
  let arr = url.match(regex);
  if (arr) {
    arr.forEach((item) => {
      let temp = item.substring(1).split('=');
      let key = decodeURIComponent(temp[0]);
      let val = decodeURIComponent(temp[1]);
      o[key] = val;
    });
  }
  return o;
}

/**
 * currency货币价格
 */
// const digitsRE = /(\d{3})(?=\d)/g;
export function currency (value, cur, decimals) {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) {
    return '';
  }
  cur = cur != null ? cur : '¥';
  decimals = decimals != null ? decimals : 2;
  var regex = /^([0-9]*)$/;
  if (regex.test(Math.abs(value))) {
    decimals = 0;
  }
  return cur + Math.abs(value).toFixed(decimals);
  /*
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : '';
  var _float = decimals ? stringified.slice(-1 - decimals) : '';
  var sign = value < 0 ? '-' : '';
  return sign + cur + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float;
  */
}

export function mixUsername (name) {
  if (!name) {
    return '匿名';
  }
  if (name === 'yihuyixi') {
    return name;
  }
  if (name.length === 3) {
    return name.substring(0, 1) + '***' + name.substring(name.length - 1);
  } else if (name.length === 4) {
    return name.substring(0, 2) + '***' + name.substring(name.length - 1);
  } else if (name.length > 4) {
    return name.substring(0, 2) + '***' + name.substring(name.length - 2);
  }
  return name.substring(0, 1) + '***';
}

/**
 * 替换[]多余品牌名称
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function reduceGoodsName (str) {
  if (!str) {
    return '';
  }
  return str.replace(/\[一[^]+\]/, '');
}

/**
 * 格式化时间
 * @param {String} str
 * @returns 格式化后的时间
 */
export const formatDate = (str) => {
  if (!str) {
    return '';
  }
  var date = new Date(str);
  var time = new Date().getTime() - date.getTime(); // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
      return '';
  } else if ((time / 1000 < 30)) {
      return '刚刚';
  } else if (time / 1000 < 60) {
      return parseInt((time / 1000)) + '秒前';
  } else if ((time / 60000) < 60) {
      return parseInt((time / 60000)) + '分钟前';
  } else if ((time / 3600000) < 24) {
      return parseInt(time / 3600000) + '小时前';
  } else if ((time / 86400000) < 31) {
      return parseInt(time / 86400000) + '天前';
  } else if ((time / 2592000000) < 12) {
      return parseInt(time / 2592000000) + '月前';
  } else {
      return parseInt(time / 31536000000) + '年前';
  }
};

/**
 * 判断设备类型
 * @return {Boolean} [description]
 */
export function Device() {
  let ua = window.navigator.userAgent.toLowerCase();
  let isWeixin = (ua.indexOf('micromessenger') !== -1 || ua.indexOf('micromessage') !== -1);
  let isAndroid = ua.indexOf('android') !== -1;
  let isIos = (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1);
  return {
    isWeixin: isWeixin,
    isAndroid: isAndroid,
    isIos: isIos
  };
};

export function fixFontSize() {
  if (typeof WeixinJSBridge === 'undefined') {
   if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
   } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', handleFontSize);
    document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
   }
  } else {
    handleFontSize();
  }
}

function handleFontSize() {
  // 设置网页字体为默认大小
  WeixinJSBridge.invoke('setFontSizeCallback', {
    'fontSize': 0
  });
  // 重写设置网页字体大小的事件
  WeixinJSBridge.on('menu:setfont', function () {
    WeixinJSBridge.invoke('setFontSizeCallback', {
      'fontSize': 0
    });
  });
}

export function getBlob(base64) {
  return b64toBlob(getData(base64), getContentType(base64));
}

function getContentType(base64) {
  return /data:([^;]*);/i.exec(base64)[1];
}

function getData(base64) {
  return base64.substr(base64.indexOf('base64,') + 7, base64.length);
}

function b64toBlob(b64data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  var bytechars = atob(b64data);
  var byteArrays = [];
  for (var offset = 0; offset < bytechars.length; offset += sliceSize) {
    var slice = bytechars.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export function convertVideoUrl(url) {
  return url.replace('https://', 'http://')
    .replace('http://', '')
    .replace(/v\.qq\.com\/x\/cover\/[\w]+\/([\w]+)\.html/i, 'v.qq.com/iframe/player.html?vid=$1&tiny=0&auto=0')
    .replace(/v\.qq\.com\/x\/cover\/([\w]+)\.html/i, 'v.qq.com/iframe/player.html?vid=$1&tiny=0&auto=0');
}

export function reportTrackEvent(eventId, params) {
  if (MtaH5) {
    MtaH5.clickStat(eventId, params);
  }
}
