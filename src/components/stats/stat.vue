<template>
  <div>
    <fixedheader title="数据统计" :showBack="false"></fixedheader>
    <div class="stats" ref="stats">
      <div class="stats-wrapper">
        <h1 class="title">统计概况</h1>
        <ul class="summary">
          <li @click.stop.prevent="showDetail('visitusers')">
            <span class="nums">{{totalUv}}</span>
            <span class="label">独立用户</span>
          </li>
          <li @click.stop.prevent="showDetail('productdetail')">
            <span class="nums">{{goodsUv}}</span>
            <span class="label">商品详情</span>
          </li>
          <li @click.stop.prevent="showDetail('articledetail')">
            <span class="nums">{{articleUv}}</span>
            <span class="label">文章详情</span>
          </li>
          <li @click.stop.prevent="showDetail('groupbuydetail')">
            <span class="nums">{{groupbuyUv}}</span>
            <span class="label">团购详情</span>
          </li>
          <li @click.stop.prevent="showDetail('home')">
            <span class="nums">{{homeUv}}</span>
            <span class="label">首页访问</span>
          </li>
          <li @click.stop.prevent="showDetail('category')">
            <span class="nums">{{categoryUv}}</span>
            <span class="label">分类访问</span>
          </li>
          <li @click.stop.prevent="showDetail('usercenter')">
            <span class="nums">{{ucUv}}</span>
            <span class="label">个人中心</span>
          </li>
          <li @click.stop.prevent="showDetail('pay')">
            <span class="nums">{{payUv}}</span>
            <span class="label">下单人数</span>
          </li>
          <li @click.stop.prevent="showDetail('sharepaydetail')">
            <span class="nums">{{bargaindetail}}</span>
            <span class="label">砍价详情</span>
          </li>
          <li @click.stop.prevent="showDetail('createbargain')">
            <span class="nums">{{createbargain}}</span>
            <span class="label">发起砍价</span>
          </li>
          <li @click.stop.prevent="showDetail('tuandetail')">
            <span class="nums">{{tuandetail}}</span>
            <span class="label">拼团详情</span>
          </li>
          <li @click.stop.prevent="showDetail('createtuan')">
            <span class="nums">{{createtuan}}</span>
            <span class="label">开团人数</span>
          </li>
          <li>
            <span class="nums" v-if="stats.unlogin">{{stats.unlogin.unlogin || 0}}/{{stats.unlogin.all || 0}}</span>
            <span class="nums" v-else>0</span>
            <span class="label">拒授权次数</span>
          </li>
          <li>
            <span class="nums">{{stats.alllogin || 0}}</span>
            <span class="label">授权总人数</span>
          </li>
          <li>
            <span class="nums">{{stats.allView || 0}}</span>
            <span class="label">访客总人数</span>
          </li>
          <li @click.stop.prevent="openMyDetail('wipbargain')">
            <span class="nums">{{stats.sharecount || 0}}</span>
            <span class="label">正在砍价数</span>
          </li>
          <li @click.stop.prevent="openMyDetail('wiptuan')">
            <span class="nums">{{stats.tuancount || 0}}</span>
            <span class="label">正在拼团数</span>
          </li>
        </ul>
        <split v-if="users.length"></split>
        <h1 class="title" v-if="users.length">访问详情</h1>
        <table class="detail_list" v-if="users.length">
          <tr class="head">
            <td class="col">ID</td>
            <td class="col-4">缩略图</td>
            <td class="col-2">用户昵称</td>
            <td class="col-3">点击数</td>
          </tr>
          <tr v-for="(item, idx) in users" :key="idx">
            <td class="col">{{idx + 1}}</td>
            <td class="col-4"><img :src="getUserIcon(item)" class="icon" /></td>
            <td class="col-2">{{(item.nickName) || '匿名'}}</td>
            <td class="col-3" @click.stop.prevent="getUserLog(item)">{{item.pv || 0}}</td>
          </tr>
        </table>
        <split></split>
        <h1 class="title">商品访问详情</h1>
        <table class="detail_list">
          <tr class="head">
            <td class="col">ID</td>
            <td class="col-1">商品图</td>
            <td class="col-2">商品名称</td>
            <td class="col-3">用户数</td>
          </tr>
          <tr v-for="(item, idx) in topList" :key="idx">
            <td class="col">{{idx + 1}}</td>
            <td class="col-1" @click.stop.prevent="openGoodDetail(item)"><img :src="getThumbnail(item)" class="thumbnail" /></td>
            <td class="col-2" @click.stop.prevent="openGoodDetail(item)">{{fillName(item)}}</td>
            <td class="col-3" @click.stop.prevent="showPvDetail(item)">{{item.count}}</td>
          </tr>
        </table>
        <split></split>
        <h1 class="title">文章访问详情</h1>
        <table class="detail_list">
          <tr class="head">
            <td class="col">ID</td>
            <td class="col-1">文章图</td>
            <td class="col-2">文章名</td>
            <td class="col-3">用户数</td>
          </tr>
          <tr v-for="(item, index) in articleList" :key="index">
            <td class="col">{{index + 1}}</td>
            <td class="col-1" @click.stop.prevent="openArticleDetail(item)"><img :src="getThumbnail(item)" class="thumbnail" /></td>
            <td class="col-2" @click.stop.prevent="openArticleDetail(item)">{{fillName(item)}}</td>
            <td class="col-3" @click.stop.prevent="showPvDetail(item)">{{item.count}}</td>
          </tr>
        </table>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="layerWin"></layer>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import modalTitle from '@/components/modal-title/modal-title';
  import split from '@/components/split/split';
  import layer from '@/components/common/layer';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';

  export default {
    data() {
      return {
        scrollY: 0,
        layer: {
          title: '系统提示',
          text: '',
          button: {
            text: '知道了!'
          }
        },
        topList: [],
        articleList: [],
        uvList: [],
        totalUv: 0,
        homeUv: 0,
        goodsUv: 0,
        categoryUv: 0,
        ucUv: 0,
        payUv: 0,
        articleUv: 0,
        groupbuyUv: 0,
        tuandetail: 0,
        bargaindetail: 0,
        createtuan: 0,
        createbargain: 0,
        users: [],
        stats: {}
      };
    },
    activated() {
      this.show();
      this._initScroll();
    },
    deactivated() {
      this.hide();
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        let dateStr = this.$route.query.dateStr || '';
        api.stats({
          dateStr: dateStr
        }).then(response => {
          if (response.result === 0) {
            if (response.allstat) {
              this.totalUv = response.allstat.visitusers && response.allstat.visitusers.length || 0;
              this.homeUv = response.allstat.home && response.allstat.home.length || 0;
              this.goodsUv = response.allstat.productdetail && response.allstat.productdetail.length || 0;
              this.categoryUv = response.allstat.category && response.allstat.category.length || 0;
              this.ucUv = response.allstat.usercenter && response.allstat.usercenter.length || 0;
              this.payUv = response.allstat.pay && response.allstat.pay.length || 0;
              this.articleUv = response.allstat.articledetail && response.allstat.articledetail.length || 0;
              this.groupbuyUv = response.allstat.groupbuydetail && response.allstat.groupbuydetail.length || 0;
              this.tuandetail = response.allstat.tuandetail && response.allstat.tuandetail.length || 0;
              this.bargaindetail = response.allstat.sharepaydetail && response.allstat.sharepaydetail.length || 0;
              this.createtuan = response.allstat.createtuan && response.allstat.createtuan.length || 0;
              this.createbargain = response.allstat.createbargain && response.allstat.createbargain.length || 0;
              this.stats = response.allstat;
            }
          }
        });
        this.$store.dispatch('openLoading');
        api.topGoods({
          dateStr: dateStr
        }).then(response => {
          if (response.result === 0) {
            this.topList = response.tops || [];
            this._initScroll();
          }
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
        // 查询文章访问列表
        api.topGoods({
          dateStr: dateStr,
          type: 'articledetail'
        }).then(response => {
          if (response.result === 0) {
            this.articleList = response.tops || [];
            this._initScroll();
          }
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.stats, {
              click: true,
              bounce: false,
              probeType: 3
            });
          } else {
            this.scroll.refresh();
          }
          this.scroll.on('scroll', (pos) => {
            let offset = Math.abs(Math.round(pos.y));
            if (this.scrollY !== offset) {
              this.scrollY = offset;
            }
          });
        });
      },
      fillName(item) {
        let name = item.name || '';
        return name.replace('[一虎一席]', '');
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=750&h=500&v=v2';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getUserIcon(item) {
        return item.icon || api.CONFIG.usericon;
      },
      showDetail(key) {
        if (this.stats) {
          this.users = this.stats[key] || [];
          this._initScroll();
        }
      },
      openMyDetail(uri) {
        this.$router.push({name: uri});
      },
      openGoodDetail(item) {
        this.$router.push({name: 'good', params: {id: item.pid}});
      },
      openArticleDetail(item) {
        this.$router.push({name: 'articledetail', params: {id: item.pid}});
      },
      showPvDetail(item) {
        let dateStr = this.$route.query.dateStr || '';
        this.$router.push({name: 'uvdetail', query: {id: item.pid, dateStr: dateStr}});
      },
      getUserLog(item) {
        let dateStr = this.$route.query.dateStr || '';
        let uid = item.userId || '';
        let unlogin = item.nickName || '';
        if (!uid && !unlogin) {
          return;
        }
        if (uid) {
          this.$router.push({name: 'uvdetail', query: {userId: uid, dateStr: dateStr}});
        } else if (unlogin) {
          this.$router.push({name: 'uvdetail', query: {unlogin: unlogin, dateStr: dateStr}});
        }
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      goTop() {
        let statsWrapper = this.$refs.stats.getElementsByClassName('stats-wrapper')[0];
        this.scroll.scrollToElement(statsWrapper, 300);
      }
    },
    components: {
      fixedheader, split, layer, modalTitle, gotop
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .stats
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .stats-wrapper
      position: relative
      width: 100%
      padding-bottom: 20px
      box-sizing: border-box
      overflow: hidden
      background-color: #fff
      .title
        position: relative
        padding: 10px
        font-size: 15px
        font-weight: 700
      .summary
        position: relative
        display: flex
        flex-wrap: wrap
        li
          display: block
          width: 25%
          text-align: center
          padding: 10px
          box-sizing: border-box
          .nums
            display: block
            padding-bottom: 5px
            font-size: 16px
            font-weight: 700
          .label
            display: block
            font-size: 14px
            color: #999
      .tips
        width: 100%
        padding: 10px 0
        font-size: 12px
        text-align: center
        color: #ccc
    .detail_list
      position: relative
      width: 100%
      font-size: 12px
      background-color: #fff
      color: #666
      tr
        display: flex
        height: 40px
        line-height: 40px
        &:nth-child(odd)
          background: #fafafa
      >.head
        background-color: #fafafa
        font-size: 13px
      .col, .col-1, .col-2, .col-3
        padding-left: 5px
        box-sizing: border-box
      .col
        width: 35px
        padding-left: 10px
      .col-1
        width: 18%
      .col-2
        flex: 1
        word-break: break-all
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 1
        -webkit-box-orient: vertical
        overflow: hidden
      .col-3, .col-4
        width: 15%
        text-align: center
        word-break: break-all
        overflow: hidden
      .col-4
        width: 18%
      .text-center
        text-align: center
      .thumbnail
        width: 45px
        height: auto
        vertical-align: middle
        overflow: hidden
        box-sizing: border-box
      .icon
        width: 32px
        height: 32px
        margin-right: 5px
        border-radius: 50%
        vertical-align: middle
        box-sizing: border-box
        overflow: hidden
</style>
