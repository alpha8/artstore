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
const digitsRE = /(\d{3})(?=\d)/g;
export function currency (value, cur, decimals) {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) {
    return '';
  }
  cur = cur != null ? cur : '￥';
  decimals = decimals != null ? decimals : 2;
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : '';
  var _float = decimals ? stringified.slice(-1 - decimals) : '';
  var sign = value < 0 ? '-' : '';
  return sign + cur + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float;
}
