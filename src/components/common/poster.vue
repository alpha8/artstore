<template>
  <div class="poster">
    <canvas id="canvas"></canvas>
    <!-- <div class="slide-wrap">
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12?w=750&h=500&v=v2" alt="" />
      </div>
    </div>
    <div class="slide-wrap">
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12?w=750&h=500&v=v2" alt="" />
      </div>
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5aaae397e4b060c567fd3b0f?w=750&h=500&v=v2" alt="" />
      </div>
    </div>
    <div class="poster-info">
      <div class="item-info">
        <h1 class="pname">[曦瓜] 正山小种(红茶.源味250g) [一虎一席.品牌榜]</h1>
        <div class="price"><span class="now">¥75</span><span class="old">¥100</span></div>
      </div>
      <div class="qrcode"><img src="http://www.yihuyixi.com/cms/qrcode/artwork?aid=5bdc5c49e4b009b7223c5238" border="0" width="120" height="120"></img></div>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        good: {
          id: '5bdc5c49e4b009b7223c5238',
          name: '[曦瓜] 正山小种(红茶.源味250g) [一虎一席.品牌榜]',
          sellPoint: '问鹤几时来？我本往来无定迹。',
          price: 75,
          marketPrice: 100,
          icons: ['http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12', 'http://imgcdn.yihuyixi.com/ps/download/5aaae398e4b060c567fd3b12', 'http://imgcdn.yihuyixi.com/ps/download/5aaae397e4b060c567fd3b0f']
        },
        offset: 0
      };
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    mounted() {
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
      var ratio = (window.devicePixelRatio || 1) / backingStore;
      var width = document.documentElement.offsetWidth;
      var height = document.documentElement.clientHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      var pixelWidth = width * ratio;
      var pixelHeight = height * ratio;
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      context.fillStyle = '#e1e1e1';
      context.fillRect(0, 0, pixelWidth, pixelHeight);

      var icons = this.good && this.good.icons || [];
      if (!icons.length) {
        return;
      }
      var mainImage = `${icons[0]}?w=${pixelWidth}&v=v2`;
      var promise = this.drawImage(context, mainImage, 0, 0);
      var that = this;
      promise.then(function(data) {
        that.offset = data.h + 5;

        if (icons.length >= 3) {
          var secondImage = `${icons[1]}?w=${data.w / 2}&v=v2`;
          var p2 = that.drawImage(context, secondImage, 0, data.h + 5);
          p2.then(function(result) {
            that.offset += result.h;
            that.drawProductInfo(context, that, pixelWidth);
          });

          var thirdImage = `${icons[2]}?w=${data.w / 2}&v=v2`;
          that.drawImage(context, thirdImage, data.w / 2 + 5, data.h + 5);
        } else {
          that.drawProductInfo(context, that, pixelWidth);
        }
      });
      promise.then(function(data) {
        // context.fillStyle = '#fff';
        // that.drawRoundedRect(context, 20, (data.h / 2) + data.h + 20, pixelWidth - 40, 350, 20, true, false);

        var qrcode = `http://www.yihuyixi.com/cms/qrcode/artwork?aid=${that.good.id}&size=180&margin=0`;
        that.drawImage(context, qrcode, pixelWidth - 220, pixelHeight - 220);
      });
    },
    methods: {
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      drawProductInfo(context, that, pixelWidth) {
        context.font = 'bold 24px "Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        context.fillStyle = '#07111b';
        // context.fillText(that.good.name, 20, that.offset + 40);
        that.offset += 20;
        that.drawMultiLineText(context, that.good.name, 20, that.offset, pixelWidth, 24);

        context.font = '20px "Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        context.fillStyle = '#07111b';
        that.offset += 25;
        context.fillText(that.good.sellPoint, 20, that.offset);

        context.font = 'bold 24px "Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        context.fillStyle = '#f01414';
        that.offset += 30;
        context.fillText(that.good.price, 20, that.offset);

        context.font = '20px "Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
        // canvas.style.textDecoration = 'line-through';
        context.fillStyle = '#93999f';
        var priceWidth = context.measureText(that.good.price).width;
        context.fillText(that.good.marketPrice, priceWidth + 50, that.offset);
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
  .poster
    position: absolute
    width: 100%
    top: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .slide-wrap
      position: relative
      display: flex
      width: 100%
      .slide
        flex: 1
        box-sizing: border-box
        margin-right: 5px
        &:last-child
          margin-right: 0
        img
          width: 100%
          height: auto
          overflow: hidden
    .poster-info
      position: relative
      display: flex
      align-items: center
      background-color: #fff
      border-radius: 20px
      margin: 10px 8px 0
      padding: 0 20px
      box-sizing: border-box
      .item-info
        flex: 1
        font-size: 14px
        padding-left: 5px
        box-sizing: border-box
        .pname
          font-weight: 700
          color: #07111b
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
        .price
          padding-top: 5px
          .now
            margin-right: 8px
            font-weight: 700
            color: #f01414
          .old
            text-decoration: line-through
            color: #93999f
      .qrcode
        text-align: right
</style>
