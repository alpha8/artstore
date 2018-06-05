<template>
  <div class="signature_panel">
    <fixedheader title="在线签名"></fixedheader>
    <div class="panel">
      <canvas id="canvas" class="canvas"></canvas>
    </div>
    <button class="btnSave" @click.stop.prevent="save">保存签名</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  var draw;
  var defaultHandler = function (e) {
    e.preventDefault();
  };
  class Draw {
    constructor(el) {
      this.el = el;
      this.canvas = document.getElementById(this.el);
      this.context = this.canvas.getContext('2d');
      this.stage = this.canvas.getBoundingClientRect();
      this.path = {
        beginX: 0,
        beginY: 0,
        endX: 0,
        endY: 0
      };
    };

    init() {
      window.addEventListener('resize', this.resizeCanvas, false);
      this.resizeCanvas();
      let that = this;
      this.canvas.addEventListener('touchstart', function(event) {
        document.addEventListener('touchstart', defaultHandler, false);
        that.drawBegin(event);
      });

      this.canvas.addEventListener('touchend', function(event) {
        document.addEventListener('touchend', defaultHandler, false);
        that.drawEnd();
      });
      this.clear();
    };

    resizeCanvas() {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      this.canvas.width = this.canvas.offsetWidth * ratio;
      this.canvas.height = this.canvas.offsetHeight * ratio;
      this.canvas.getContext('2d').scale(ratio, ratio);
      this.clear();
    };

    drawBegin(e) {
      let that = this;
      window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
      this.context.beginPath();
      this.context.strokeStyle = '#000';
      this.context.lineWidth = 5;
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
      this.context.shadowBlur = 1;
      this.context.shadowColor = '#000';
      this.context.moveTo(
        e.changedTouches[0].clientX - this.stage.left,
        e.changedTouches[0].clientY - this.stage.top
      );
      this.path.beginX = e.changedTouches[0].clientX - this.stage.left;
      this.path.beginY = e.changedTouches[0].clientY - this.stage.top;
      this.canvas.addEventListener('touchmove', function(event) {
        that.drawing(event);
      });
    };

    drawing(e) {
      this.context.lineTo(
        e.changedTouches[0].clientX - this.stage.left,
        e.changedTouches[0].clientY - this.stage.top
      );
      this.path.endX = e.changedTouches[0].clientX - this.stage.left;
      this.path.endY = e.changedTouches[0].clientY - this.stage.top;
      this.context.stroke();
    };

    drawEnd() {
      document.removeEventListener('touchstart', defaultHandler, false);
      document.removeEventListener('touchend', defaultHandler, false);
      document.removeEventListener('touchmove', defaultHandler, false);
      window.removeEventListener('resize', this.resizeCanvas, false);
    };

    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    save(format) {
      return format ? this.canvas.toDataURL(format) : this.canvas.toDataURL('image/png');
    };
  }
  export default {
    name: 'signature',
    data () {
      return {
        msg: '签名位置'
      };
    },
    activated() {
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    },
    mounted() {
      draw = new Draw('canvas');
      draw.init();
    },
    methods: {
      clear() {
        draw.clear();
      },
      save() {
        var data = draw.save();
        this.url = data;
        console.log(data);
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .signature_panel
    position: absolute
    top: 0
    right: 0
    left: 0
    bottom: 0
    z-index: 999
    overflow: hidden
    .panel
      position: relative
      width: 100%
      height: 85%
      padding: 10px
      background: #ddd
      box-sizing: border-box
      .canvas
        width: 100%
        height: 100%
  .btnSave
    position: absolute
    width: 100px
    height: 40px
    line-height: 40px
    background: #1ab394
    font-weight: 700
    color: #fff
    border-radius: 20px
    border: 1px solid #1ab394
    bottom: 10px
    left: 50%
    margin-left: -50px
</style>
