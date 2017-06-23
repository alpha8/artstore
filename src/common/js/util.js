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
