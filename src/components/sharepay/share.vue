<template>
  <div class="modal-popup" v-show="isShow" @click.stop.prevent="hideDialog">
    <div class="modal-popup-content content-top">
      <div class="invite-user-share-overlay">
        <div class="share-overlay-arrow">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAACdCAMAAACD4T1DAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMAKRPxvehDOJStbVzYy02gHXuHxxjfKQAAA1VJREFUeNrt3Um2pCAQBdCglR7x7X+vhX4t89Sk/jgfd5LjRJoICFF46aaFWnYoQmyrmJSw0hGXJKSGAWAsEIVSK5jirgAnhJTFVLyIGGAXOgcmk+RkgSxkvMMUtFwGEIRMBWCV3Dz4IoIAl+UFgC4sfJ9//ukSTUjlaxIMwCGkytUCDbDCyQNm/ujzh1MEwt0VNmGknrSwsyZH4cmJNuMoE+QdrJ3/EXiXgLcLeGHW2buAou8C9LOAJPaFQMRThgDLsiy3XsiXgUF7TnZTzGell8oeDR6AoQ6GNvYxoB37GLCAIzwrfw0Qn5CdPAhPyv+dBKow29gnAZFQyROCZaGmuc8GRJRDF2aKPRs4G8Awr4OrAc4GYJ4IN/YG8Ia8ARrI54AMgLNO7GGBwp0PZ2PpCueX5dG4h7+oCkc9ASQDypcIH7sFYOjeIXxlB6DyhkHKAsRvTt2v0zreREAVkJ8MWgDcx0IBhro+ZFKsYdCemHeBRFSnvk9GmgXzjTp6FJws6ShoEZdIugA2h5MJtEmgxWQpU0AtlwR3EM5//nhvDaGLflQOFWBNfVSwBheu3Q+tnmXO4VaP7y8L1nkcoUdbHab6toCz40v/vVYtjxBtehe5l5GLSt+5/69TiMXgoeVU8Zcr37rcP48z4lORizqOkXLz6isfusiWQjVw+qMFTLH9SJkgtt9SL7j5O7NLjWZXR1u8HGN9Z3rW8z48y1M/6dytkpMyKD0RjPVP26gAbz2vDw4/hhBq0TzDfpB1/B/HM+NnpjnvUwdQDsaHr/39GwZPBv/BR87Nm5tOhXnlExUMTpay84tsd4oXSP+/rzjVL93K+D9NfXB30gbopN3/phJr4KdoB/4T9pHf7ZUMqFvAF0zxS3ezf/sprEpauDNlAzBXbu4WU2ddAK8dX8DxDgCRTFrA8SFa4gxgIdcqcQR4GuyfO4gA9UusewXA/Bq/cuRBgDfkF/xmkF9mk9jvcklgv8vFApV4EZh8Yax7W5blR+vkWyGN/opzQ30k9JMMFeY4QBfyUFgs+2dwDwDUxQGNtR78odiXASlAEWaB/atf0slnQRF9kDfAsizcsuOOhGQ3vNeb/YjswaBnT4mlgPyrTwkwzPtiIp27SGDaI3OZyPQHaBsyKjAyrZsAAAAASUVORK5CYII=">
        </div>
        <div class="share-overlay-text firstnode">
          点击右上角 “<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAALVBMVEUAAAD///////////////////////////////////////////////////////+hSKubAAAADnRSTlMA9+MjW9iknQy+hnxOQ2+AFToAAACISURBVDjLYxgFo4AugLlIdAWU6Sk4BcrqClQ3AFIH3717ZAAWYHv37l0CRL3eu3cyQEoOKBIAFtkHZL0Gs1iBrIcGDOzvgOAJSIBDDiTSAGL6gQQLGJhA1DOQAO87ELgAYuaBWAoMjCDqJUiABSznAGLOA7EE8OnDZx8+d+LxH95wGQWjgFoAAGibdWlz6hRXAAAAAElFTkSuQmCC">” 按钮,
        </div>
        <div class="share-overlay-text">
          <p>选择 “发送给朋友”或者“分享到朋友圈”</p>
          <p>好友进入分享链接</p>
          <p>即可完成商品减价</p>
          <p v-show="needPayTips">记得在优惠清零之前，完成付款哦!</p>
        </div>
      </div>
    </div>
    <div class="modal-popup-backdrop"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      needPayTips: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isShow: false
      };
    },
    methods: {
      hideDialog() {
        this.isShow = false;
      },
      show() {
        this.isShow = true;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .modal-popup
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 10000
    .modal-popup-content
      display: flex
      position: absolute
      z-index: 10
      top: 0
      left: 0
      right: 0
      bottom: 64px
      display: block
      .invite-user-share-overlay
        position: relative
        padding-top: 90px
        .share-overlay-arrow
          width: 129px
          height: 100%
          position: absolute
          top: 5px
          right: 35px
          border: 0
        .share-overlay-text
          text-align: center
          color: #fff
          font-size: 14px
          margin-bottom: 12px
          line-height: 1.5
          &.firstnode
            margin-top: 3px
          img
            height: 27px
          p
            margin-bottom: 12px
      img
        max-width: 100%
        width: auto
        height: auto
        vertical-align: top
  .modal-popup-backdrop
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: -1
    transition: all 0.5s
    background: rgba(7,17,27,0.6)
</style>
