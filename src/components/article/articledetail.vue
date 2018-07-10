<template>
  <div>
    <fixedheader title="文章详情" right-icon="icon-more"></fixedheader>
    <div class="article-wrap" ref="article">
      <div class="article article-hook">
        <h1 class="article-title">{{article.title}}</h1>
        <div class="article-meta">
          <span class="time">{{article.postTime}}</span>
          <span class="catname" @click.stop.prevent="showCategory(article)">{{article.categoryName}}</span>
          <span class="author">{{article.author}}</span>
        </div>
        <div class="article-content articleContentHook" v-html="article.content" ref="articleContent"></div>
        <split v-show="article.videos && article.videos.length"></split>
        <div class="article-content" v-show="article.videos && article.videos.length">
          <h1 class="title">文章视频</h1>
          <div class="player">
            <div id="tencent_video_player">
              <video oncontextmenu="return false;" controls="controls" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://www.yihuyixi.com/ps/download/5a4c7ceae4b065c96d6562dc" v-for="v in article.videos">
                <source :src="v.url" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
        <div class="article-footer">
          <span class="pv">[ 阅读: {{article.pv}} ]</span>
        </div>
        <split v-show="article.relates && article.relates.length"></split>
        <modal-title :title="article.relateTile || '猜你喜欢'" moreText="更多" catKey="" catName="" v-show="article.relates && article.relates.length"></modal-title>
        <channel :items="article.relates" :cols="2" v-show="article.relates && article.relates.length"></channel>
        <split v-if="showFollow"></split>
        <modal-title title="关于「一虎一席茶席艺术商城」" catKey="" catName="" v-show="showFollow"></modal-title>
        <div v-if="showFollow" class="wx_follow">
          <img :src="wxqrcode" border="0" @click.stop.prevent="previewQrcode" />
        </div>
      </div>
      <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      <frame></frame>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import frame from '@/components/common/myiframe';
  import gotop from '@/components/fixedtoolbar/gotop';
  import split from '@/components/split/split';
  // import {formatDate} from '@/common/js/date';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  export default {
    data() {
      return {
        scrollY: 0,
        article: {},
        lazyloaded: false,
        processing: false,
        previewImgList: [],
        showFollow: true,
        wxqrcode: api.CONFIG.wxqrcode
      };
    },
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.hide();
      this.processing = false;
      this.lazyloaded = false;
    },
    updated() {
      if (!this.processing && this.article.content) {
        this.processing = true;
        this.lazyload();
        this.bindPictureEvent();
      }
      this._initScroll();
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        this.$store.dispatch('openLoading');
        let user = this.$store.getters.getUserInfo;
        let anon = '';
        if (!user.userId) {
          anon = this.$store.getters.getAnonymous;
        }
        api.getArticleDetail(id, {
          type: 'articledetail',
          stat: 1,
          unlogin: anon
        }).then(res => {
          if (res.result === 1) {
            this.$store.dispatch('closeLoading');
            return;
          }
          this.article = res;
          this.show();
          this.processing = false;
          this.$store.dispatch('closeLoading');
          this.wxReady();
          // this.getWXFollow();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.article, {
              click: true,
              bounce: false,
              probeType: 3,
              preventDefaultException: {
                className: /(^|\s)articleContentHook(\s|$)/,
                tagName: /^(P|SPAN)$/
              }
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
      bindPictureEvent() {
        if (!this.previewImgList.length) {
          return;
        }
        if (this.lazyloaded) {
          let imgs = this.$refs.articleContent.getElementsByTagName('img');
          for (let j = 0; j < imgs.length; j++) {
            imgs[j].addEventListener('click',
              (e) => {
                let pic = (e.target || e.srcElement).src;
                if (pic) {
                  pic = pic.substring(0, pic.lastIndexOf('?'));
                  wx.previewImage({
                    current: pic,
                    urls: this.previewImgList
                  });
                }
            }, false);
          }
        }
      },
      wxReady() {
        api.wxsignature(encodeURIComponent(location.href.split('#')[0])).then(response => {
          wx.config({
            // debug: true, // 开启调试模式
            appId: response.appId,      // 必填，公众号的唯一标识
            timestamp: response.timestamp,  // 必填，生成签名的时间戳
            nonceStr: response.nonceStr,   // 必填，生成签名的随机串
            signature: response.signature,  // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
          });
        });
        let redirect = 'http://' + location.host + location.pathname + '#/article/' + this.article.id;
        let ios = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        if (!ios) {
          redirect = 'http://' + location.host + '/weixin/t/' + this.article.id;
        }
        let uid = this.$store.getters.getUserInfo.userId;
        if (uid) {
          redirect += '?userId=' + uid;
        }
        let icon = 'http://www.yihuyixi.com/ps/download/5a60046ae4b0a5130574a5fc';
        if (this.article.wxSharePic) {
          icon = api.CONFIG.psCtx + this.article.wxSharePic + '?w=423&h=423';
        }
        let shareData = {
          title: '[一虎一席] ' + this.article.title,
          desc: this.article.summary,
          link: redirect,
          imgUrl: icon,
          success: function () {
          }
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      lazyload() {
        let w = window.innerWidth;
        let picImgList = [];
        let imgs = this.$refs.articleContent.getElementsByTagName('img');
        let prefix = 'http://www.yihuyixi.com';
        let html = this.article.content;
        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          let src = img.getAttribute('data-original');
          if (src) {
            let width = img.getAttribute('width');
            let height = img.getAttribute('height');
            let key = 'img class="lazy" data-original="' + src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"';
            let suffix = '';
            if (width) {
              suffix += ' width="' + width + '"';
            }
            if (height) {
              suffix += ' height="' + height + '"';
            }
            let key2 = key + ' alt=""' + suffix;
            key += suffix;
            if (src.indexOf('http:') < 0 && src.indexOf('https:') < 0) {
              src = prefix + src;
            }
            if (src.lastIndexOf('?') < 0) {
              src += '?1';
            }
            src = src + '&w=750';
            html = html.replace(key, 'img src="' + src + '" width="' + w + '" style="margin-left: -8px; margin-bottom: 3px;"').replace(key2, 'img src="' + src + '" width="' + w + '" style="margin-left: -8px; margin-bottom: 3px;"');
            if (width && width > 100) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            } else if (width === null) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            }
          }
        }
        if (picImgList.length) {
          this.previewImgList = picImgList;
          this.lazyloaded = true;
          this.processing = false;
        }
        this.article.content = html;
      },
      getWXFollow() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.showFollow = true;
          return;
        }
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0 && response.user) {
            this.showFollow = (response.user.follow === 0 || response.user.follow === 2);
          }
        }).catch(response => {
          console.error(response);
        });
      },
      showCategory(article) {
        this.$router.push({name: 'articles'});
      },
      goTop() {
        let hook = this.$refs.article.getElementsByClassName('article-hook')[0];
        this.scroll.scrollToElement(hook, 300);
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
        this._initScroll();
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      previewQrcode() {
        wx.previewImage({
          current: this.wxqrcode,
          urls: [this.wxqrcode]
        });
      }
    },
    components: {
      gotop, fixedheader, split, modalTitle, channel, frame
    },
    filters: {
      formatDate(time) {
        if (time && time.length > 11) {
          time = time.substring(0, 10);
        }
        return time;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .article-wrap
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    background: #fff
    overflow: hidden
  .article
    position: relative
    width: 100%
    padding: 10px 0
    box-sizing: border-box
    .article-title
      padding: 0 8px 2px
      line-height: 1.3
      font-size: 20px
      font-weight: 700
      color: #07111b
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 3
      -webkit-box-orient: vertical
    .article-meta
      padding: 0 8px 10px
      height: 24px
      line-height: 24px
      font-size: 15px
      color: #999
      span
        display: inline-block
        vertical-align: middle
        padding-right: 8px
        &:last-child
          padding-right: 0
        &.catname
          color: #4f7eaa
    .article-footer
      padding: 1px 8px 9px
      font-size: 14px
      color: #999
      .source
        line-height: 1.3
      .pv
        padding-left: 4px
    .article-content
      padding: 0 8px
      font-size: 16px
      color: #4d555d
      line-height: 1.45
      box-sizing: border-box
      overflow-x: hidden
      .title
        line-height: 14px
        padding: 10px 7px
        font-size: 14px
        color: #07111b
      #tencent_video_player
          width: 100%
          height: auto
          overflow: hidden
          video
            object-fit: cover
    .wx_follow
      position: relative
      width: 100%
      height: auto
      overflow: hidden
      img
        position: relative
        width: 100%
        height: auto
</style>
