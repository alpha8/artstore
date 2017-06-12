<template>
  <div class="top_wrapper">
    <div class="top_item" v-for="channel in channels">
      <router-link :to="channel.url" class="top_url">
        <i :class="channel.icon" class="top_icon"></i>
        <h3 class="top_name">{{channel.name}}</h3>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      channels: {
        type: Array
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .top_wrapper
      display: flex
      padding: 15px 0
      width: 100%
      .top_item
        flex: 1
        text-align: center
        .top_url
          display: block
          .top_icon
            display: block
            width: 40px
            height: 40px
            margin: 0 auto
            font-size: 36px
            color: #00BB9C
          .top_name
            font-size: 12px
            color: #666
            text-align: center
            line-height: 1.2
            margin-top: 6px
            font-weight: 400
</style>
