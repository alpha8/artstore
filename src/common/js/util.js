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
