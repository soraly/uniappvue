<template>
  <view class="ball-list">
    <view :style="setItemStyle(index,data.children.length)" v-for="(item, index) in data.children" :class="current == item.id ? 'ball-item selected' : 'ball-item'" :key="item.id" @click="onClickItem(item)">
      <uni-row>
        <uni-col :span="12">
          <view class="left">
            <view class="num" :style="setBgColor(item.code,colorList)">{{item.name}}</view>
          </view>
        </uni-col>
        <uni-col :span="12">
          <view class="right">
            <view class="mark">{{missOrMatchText(item)}}</view>
            <view class="num">
              {{ item.odds }}
            </view>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>
<script>
import UniRow from "../../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../../uni_modules/uni-row/components/uni-col/uni-col";
import Playing from "../../../../utils/common/playing";
import {mapGetters} from "vuex";

export default {
  name: "index",
  props:{
    data:{
      type : Object,
      default: null,
    },
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  data () {
    return {
      current:null,
      playing:new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      bgImg: {
        'bg_1': require('../../../../static/img/liuhe/ball/1.png'),
        'bg_2': require('../../../../static/img/liuhe/ball/1.png'),
        'bg_3': require('../../../../static/img/liuhe/ball/1.png')
      },
    }
  },
  components: {UniCol, UniRow},
  watch:{
    orderList(){
      this.setDefaultSelected()
    }
  },
  mounted(){
    // console.log("aaaa", this.ballChildren)
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
      console.log("orderList:",this.orderList);
      let selectedIds = this.orderList.length ? this.orderList.map(i => i.playId) : []
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        // return;
      }
      // this.ballChildren.forEach(child => {
      //   child.isSelected = selectedIds.includes(child.id);
      // })
      // this.$forceUpdate()
    },
    setItemStyle(index, len){
      return this.playing.setBallItemStyle(index, len)
    },
    setBgColor (code,list) {
      let style = new Object();
      list.forEach(item=>{
        item.list.forEach(c=>{
          if(code === c.number){
            style = this.playing.setBg(c.color)
          }
        })
      })
      return style;
    },
    onClickItem(num){
      this.current = num.id;
      console.log(this.current);
    },
    missOrMatchText(item) {
      let attrKey = this.missOrMatch;
      return item[attrKey] || item[attrKey] === 0 ? item[attrKey] : "";
    },
  }
}
</script>

<style lang="scss" scoped>
.ball-list{
  display: flex;
  flex-wrap: wrap;
   .ball-item{
    box-sizing: border-box;
    background: #DEEAFA;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
    .left{
      position: relative;
      width: 98.5rpx;
      height: 110rpx;
      .num{
        position: absolute;
        z-index: 2;
        left: 29rpx;
        top: 21rpx;
        line-height: 67rpx;
        text-align: center;
        width: 58rpx;
        height: 67rpx;
        color: #333333;
        font-size: 28rpx;
      }
    }
    .right{
      position: relative;
      width: 98.5rpx;
      height: 110rpx;
      .num{
        line-height: 110rpx;
        text-align: center;
        color: #8CB2C9;
        font-size: 28rpx;
      }
      .mark{
        position: absolute;
        right: 8rpx;
        top: 8rpx;
        font-size: 20rpx;
        color: #8CB2C9;
      }
    }
  }
  .ball-item.selected{
    background: #0099CC;
    box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
  }
}

</style>
