<template>
  <div>
    <fixedheader title="我的收藏"></fixedheader>
    <div class="follow">
      <div class="follow-wrap">
        <div class="follow-container" ref="followlist" v-show="follows.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="follow-list">
            <mu-flexbox-item basis="100%" class="follow-item border-1px" v-for="(follow, index) in follows" :key="follow.id">
              <div class="item-img" @click.stop.prevent="showProductDetail(follow)"><img :src="getThumbnail(follow.productPic)" alt=""></div>
              <div class="item-info" @click.stop.prevent="showProductDetail(follow)">
                <h3 class="title">{{follow.productName}}</h3>
                <div class="sub_title">{{follow.productSubTitle || ''}}</div>
                <div class="extra-wrap">
                  <div class="state-wrap">
                    <p class="line price">{{follow.productPrice | currency}}</p>
                  </div>
                  <div class="item-ops">
                    <span class="btn" @click.stop.prevent="removeItem(follow)">移除</span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <el-backtop target=".follow-container" :bottom="55" :right="10"></el-backtop>
        </div>
        <div class="no-follow" v-show="follows.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    data() {
      return {
        follows: [],
        loading: false
      };
    },
    activated() {
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    methods: {
      fetchData(force) {
        let userId = this.$store.getters.userId;
        this.loading = true;
        api.getProductCollect(userId || -1).then(response => {
          if (response.code == 200) {
            this.follows = response.data;
            this.loading = false;
          }
        }).catch(response => {
          this.loading = false;
        });
      },
      _reset() {
        this.follows = [];
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
      removeItem(product) {
        let userId = this.$store.getters.userId;
        api.removeProductCollect(userId || 0, product.productId).then(response => {
          if (response.code == 200) {
            this.$store.dispatch('openToast', '已取消收藏！');
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
  .follow
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    background: #fff
    .follow-wrap
      position: relative
      width: 100%
      background-color: #fff
      .follow-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        padding-bottom: 100px
        .follow-list
          position: relative
          width: 100%
          .follow-item
            position: relative
            display: flex
            margin-bottom: 5px
            padding: 10px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              display: inline-block
              float:left
              width: auto
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
                      color: #ff6325
                      font-size: 14px
                      font-weight: 700
                      padding-top: 7px
              .item-ops
                position: relative
                display: block
                float: right
                width: 90px
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
      .no-follow
        position: relative
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
