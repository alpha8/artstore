<template>
  <div class="modal-popup" v-show="isShow" @click.stop.prevent="hideDialog">
    <div class="modal-popup-content content-top">
      <div class="invite-user-share-overlay">
        <div class="share-overlay-arrow">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAACdCAMAAACD4T1DAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMAKRPxvehDOJStbVzYy02gHXuHxxjfKQAAA1VJREFUeNrt3Um2pCAQBdCglR7x7X+vhX4t89Sk/jgfd5LjRJoICFF46aaFWnYoQmyrmJSw0hGXJKSGAWAsEIVSK5jirgAnhJTFVLyIGGAXOgcmk+RkgSxkvMMUtFwGEIRMBWCV3Dz4IoIAl+UFgC4sfJ9//ukSTUjlaxIMwCGkytUCDbDCyQNm/ujzh1MEwt0VNmGknrSwsyZH4cmJNuMoE+QdrJ3/EXiXgLcLeGHW2buAou8C9LOAJPaFQMRThgDLsiy3XsiXgUF7TnZTzGell8oeDR6AoQ6GNvYxoB37GLCAIzwrfw0Qn5CdPAhPyv+dBKow29gnAZFQyROCZaGmuc8GRJRDF2aKPRs4G8Awr4OrAc4GYJ4IN/YG8Ia8ARrI54AMgLNO7GGBwp0PZ2PpCueX5dG4h7+oCkc9ASQDypcIH7sFYOjeIXxlB6DyhkHKAsRvTt2v0zreREAVkJ8MWgDcx0IBhro+ZFKsYdCemHeBRFSnvk9GmgXzjTp6FJws6ShoEZdIugA2h5MJtEmgxWQpU0AtlwR3EM5//nhvDaGLflQOFWBNfVSwBheu3Q+tnmXO4VaP7y8L1nkcoUdbHab6toCz40v/vVYtjxBtehe5l5GLSt+5/69TiMXgoeVU8Zcr37rcP48z4lORizqOkXLz6isfusiWQjVw+qMFTLH9SJkgtt9SL7j5O7NLjWZXR1u8HGN9Z3rW8z48y1M/6dytkpMyKD0RjPVP26gAbz2vDw4/hhBq0TzDfpB1/B/HM+NnpjnvUwdQDsaHr/39GwZPBv/BR87Nm5tOhXnlExUMTpay84tsd4oXSP+/rzjVL93K+D9NfXB30gbopN3/phJr4KdoB/4T9pHf7ZUMqFvAF0zxS3ezf/sprEpauDNlAzBXbu4WU2ddAK8dX8DxDgCRTFrA8SFa4gxgIdcqcQR4GuyfO4gA9UusewXA/Bq/cuRBgDfkF/xmkF9mk9jvcklgv8vFApV4EZh8Yax7W5blR+vkWyGN/opzQ30k9JMMFeY4QBfyUFgs+2dwDwDUxQGNtR78odiXASlAEWaB/atf0slnQRF9kDfAsizcsuOOhGQ3vNeb/YjswaBnT4mlgPyrTwkwzPtiIp27SGDaI3OZyPQHaBsyKjAyrZsAAAAASUVORK5CYII=">
        </div>
        <div class="share-overlay-text">
          点击右上角“<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAALVBMVEUAAAD///////////////////////////////////////////////////////+hSKubAAAADnRSTlMA9+MjW9iknQy+hnxOQ2+AFToAAACISURBVDjLYxgFo4AugLlIdAWU6Sk4BcrqClQ3AFIH3717ZAAWYHv37l0CRL3eu3cyQEoOKBIAFtkHZL0Gs1iBrIcGDOzvgOAJSIBDDiTSAGL6gQQLGJhA1DOQAO87ELgAYuaBWAoMjCDqJUiABSznAGLOA7EE8OnDZx8+d+LxH95wGQWjgFoAAGibdWlz6hRXAAAAAElFTkSuQmCC">”按钮,
        </div>
        <div class="share-overlay-text">
          <p>选择“发送给朋友<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABXCAMAAAD4QHEDAAAApVBMVEUAAADx8u/08/Lt6+vY1NLZ1NHr6ejn5OPZ1dLk4eDg3Nnq6Ofq6Ofc2Nbu7evk4d7f29nf29nb2NXa1tPu7evv7ezf3Nrq6Off3Nn18/L++P339vUAqgMarhjX6dONzoZ7x3Pk7+EKrA6Dynvd69kApAC+4rnR580usSrq8Od0xm1jwVzI5MS23rGe1ZiV0o9Etz4lryKr2aVYvVE6tDRsw2VOukcRY01MAAAAGXRSTlMA/tzdLAnSqRqKhMfCZOfBd1lKPfbvba6mVH+5dAAAA+pJREFUaN7s0EEPgyAMhuF1RaCCRiVAKv//fy7Ey06mmB522HtvnvR7/ftq8mkhFy3ieyhEGx0tyU8PXbPPLmKGKxYFVxmjm3fzSPYHxbV7zwJYIx1+3DWlInDrjavXGWAtZnjmLcCNKdQhbINzG7I3rpwGS2bI3SzfsSCW2W4Dsi99Z1aor1281J2OCp1VkusxCV1D2BqryUhGJvs99ofVZIi7bOw0r00TbuucRPDi+sOaL7tFBFNgXZgDiWCH2jA6ERyyNpyDCLagDYMVwQisHOBvw+9huJ1n04bl8oe3OsuNGITBAKz0FgEDCQlLAtmX+x+thjCdt0pV5fnfIqR8MmBT/QJ/kcCcD31bM1ZX/4Xrv4Vxt+8O4frTMItdUD37haaCXSPWuU03rPogzBmTnTb3PqBMDheypFfeQMgyOfx2OeOu88aIMFWMEcNFxT5y0dppCR4AxJVkTgrzrEq7L90YwnGfQogkW5Qp4cS2dm7CfXohNGgtsryNFtfoYHSHuFzrBq8gnGU/ppop4DKX5RxO8UIxqBa5cbhMAqNbRXVr86rznQ0MhEgFo2tHX1T95F3xqiTRVqM7XcIAJKfk+RIa4FSuZpwCxnLi+COm67x5f/qtnHCXT5gGTlPqUYVf73CNjVLNsencTZHT9DG67bwaY0D7OzRq3icbo5RT80yu3MUUMP7WBjAgztDN1vVDxVmKVMSzOr1Dm4FznK1sUfnU64Tl2QPgWGybKy3O8x5/s2Nvqw3DMBiA8WMssuVTEtcmqbN17P0fbRZ0DQU7LVS+GPS/DIIvcRxZ5DoJdIBJiPlUzqAbC/sEcsojuR1gKBos6Zu6ccn9zGV+TKCLZLPDdDSsycz79L7D5zxT4xhK2GECxq9c2bkANmCskAwwgMB5Rlzn6g4SAga41ggARpgax+VyDkhu/TX81ZQKVnj0UprQ6hAAVINGSo/MMBKM7S/mBo/cT6zd3dM0bs5pflg9A6s3zAZDy4V+sPN2OIz1rg+sH8G6E2yWGG0zMS6mA4xeTZvPWTeTs98m5bEDPKlPdZjpRVhUl3pz0snDlIKtutTiBdiuOiXzICnp1fLBFBAWQ8DjUIUV3H/2hifzIf4f/FuuGaRQCMNQkND+9lurAclC739RExFduUgbMOADwY2MdNmZ791Xv6YGqr0Mqb71z1DthZdvxfea1BSNa+mPReP6Ftes6jMw2YgLefl5jxOOHIPJJlxNjiHkwuTu8kW4JWqTG6StiywfE0pyo1ucskRGHdsg5Cm2ZFUFAwGcv8/P9Xbv8UQAKGBZ/q0h2YppJlCP5oSrhGTt6RyjxxSUSyNjj3TO4XYsKpNoLDmyLAAAAABJRU5ErkJggg==">”
          </p>
          <p>即可邀请好友<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAAt1BMVEUAAABHBF5LBV5QB11VCVyKFVNvEFjmJzh8E1SXGU94ElWlG01bClzfJjvGIkK0HkrMI0C9IEmmHEr0K0HWJD69IET/LT/TJT7bJkfkKEHPJEiBFFO3H0eqHUqTF09lDVl/FVT8LEBSCF3tKUOVGE7mKDn/LD/xKTX/1jT/3TH8FUDjFTjiBDf2LD/nHjn9ez/sUjn/vTb/5C/6mDr8szf/xzX6LDH/jz3/Z0H8PEH/VkD5pDvwZjuPTE4EAAAAJXRSTlMADBglM3dO8lmIZ5hE7NKp2rOo5+rC8uHM3MCKz8CafDntXt64mIPkawAAAjxJREFUSMed1Ol2okAQBWB7YVdB0LjrmKRtkEXck0ze/7kGZsg0VJtDx/sT/KyGe4pOLdg09V8Eo87PYk6CyWzgOpZWcKrstWBb5mkTTH/AkbbZiihz7DxtU6FqPngRXMLElQXk04HZgWzwvRBUg6w7ayHlIwTSNH2iMG3aBQrZLwpsQhFgVW0iuzLg2owAhi2jYbYf+/3+YwucCwsgjsFZmv5X+0sUXg6394Z7chBg1GecMcbTSoXHKAyj8NYYtrFg23TAC1bB3duhUAWLLm/1cYEGWXdUqCrZ7haWqhx3arx/G4MXqfcFi7PfUcWiw3tZdJqWZ+GeDpk9rk2La4xljFe3eL8LGNZ6grF4Hx2/DhmLy3xEASOWUWfs/PdFRtE5T4RiLsF3ahNJ8nNhjtH5M8kEMxxyrzaRLMlPh8vhlMcJE6xnYXSvNpHi5/lnzpKY1dhQEwzUJs6ZJHGcsTobw9o6ZW1t4Z4p16bA+rBtMu8psBFsW381eKviLpUYa2cM1oaelwrMsDBkC97OerA2vO4rsOEcHJKsPc4UGIVsqNL2mkrbptK2zFRqWzyTJiMrFbaEjPoqbb/qGG6bStsriqVtu8vgtqFHts0GCpme0rZBZqttG3qkNpcCRiwV5khMqTaLSB/J6wPbhqhvcM6vV17mOza1EWBYtxx31PeGveL2V+SPZKFgMKG6qc1X/nLRHw97hvBSbXJQobu6/Y97DX6VapP1Hc59KlgrL71pa5bv2kQwZV/+g2B/AFINAaiK5BpYAAAAAElFTkSuQmCC">
          </p>
        </div>
      </div>
    </div>
    <div class="modal-popup-backdrop"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
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
          top: 10px
          right: 35px
          border: 0
        .share-overlay-text
          text-align: center
          color: #fff
          font-size: 14px
          margin-bottom: 12px
          line-height: 1.5
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
