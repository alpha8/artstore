<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <div class="main-content">
            <div class="text" @click.stop.prevent="viewPicture"><canvas id="canvas"></canvas></div>
            <div class="footer">
              <div class="btn-group" @click.stop.prevent="savePicture"><span>保存商品海报</span></div>
            </div>
          </div>
          <div class="btn-close" @click.stop.prevent="hide"><i class="icon-close"></i></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  export default {
    data() {
      return {
        offset: 0,
        isOpen: false,
        good: {}
      };
    },
    mounted() {
      var good = {
        id: '5bdc5c49e4b009b7223c5238',
        name: '[曦瓜] 正山小种(红茶.源味250g) [一虎一席.品牌榜]',
        sellPoint: '问鹤几时来？我本往来无定迹。',
        price: 75,
        oldPrice: 500,
        pictures: [{
          id: '5aaae398e4b060c567fd3b12'
        }, {
          id: '5aaae398e4b060c567fd3b12'
        }, {
          id: '5aaae397e4b060c567fd3b0f'
        }]
      };
      this.drawPoster(good);
      this.show();
    },
    methods: {
      show() {
        this.isOpen = true;
      },
      hide() {
        this.isOpen = false;
      },
      viewPicture() {
        var canvas = document.getElementById('canvas');
        var base64 = canvas.toDataURL('image/jpeg', 0.85);
        console.log(base64);
        wx.previewImage({
          current: base64,
          urls: [base64]
        });
      },
      savePicture() {
        this.viewPicture();
        this.hide();
      },
      drawPoster(good) {
        console.log(good);
        this.good = good || {};
        this.offset = 0;
        this.posterImage = '';
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var backingStore = context.backingStorePixelRatio ||
                      context.webkitBackingStorePixelRatio ||
                      context.mozBackingStorePixelRatio ||
                      context.msBackingStorePixelRatio ||
                      context.oBackingStorePixelRatio ||
                      context.backingStorePixelRatio || 1;
        var ratio = Math.round((window.devicePixelRatio || 1) / backingStore);
        var width = document.documentElement.offsetWidth;
        var height = document.documentElement.clientHeight;
        // canvas.style.width = (width - 30) + 'px';
        canvas.style.height = '500px';

        var pixelWidth = width * ratio;
        var pixelHeight = height * ratio;
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        context.fillStyle = '#e1e1e1';
        context.fillRect(0, 0, pixelWidth, pixelHeight);
        console.log('width=' + pixelWidth + ', height=' + pixelHeight + ', ratio=' + ratio);

        var icons = this.good && this.good.pictures || [];
        if (!icons.length) {
          return;
        }
        var mainImage = `${api.CONFIG.psCtx}${icons[0].id}?w=${pixelWidth}&v=v2`;
        var promise = this.drawImage(context, mainImage, 0, 0);
        var that = this;
        promise.then(function(data) {
          that.offset = data.h + 5;

          if (icons.length >= 3) {
            var secondImage = `${api.CONFIG.psCtx}${icons[1].id}?w=${data.w / 2}&v=v2`;
            var p2 = that.drawImage(context, secondImage, 0, data.h + 5);
            p2.then(function(result) {
              that.offset += result.h;
              that.drawProductInfo(context, that, pixelWidth);
            });

            var thirdImage = `${api.CONFIG.psCtx}${icons[2].id}?w=${data.w / 2}&v=v2`;
            that.drawImage(context, thirdImage, data.w / 2 + 5, data.h + 5);
          } else {
            that.drawProductInfo(context, that, pixelWidth);
          }
        });
        promise.then(function(data) {
          // context.fillStyle = '#fff';
          // that.drawRoundedRect(context, 20, (data.h / 2) + data.h + 20, pixelWidth - 40, 350, 20, true, false);

          var qrcode = `http://www.yihuyixi.com/cms/qrcode/artwork?aid=${that.good.id}&size=180&margin=0`;
          that.drawImage(context, qrcode, pixelWidth - 200, pixelHeight - 200);
        });
      },
      drawProductInfo(context, that, pixelWidth) {
        var fontfamily = '"Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        context.font = `bold 24px ${fontfamily}`;
        context.fillStyle = '#07111b';
        // context.fillText(that.good.name, 20, that.offset + 40);
        that.offset += 20;
        that.drawMultiLineText(context, that.good.name, 20, that.offset, pixelWidth, 30);

        context.font = `20px ${fontfamily}`;
        context.fillStyle = '#07111b';
        that.offset += 25;
        context.fillText(that.good.sellPoint, 20, that.offset);

        context.font = `bold 24px ${fontfamily}`;
        context.fillStyle = '#f01414';
        that.offset += 35;
        context.fillText(that.good.price, 20, that.offset);

        context.font = `20px ${fontfamily}`;
        context.fillStyle = '#93999f';
        var priceWidth = context.measureText(that.good.price).width;
        context.fillText(that.good.oldPrice, priceWidth + 50, that.offset);
        context.fillStyle = '#000';
        context.moveTo(priceWidth + 50, that.offset - 8);
        var oldPrice = context.measureText(that.good.oldPrice);
        context.lineTo(priceWidth + 50 + oldPrice.width, that.offset - 8);
        context.stroke();
      },
      drawImage(ctx, url, x, y) {
        return new Promise(function(resolve, reject) {
          var img = new Image();
          img.src = url;
          img.onload = function() {
            ctx.drawImage(this, x, y, this.width, this.height);
            resolve({w: this.width, h: this.height});
          };
        });
      },
      drawMultiLineText(ctx, word, x, y, width, fontSize) {
        var rows = [];
        var chars = word.split('');
        var tmp = '';
        for (var i = 0, len = chars.length; i < len; i++) {
          tmp += chars[i];
          if (ctx.measureText(tmp).width >= width - 50) {
            rows.push(tmp);
            tmp = '';
          }
        }
        rows.push(tmp);
        for (var j = 0; j < rows.length; j++) {
          ctx.fillText(rows[j], x, y + (j + 1) * fontSize);
          this.offset += (fontSize + 10);
          y += 10;
        }
      },
      drawRoundedRect(ctx, x, y, width, height, r, fill, stroke) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + r, r);
        ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
        ctx.arcTo(x, y + height, x, y + height - r, r);
        ctx.arcTo(x, y, x + r, y, r);
        if (fill) {
          ctx.fill();
        }
        if (stroke) {
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: rgba(7, 17, 27, 0.6)
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      position: relative
      width: 100%
      height: 100%
      box-sizing: border-box
      overflow: auto
      -webkit-overflow-scrolling: touch
      .detail-main
        position: absolute
        top: 50%
        left: 0
        width: 100%
        height: auto
        box-sizing: border-box
        transform: translate(0, -50%)
        .main-content
          position: relative
          height: auto
          margin: 0 20px
          border-radius: 15px
          box-sizing: border-box
          background: #fff
          overflow: hidden
          .text
            font-size: 14px
            line-height: 1.4
            text-align: center
            box-sizing: border-box
            background: #e1e1e1
            moz-user-select: -moz-none
            -moz-user-select: none
            -o-user-select: none
            -khtml-user-select: none
            -webkit-user-select: none
            -ms-user-select: none
            user-select: none
          .footer
            padding: 10px 25px
            text-align: center
            box-sizing: border-box
            .btn-group
              display: flex
              margin: 0
              height: 35px
              line-height: 35px
              padding: 0 50px
              font-size: 14px
              text-align: center
              border-radius: 2px
              text-align: center
              span
                flex: 1
                border-radius: 5px
                background: rgba(250,180,90,0.93)
                color: #fff
                box-sizing: border-box
        .btn-close
          position: absolute
          width: 24px
          height: 24px
          border-radius: 100%
          background: #fff
          border: 1px solid #e1e1e1
          right: 10px
          top: -10px
          clear: both
          font-size: 24px
          padding: 2px
          color: #e4393c
          box-shadow: 0px 1px 20px 0px #dfdbdb
</style>
