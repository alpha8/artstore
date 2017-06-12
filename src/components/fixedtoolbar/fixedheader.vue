<template>
  <div class="header border-bottom-1px">
    <div class="left">
      <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
    </div>
    <h2 class="title">{{title}}</h2>
    <div class="right" v-show="rightIcon">
      <router-link :to="rightLink" class="search">
        <i :class="rightIcon"></i>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      rightIcon: {
        type: String,
        default: ''
      },
      rightLink: {
        type: String,
        default: ''
      }
    },
    methods: {
      back() {
        this.$router.back();
      }
    },
    activated() {
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'

  .header
    position: relative
    display: flex
    padding:0 8px
    background: #f2f2f2
    border-bottom-1px(#eee)
    height: 40px
    line-height: 40px
    text-align: center
    color: #9B9B9B
    .left
      flex: 30px 0 0
      i
        font-size: 18px
    .title
      flex: 1
      color: #666
    .right
      flex: 0 0 30px
      i
        font-size: 18px

</style>

