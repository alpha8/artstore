<template>
  <div>
    <fixedheader title="我的足迹"></fixedheader>
    <div class="footprint">
      <div class="footprint-wrap">
        <div class="footprint-container" ref="footprintlist" v-show="footprints.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="footprint-list">
            <mu-flexbox-item basis="100%" class="footprint-item border-1px" v-for="(footprint, index) in footprints" :key="index">
              <div class="item-img" @click.stop.prevent="showProductDetail(footprint)"><img :src="getThumbnail(footprint.productPic)" alt=""></div>
              <div class="item-info" @click.stop.prevent="showProductDetail(footprint)">
                <h3 class="title">{{footprint.productName}}</h3>
                <div class="sub_title">{{footprint.productSubTitle || ''}}</div>
                <div class="extra-wrap">
                  <div class="state-wrap">
                      <p class="line price">{{footprint.productPrice | currency}}</p>
                    </div>
                  <div class="item-ops">
                    <span class="btn" @click.stop.prevent="removeItem(footprint)">移除</span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <el-backtop target=".footprint-container" :bottom="55" :right="10"></el-backtop>
        </div>
        <div class="no-footprint" v-show="footprints.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
      </div>
    </div>
    <div class="footer" v-show="footprints.length">
      <div class="btns"><span class="btn-red" @click.stop.prevent="clearAll()">清空所有足迹</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    data() {
      return {
        footprints: [],
        loading: false
      };
    },
    activated() {
      this.fetchData();
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    methods: {
      fetchData() {
        let userId = this.$store.getters.userId;
        this.loading = true;
        api.getFootprint({memberId: userId || -1}).then(response => {
          if (response.code == 200) {
            this.footprints = response.data;
            this.loading = false;
          }
        }).catch(response => {
          this.loading = false;
        });
      },
      _reset() {
        this.footprints = [];
      },
      getThumbnail(icon) {
        if (icon) {
          return icon;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      showProductDetail(product) {
        this.$router.push({name: 'good', params: {id: product.productId}});
      },
      removeItem(footprint) {
        let params = new URLSearchParams();
        params.append('ids', [footprint.id]);
        this.doClear(params);
      },
      clearAll() {
        var ids = [];
        this.footprints.map(item => {
          if (item.id) {
            ids.push(item.id);
          }
        });
        this.$confirm('确认清空所有足迹吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append('ids', ids);
          this.doClear(params);
        });
      },
      doClear(params) {
        api.removeFootprint(params).then(response => {
          if (response.code == 200) {
            this.$store.dispatch('openToast', '删除成功!');
            this.fetchData();
          }
        });
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    top: 0
    width: 100%
    height: 44px
    overflow: hidden
    z-index: 2
  .footer
    position: fixed
    bottom: 0
    width: 100%
    height: 47px
    overflow: hidden
    z-index: 2
    .btns
      margin: 0 auto
      height: 47px
      line-height: 47px
      font-size: 14px
      box-sizing: border-box
      .btn-red
        background: #e4393c
        color: #fff
        border-radius: 0
  .footprint
    position: absolute
    top: 44px
    bottom: 47px
    width: 100%
    background-color: #fff
    .footprint-wrap
      position: relative
      width: 100%
      background-color: #fff
      .no-more
        width: 100%
        padding: 10px 0 70px
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .footprint-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        padding-bottom: 100px
        .footprint-list
          position: relative
          width: 100%
          .footprint-item
            display: flex
            padding: 10px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              display: inline-block
              width: auto
              float: left
              img
                width: 100px
                height: 100px
                margin-right: 10px
                overflow: hidden
            .item-info
              position: relative
              flex: 1
              box-sizing: border-box
              overflow: hidden
              >.title
                position: relative
                color: #666
                font-size: 14px
                padding-top: 8px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                /*! autoprefixer: off */
                -webkit-box-orient:vertical
                /*! autoprefixer: on */
                line-height: 1.2
              >.sub_title
                color: #999
                font-size: 12px
                padding-top: 8px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 1
                /*! autoprefixer: off */
                -webkit-box-orient:vertical
                /*! autoprefixer: on */
                line-height: 1.2
              .extra-wrap
                position: absolute
                display: flex
                width: 100%
                bottom: 10px
                .state-wrap
                  position: relative
                  display: block
                  flex: 1
                  .line
                    padding-bottom: 1px
                    line-height: 15px
                    font-size: 12px
                    color: #666
                    &:last-child
                      padding-bottom: 0
                    &.price
                      color: #d05148
                      font-size: 14px
                      font-weight: 400
                      padding-top: 7px
              .item-ops
                position: relative
                display: block
                float: right
                width: 80px
                .btn
                  display: inline-block
                  float: right
                  height: 25px
                  line-height: 25px
                  padding: 0 15px
                  background: #e4393c
                  color: #fff
                  border-radius: 2px
                  font-size: 11px
                  &.white
                    color: #ff8c00
                    background: #fff
                    border: 1px solid rgba(7, 17, 27, 0.1)
      .no-footprint
        position: relative
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
