<template>
  <div class="floor" v-if="productList.length">
    <div class="title" v-if="category.titleIcon">
      <img :src="category.titleIcon" alt="">
    </div>
    <modal-title :title="category.name" moreText="更多" :key="category.name" :pid="category.id" v-else></modal-title>
    <router-link v-if="category.icon" :to="{name: 'search', query: {key: category.name || '', pid: category.id}}" class="banner">
      <img :src="category.icon" alt="">
    </router-link>
    <channel :items="productList" :cols="2"></channel>
  </div>
</template>

<script type="text/ecmascript-6">
  import channel from '@/components/channel/channel';
  import modalTitle from '@/components/modal-title/modal-title';
  export default {
    props: {
      category: {
        type: Object,
        default() {
          return {};
        }
      },
      productList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    components: {
      channel, modalTitle
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .floor
    position: relative
    width: 100%
    >.title
      text-align: center
      img
        max-width: 100%;
        height: 38px;
        border: none;
        interpolation-mode: bicubic;
        vertical-align: top;
    >.banner
      display: block
      margin: 0 8px
      box-sizing: border-box
      img
        display: block;
        width: 100%;
        border: none;
        interpolation-mode: bicubic;
        height: auto;
        max-height: 350px;
</style>
