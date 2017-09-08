<template>
  <div>
    <div class="btns">
      <span class="btn-green" @click.stop.prevent="previewImage">微信图片预览</span>
    </div>
    <div class="btns">
      <span class="btn-green" @click.stop.prevent="chooseImage">本地图片选取</span>
    </div>
    <div class="btns"><span class="btn-green" @click.stop.prevent="checkAPI">支持微信JS接口</span></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import wx from 'weixin-js-sdk';
  export default {
    data() {
      return {
        pics: [
          'http://www.yihuyixi.com/ps/download/5959aca4e4b00faa50475a16',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a19'
        ],
        index: 0
      };
    },
    methods: {
      previewImage() {
        wx.previewImage({
          current: this.pics[this.index], // 当前显示图片的http链接
          urls: this.pics // 需要预览的图片http链接列表
        });
        this.index++;
      },
      chooseImage() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            alert(localIds);
          }
        });
      },
      checkAPI() {
        wx.checkJsApi({
          jsApiList: ['chooseImage', 'previewImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocalImgData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res) {
            let result = res.checkResult;
            let json = 'chooseImage: ' + result.chooseImage + ', previewImage: ' + result.previewImage + ', getLocalImgData: ' + result.getLocalImgData + ', onMenuShareTimeline: ' + result.onMenuShareTimeline + ', onMenuShareAppMessage: ' + result.onMenuShareAppMessage;
            alert(json);
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          }
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .btns
    padding: 0 15px
</style>

