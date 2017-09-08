/* jshint esnext: true */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

export function countdown(time) {
  let days = Math.floor(time / 3600 / 24);
  let hours = Math.floor(time / 3600) - (days * 24);
  let mins = Math.floor(time / 60) - (days * 24 * 60) - (hours * 60);
  let seconds = Math.floor(time) - (days * 24 * 3600) - (hours * 3600) - (mins * 60);
  return {
    days: days,
    hours: hours,
    mins: mins,
    seconds: seconds,
    milliseconds: time
  };
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
