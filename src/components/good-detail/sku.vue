<template>
  <div class="sku_main" v-show="dialogVisible">
    <div class="main">
      <div class="header">
        <img :src="getGoodsIcon" alt="" class="avt">
        <p class="price"><em>{{getGoodPrice | currency}}</em></p>
        <p class="prop"><span>已选</span> {{selectedText()}} {{goods.count}}个</p>
        <i class="close" style="background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaAgMAAADUJKRdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURQAAAAAAAEdwTAAAAA+kCggAAAAEdFJOUyoFADPFB4o9AAAAbklEQVQI11WPoRXAIAxET1VVVLMFe8R1gWrWyQKIGJiiin26Qa88ThTz3yM/yQVb52tA/hg3rJB+wBNpF2KwnCsahRgVnYInkoIVMgZLZMtUyW5nmvS9TMbTf9T/8tSnOZq79mivciiXcir3uuMFX3BjVwgV70oAAAAASUVORK5CYII=) 50% no-repeat; background-size: 11px auto; " @click="hideDialog"></i>
      </div>
      <div class="body">
        <div class="sku_area" v-for="(kind, index) in filterSkuList" :key="index">
          <div class="sku_kind">{{kind.key}}</div>
          <div class="sku_choose">
            <span class="item" v-for="(item, pos) in kind.value" :key="pos" :class="{'active': isChecked(item, kind), 'over': !availableSkuItem(item, kind)}" @click.stop.prevent="checkItem(item, kind)">{{item}}</span>
          </div>
        </div>
        <div class="count_choose">
          <div class="num_wrap">
            <el-input-number size="small" v-model="goods.count || 1" :min="1" :max="goods.stock"></el-input-number>
          </div>
          <p class="count">数量</p>
        </div>
      </div>
      <div class="btns_group">
        <div class="btn orange" @click.stop.prevent="addCart">加入购物车</div>
        <div class="btn red">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';

  export default {
    name: 'sku',
    data() {
      return {
        skuList: [],
        availableSku: [],
        skuChoose: [],
        checkedSpecs: ['', '', ''],
        maxLevel: -1,
        skuCategory: ['', '', ''],
        notExist: false
      };
    },
    computed: {
      goods() {
        return this.$store.getters.getSku;
      },
      getGoodPrice() {
        if (this.goods.plusPrice) {
          return this.goods.plusPrice;
        }
        return this.goods.price;
      },
      dialogVisible() {
        this.skuChoose = [];
        this.checkedSpecs = ['', '', ''];
        this.maxLevel = -1;
        this.availableSku = [];
        this.skuCategory = ['', '', ''];
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.goods.id);
        if (sku) {
          this.skuChoose = Object.assign(this.skuChoose, sku.spec);
          this.checkedSpecs = Object.assign(this.checkedSpecs, sku.checkedSpec);
        }
        return this.$store.getters.getSkuWindowVisible;
      },
      getGoodsIcon() {
        if (this.goods.pic) {
          return `${this.goods.pic}?imageView2/2/w/750/h/750`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      filterSkuList() {
        var skuSpecs = [];
        if (!this.goods.skuStockList) {
          return skuSpecs;
        }
        this.goods.skuStockList.map(item => {
          if (item.sp1) {
            var found = skuSpecs.find(o => o.key == item.sp1name);
            if (found && !found.value.includes(item.sp1)) {
              found.value.push(item.sp1);
            } else if (!found) {
              skuSpecs.push({ 
                key: item.sp1name || '类型', 
                level: 0,
                value: [item.sp1] 
              });
            }
            this.skuCategory[0] = item.sp1name;
            this.maxLevel = 0;
          }
          if (item.sp2) {
            var found2 = skuSpecs.find(o => o.key == item.sp2name);
            if (found2 && !found2.value.includes(item.sp2)) {
              found2.value.push(item.sp2);
            } else if (!found) {
              skuSpecs.push({ 
                key: item.sp2name || '类型1', 
                level: 1, 
                value: [item.sp2]
              });
            }
            this.skuCategory[1] = item.sp2name;
            this.maxLevel = 1;
          }
          if (item.sp3) {
            var found3 = skuSpecs.find(o => o.key == item.sp3name);
            if (found3 && !found3.value.includes(item.sp3)) {
              found3.value.push(item.sp3);
            } else if (!found) {
              skuSpecs.push({ 
                key: item.sp3name || '类型2', 
                level: 2, 
                value: [item.sp3] 
              });
            }
            this.skuCategory[2] = item.sp3name;
            this.maxLevel = 2;
          }
          if (item.stock > 0) {
            var key = `${item.sp1 || ''}_${item.sp2 || ''}_${item.sp3 || ''}_`;
            this.availableSku.push({key: key, stock: item.stock, price: item.price});
          }
        });
        this.skuList = skuSpecs;
        return this.skuList;
      }
    },
    methods: {
      showDialog() {
        this.$store.dispatch('showSkuWin');
      },
      hideDialog() {
        this.$store.dispatch('hideSkuWin');
      },
      reset() {
        this.maxLevel = -1;
        this.skuList = [];
        this.skuChoose = [];
        this.availableSku = [];
        this.checkedSpecs = ['', '', ''];
        this.skuCategory = ['', '', ''];
      },
      isChecked(item, kind) {
        return kind && this.skuChoose.find(o => o.key == kind.key && o.value == item);
      },
      checkItem(item, kind) {
        this.notExist = false;
        var found = this.skuChoose.find(o => o.key == kind.key);
        if (found) {
          found.value = found.value == item ? '' : item;
        } else {
          this.skuChoose.push({ key: kind.key, value: item });
        }
        this.checkedSpecs[kind.level] = found ? found.value : item;
        if (!this.isAvailable(item, kind)) {
          this.$message({
            message: '不存在此组合',
            type: 'warning',
            duration: 1200
          });
          this.checkedSpecs = ['', '', ''];
          this.checkedSpecs[kind.level] = item;
          this.skuChoose = [];
          this.skuChoose.push({ key: kind.key, value: item });
          this.notExist = true;
          return;
        }
        var key = `${this.checkedSpecs[0] || ''}_${this.checkedSpecs[1] || ''}_${this.checkedSpecs[2] || ''}_`;
        var matched = this.availableSku.find(sku => sku.key == key);
        if (matched) {
          this.goods.price = matched.price;
        }
        this.selectedText();
      },
      availableSkuItem(item, kind) {
        var lv1 = this.checkedSpecs[0] + '_';
        var lv2 = this.checkedSpecs[1] ? '_' + this.checkedSpecs[1] + '_' : this.checkedSpecs[1] + '_';
        var lv3 = this.checkedSpecs[2] ? '_' + this.checkedSpecs[2] + '_' : this.checkedSpecs[2] + '_';
        var that = item + '_';
        if (kind.level > 0) {
          that = '_' + that;
        }
        var enabled = false;
        this.availableSku.map(sku => {
          if (sku.key.includes(that) && sku.key.includes(lv1) && sku.key.includes(lv2) && sku.key.includes(lv3)) {
            enabled = true;
          } else if (sku.key.includes(that) && kind.level == 0) {
            enabled = true;
          }
        });
        return enabled;
      },
      isAvailable(item, kind) {
        var lv1 = item.level == 0 ? item + '_' : this.checkedSpecs[0] + '_';
        var lv2 = item.level == 1 ? '_' + item + '_' : (this.checkedSpecs[1] ? '_' + this.checkedSpecs[1] + '_' : this.checkedSpecs[1] + '_');
        var lv3 = item.level == 2 ? '_' + item + '_' : (this.checkedSpecs[2] ? '_' + this.checkedSpecs[2] + '_' : this.checkedSpecs[2] + '_');
        var that = item + '_';
        if (kind.level > 0) {
          that = '_' + that;
        }
        var enabled = false;
        this.availableSku.map(sku => {
          if (sku.key.includes(that) && sku.key.includes(lv1) && sku.key.includes(lv2) && sku.key.includes(lv3)) {
            enabled = true;
          }
        });
        return enabled;
      },
      selectedText() {
        var text = this.checkedSpecs.join(',').replace(/[,]+/g, ',');
        if (text.indexOf(',') == 0) {
          return text.replace(/[,]+/, '');
        }
        return text;
      },
      getSkuId() {
        var skuId = null;
        var searchSkuIdKey = '';
        this.checkedSpecs.map(item => {
          if (item) {
            searchSkuIdKey += item + '_';
          }
        });
        this.goods.skuStockList.map(item => {
          var txt = item.sp1 + '_';
          if (item.sp2) {
            txt += item.sp2 + '_';
          }
          if (item.sp3) {
            txt += item.sp3 + '_';
          }
          if (txt == searchSkuIdKey) {
            skuId = item.id;
          }
        });
        return skuId;
      },
      addCart() {
        if (this.notExist) {
          this.$message({
            message: '不存在此组合',
            type: 'warning',
            duration: 1200
          });
          return;
        }
        let selectedSku = this.checkedSpecs;
        var level = this.maxLevel;
        for (var i = 0; i <= level; i++) {
          if (!selectedSku[i]) {
            this.$store.dispatch('openToast', `请选择${this.skuCategory[i]}`);
            return;
          }
        }
        this.$store.dispatch('addSkuSpec', {
          id: this.goods.id,
          spec: this.skuChoose,
          checkedSpec: this.checkedSpecs,
          count: this.goods.count || 1
        });
        this.$store.dispatch('addToCart', {
          productId: this.goods.id,
          productSkuId: this.getSkuId(),
          quantity: this.goods.count || 1,
          productAttr: JSON.stringify(this.skuChoose || [])
        }).then(response => {
          this.$store.dispatch('openToast', {message: '加入购物车成功', icon: 'success'});
        }).catch(error => {
          this.$store.dispatch('openToast', {message: error || '网络开了小差，请稍候再试', icon: 'warning'});
          console.log(error);
        });
        this.hideDialog();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .sku_main
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: rgba(0,0,0,.7)
    .main
      position: absolute
      width: 100%
      height: 400px
      bottom: 0
      background: #fff
      transform: translate3d(0,0,0)
      transition: transform .2s cubic-bezier(0,0,.25,1),-webkit-transform .2s cubic-bezier(0,0,.25,1)
      .header
        height: 70px
        line-height: 46px
        padding: 0 0 10px 110px
        background-color: #fff
        position: relative
        font-size: 16px
        color: #333
        .avt
          position: absolute
          left: 10px
          top: -20px
          border-radius: 2px
          width: 90px
          height: 90px
          vertical-align: top
        .price
          display: inline-block
          height: 40px
          line-height: 40px
          color: #e4393c
          font-size: 16px
          font-family: arial,sans-serif
        .prop
          word-break: break-all
          font-size: 12px
          color: #333
          line-height: 1.4em
          padding-right: 10px
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          /*! autoprefixer: off */
          -webkit-box-orient:vertical
          /*! autoprefixer: on */
          span
            color: #999
        .close
          content: ""
          position: absolute
          top: 0
          right: 0
          width: 15px
          height: 15px
          padding: 10px
      .body
        box-sizing: border-box
        max-height: 379px
        padding-bottom: 200px
        overflow: auto
        -webkit-overflow-scrolling: touch
        .sku_kind
          font-size: 12px
          color: #999
          margin: 0 10px
          height: 35px
          line-height: 35px
        .sku_choose
          overflow: hidden
          margin-bottom: 3px
          .item
            display: inline-block
            padding: 0 10px
            min-width: 20px
            max-width: 270px
            overflow: hidden
            height: 30px
            line-height: 30px
            float: left
            text-align: center
            margin-left: 10px
            margin-bottom: 10px
            border-radius: 4px
            color: #333
            background-color: #f7f7f7
            font-size: 14px
            &.active
              background: linear-gradient(-41deg,#ff4f18,#ff2000 24%,#f10000)
              color: #fff
            &.over
              color: #ccc
    .count_choose
      padding: 0 10px 13px
      font-size: 12px
      .num_wrap
        position: relative
        z-index: 0
        width: 110px
        float: right
        vertical-align: middle
        display: flex
      .count
        color: #999
        height: 31px
        line-height: 31px
    .btns_group
      background-color: #fff
      width: 100%
      display: flex
      position: absolute
      bottom: 0
      >.btn
        height: 50px
        line-height: 50px
        color: #fff
        font-size: 16px
        text-align: center
        flex: 1
        &.red
          background: #ff463c
          color: #fff
        &.orange
          background: rgba(250,180,90,0.93)
          color: #fff
</style>
