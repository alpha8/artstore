<template>
  <!--居住地址三级联动选项-->
  <section class="showChose" v-show="showChose">
    <section class="address">
      <section class="title">
        <span class="cancel" @click.stop.prevent="closeAdd()">取消</span>
        <h4>所在地区</h4>
        <span class="confirm" @click.stop.prevent="confirmAdd()">确定</span>
      </section>
      <section class="title selectline">
        <div class="area" @click.stop.prevent="provinceSelected()" :class="Province ? '' : 'active'" >{{Province ? Province : '选择省份'}}</div>
        <div class="area" @click.stop.prevent="citySelected()" :class="City ? '' : 'active'" v-show="Province">{{City ? City: '选择城市'}}</div>
        <div class="area" @click.stop.prevent="districtSelected()" :class="District ? '' : 'active'" v-show="showDistrict">{{District ? District: '选择区县'}}</div>
      </section>
      <ul class="border-1px">
        <li class="addList" v-for="(v,k) in info" @click.stop.prevent="getProvinceId(v.id, v.name, k)" v-show="showProvince" :class="v.selected ? 'active' : ''">{{v.name}}</li>
        <li class="addList" v-for="(v,k) in showCityList" @click.stop.prevent="getCityId(v.id, v.name, k)" v-show="showCity" :class="v.selected ? 'active' : ''">{{v.name}}</li>
        <li class="addList" v-for="(v,k) in showDistrictList" @click.stop.prevent="getDistrictId(v.id, v.name, k)" v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.name}}</li>
      </ul>
    </section>
  </section>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .showChose
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 120
    background: rgba(0, 0, 0, 0.5)
  .address
    position: absolute
    top: auto
    bottom:  0
    left: 0
    z-index: 121
    background: #fff
    width: 100%
  .title
    position: relative
    height: 50px
    line-height: 50px
    background: #f3f2f8
    display: flex
    font-size: 15px
    &.selectline
      background: none
      height: 40px
      line-height: 40px
    h4
      display: block
      flex: 1
      text-align: center
      line-height: 50px
      font-weight: normal
    .cancel, .confirm
      width: 70px
      height: 50px
      line-height: 50px
      float: left
      text-align: center
      color: #999
    .confirm
      float: right
      color: #ff463c
    .span2
      position: absolute
      display: inline-block
      top: 0
      right: 0
      width: 40px
      height: 40px
      i
        position: absolute
        top: 50%
        right: 10px
        width: 20px
        height: 20px
        margin-top: -8px
        text-align: center
        color: #333
        font-size: 14px
  .area
    position: relative
    width: 30%
    font-size: 15px
    line-height: 40px
    margin-right: 2%
    text-align: center
    color: #333
    &.active
      color: #ff463c
      border-bottom: 2px solid #ff463c
  .addList
    width: 100%
    padding-left: 10px
    font-size: 14px
    line-height: 25px
    color: #333
    &.active
      color: #ff463c
      &:after
        content: '\20'
        display: inline-block
        width: 20px
        height: 20px
        margin-left: 5px
        position: relative
        vertical-align: middle
        background: url(../../common/images/sprite_address_slide.png) no-repeat
        background-size: 20px 80px
        background-position: 0 -20px
  .address ul
    padding: 5px 10px
    max-height: 300px
    overflow-x: hidden
    overflow-y: auto
    -webkit-overflow-scrolling: touch
    overflow-scrolling: touch
    box-sizing: border-box
    border-top-1px(rgba(7, 17, 27, 0.1))
    &::-webkit-scrollbar
      display: none
    li
      position: relative
      padding: 10px 0
</style>

<script type="text/ecmascript-6">
  import citydata from '@/common/js/citydata';
  export default {
    data () {
      return {
        showChose: false,
        showProvince: true,
        showCity: false,
        showDistrict: false,
        showCityList: false,
        showDistrictList: false,
        province: 5,
        city: 3,
        district: 57,
        GetProvinceId: 2,
        District: false,
        Province: false,
        City: false,
        // v-for循环判断是否为当前
        selected: false,
        info: citydata.regionData || []
      };
    },
    methods: {
      choseAdd() {
        this.showChose = true;
      },
      closeAdd() {
        this.showChose = false;
      },
      confirmAdd() {
        if (!this.Province) {
          this.$store.dispatch('openToast', '请选择省份!');
          return;
        } else if (!this.City) {
          this.$store.dispatch('openToast', '请选择城市!');
          return;
        }
        //  else if (!this.District) {
        //   this.$store.dispatch('openToast', '请选择区县!');
        //   return;
        // }
        this.$emit('selectCity', {
          province: this.Province,
          city: this.City,
          district: this.District || ''
        });
        this.showChose = false;
      },
      _filter(add, name, code) {
        let result = [];
        for (let i = 0; i < add.length; i++) {
          if (code === add[i].id) {
            result = add[i][name];
          }
        }
        return result;
      },
      getProvinceId(code, input, index) {
        this.province = code;
        this.Province = input;
        this.showProvince = false;
        this.showCity = true;
        this.showDistrict = false;
        this.showCityList = this._filter(this.info, 'city', this.province);
        // 点击选择当前
        this.info.map(a => {
          a.selected = false;
        });
        this.info[index].selected = true;
      },
      provinceSelected() {
        // 清除市级和区级列表
        this.showCityList = false;
        this.showDistrictList = false;
        // 清除市级和区级选项
        this.Province = false;
        this.City = false;
        this.District = false;
        // 选项页面的切换
        this.showProvince = true;
        this.showCity = false;
        this.showDistrict = false;
      },
      getCityId(code, input, index) {
        this.city = code;
        this.City = input;
        this.showProvince = false;
        this.showDistrictList = this._filter(this.showCityList, 'district', this.city);
        if (this.showDistrictList.length) {
          this.showDistrict = true;
        } else {
          this.showDistrict = false;
        }
        this.showCity = false;
        // 选择当前添加active
        this.showCityList.map(a => {
          a.selected = false;
        });
        this.showCityList[index].selected = true;
      },
      citySelected() {
        this.showProvince = false;
        this.showCity = true;
        this.City = false;
        this.District = false;
        // this.showDistrictList = false;
        this.showDistrict = false;
      },
      getDistrictId(code, input, index) {
        this.district = code;
        this.District = input;
        // 选择当前添加active
        this.showDistrictList.map(a => {
          a.selected = false;
        });
        this.showDistrictList[index].selected = true;
        // 选取市区选项之后关闭弹层
        // this.showChose = false;
      },
      districtSelected() {
        this.showProvince = false;
        this.showCity = false;
        if (this.showDistrictList.length) {
          this.showDistrict = true;
        } else {
          this.showDistrict = false;
        }
      }
    }
  };
</script>
