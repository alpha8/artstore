<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="poster" @click.stop.prevent="viewPicture"><canvas id="canvas"></canvas></div>
      <div class="btn-close" @click.stop.prevent="hide"><i class="icon-close"></i></div>
      <div class="save-tips" @click.stop.prevent="savePicture">点击图片，保存商品海报</div>
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
        good: {},
        ratio: 1
      };
    },
    // mounted() {
    //   var good = {
    //     id: '5bdc5c49e4b009b7223c5238',
    //     name: '[曦瓜] 正山小种(红茶.源味250g) [一虎一席.品牌榜]',
    //     sellPoint: '问鹤几时来？我本往来无定迹。',
    //     price: 75,
    //     marketPrice: 500,
    //     icons: ['http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12', 'http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12', 'http://imgcdn.yihuyixi.com/ps/download/5aaae397e4b060c567fd3b0f']
    //   };
    //   this.drawPoster(good);
    // },
    methods: {
      show() {
        this.isOpen = true;
      },
      hide() {
        this.isOpen = false;
      },
      viewPicture() {
        var canvas = document.getElementById('canvas');
        var base64 = canvas.toDataURL('image/png');
        wx.previewImage({
          current: base64,
          urls: [base64]
        });
      },
      savePicture() {
        this.viewPicture();
        this.hide();
      },
      drawPoster(good, qrcode) {
        this.good = good || {};
        this.offset = 0;
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var backingStore = context.backingStorePixelRatio ||
                      context.webkitBackingStorePixelRatio ||
                      context.mozBackingStorePixelRatio ||
                      context.msBackingStorePixelRatio ||
                      context.oBackingStorePixelRatio ||
                      context.backingStorePixelRatio || 1;
        var ratio = Math.round((window.devicePixelRatio || 1) / backingStore);
        this.ratio = ratio;
        var width = document.documentElement.offsetWidth;
        var height = document.documentElement.clientHeight;
        canvas.style.width = `${width}px`;
        // canvas.style.height = `${height}px`;

        var pixelWidth = width * ratio;
        var pixelHeight = height * ratio;
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, pixelWidth, pixelHeight);
        console.log(`width=${width}, height=${height}, deviceWidth=${pixelWidth}, deviceHeight=${pixelHeight}, ratio=${ratio}`);

        var icons = this.good && this.good.pictures || [];
        if (!icons.length) {
          return;
        }
        var mainImage = `http://www.yihuyixi.com/ps/download/${icons[0].id}?w=${pixelWidth}&v=v2`;
        var promise = this.drawImage(context, mainImage, 0, 0);
        var that = this;
        promise.then(function(data) {
          that.offset = data.h + 5;

          if (icons.length >= 3) {
            var secondImage = `http://www.yihuyixi.com/ps/download/${icons[1].id}?w=${Math.round(data.w / 2)}&v=v2`;
            var p2 = that.drawImage(context, secondImage, 0, data.h + 5);
            p2.then(function(result) {
              that.offset += result.h;
              that.drawProductInfo(context, that, pixelWidth);
            });

            var thirdImage = `http://www.yihuyixi.com/ps/download/${icons[2].id}?w=${Math.round(data.w / 2)}&v=v2`;
            that.drawImage(context, thirdImage, data.w / 2 + 5, data.h + 5);
          } else {
            that.drawProductInfo(context, that, pixelWidth);
          }
        });
        promise.then(function(data) {
          // context.fillStyle = '#fff';
          // that.drawRoundedRect(context, 20, (data.h / 2) + data.h + 20, pixelWidth - 40, 350, 20, true, false);
          if (qrcode) {
            that.drawImage(context, qrcode, pixelWidth - 220, pixelHeight - 220);
          }
        });
      },
      drawProductInfo(context, that, pixelWidth) {
        var fontfamily = '"Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        var titleFontSize = 14;
        context.font = `bold ${titleFontSize * that.ratio}px ${fontfamily}`;
        context.fillStyle = '#07111b';
        // context.fillText(that.good.name, 20, that.offset + 40);
        that.offset += 20;
        that.drawMultiLineText(context, that.good.name, 20, that.offset, pixelWidth, 30);

        var sellpointFontSize = 12.5;
        context.font = `${sellpointFontSize * that.ratio}px ${fontfamily}`;
        context.fillStyle = '#07111b';
        that.offset += sellpointFontSize * that.ratio + 5;
        context.fillText(that.good.sellPoint, 20, that.offset);

        context.font = `bold ${titleFontSize * that.ratio}px ${fontfamily}`;
        context.fillStyle = '#f01414';
        that.offset += titleFontSize * that.ratio + 10;
        context.fillText('¥' + that.good.price, 20, that.offset);

        context.font = `${12 * that.ratio}px ${fontfamily}`;
        context.fillStyle = '#93999f';
        var priceWidth = context.measureText(that.good.price).width;
        var marginLeft = 30 * that.ratio;
        context.fillText('¥' + that.good.oldPrice, priceWidth + marginLeft, that.offset);
        context.fillStyle = '#666';
        context.strokeStyle = '#666';
        context.moveTo(priceWidth + marginLeft, that.offset - 10);
        var oldPrice = context.measureText(that.good.oldPrice);
        context.lineTo(priceWidth + marginLeft + oldPrice.width, that.offset - 10);
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
    background: #fff
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: #fff
    .btn-close
      position: absolute
      width: 24px
      height: 24px
      border-radius: 100%
      background: #fff
      border: 1px solid #e1e1e1
      right: 15px
      top: 15px
      clear: both
      font-size: 24px
      padding: 2px
      color: #e4393c
      box-shadow: 0px 1px 20px 0px #dfdbdb
    .save-tips
      position: absolute
      display: block
      bottom: 15px
      left: 45%
      box-sizing: border-box
      background: transparent
      border: 1px solid #e1e1e1
      box-shadow: 0px 1px 20px 0px #dfdbdb
      transform: translate(-50%, -50%)
      box-sizing: border-box
      font-size: 13px
      padding: 8px 10px
      text-align: center
      border-radius: 5px
      color: #666
</style>
