/* jshint esnext: true */
export function pay() {
  if (typeof WeixinJSBridge === 'undefined') {
   if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
   } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
   }
  } else {
    onBridgeReady();
  }
}

export function onBridgeReady(params, callback) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
      'appId': params.appId,
      'timeStamp': params.timeStamp || +new Date(),
      'nonceStr': params.nonceStr,
      'package': params.packageValue,
      'signType': params.signType || 'MD5',
      'paySign': params.paySign
    }, callback || function(res) {
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        console.log('支付成功！');
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        alert('取消支付！');
      } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
        alert('支付失败！');
      }
    });
}
