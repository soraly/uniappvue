<template>
  <view class="ball-list">
    <view :style="setItemStyle(index, ballChildren.length)" v-for="(item, index) in ballChildren" :class="item.isSelected === true ? 'ball-item selected' : 'ball-item'" :key="item.id" @click="onClickItem(item)">
      <uni-row>
        <uni-col :span="12">
          <view class="left">
            <view class="num" :style="setBgColor(item.color)">{{item.name}}</view>
          </view>
        </uni-col>
        <uni-col :span="12">
          <view class="right">
            <view class="mark">{{missOrMatchText(item)}}</view>
            <view class="num">
              {{item.odds}}
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
    ballChildren:{
      type : Array,
      default: [],
    },
    ball:{},
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  data () {
    return {
      currentArr:[],
      playing:new Playing(),
      colorList:uni.getStorageSync('lotteryStatus').colorList,
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  watch:{
    orderList(){
      this.setDefaultSelected()
    }
  },
  components: {UniCol, UniRow},
  mounted() {
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
     // let {lianma} = this.orderList
     // //console.log(lianma)
     // if(!this.orderList.length) return;
      let selectedIds = this.orderList.length ? this.orderList[0].content.split(',').map(i => Number(i)) : []
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        return;
      }
      this.ballChildren.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
      })
     // this.$nextTick(() =>{
        this.$forceUpdate()
      //})
    },
    setItemStyle(index,len){
      return this.playing.setBallItemStyle(index, len)

    },
    setBgColor (color) {
      return this.playing.setBg(color);
    },
    onClickItem(item){
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      if(this.currentArr.length > this.ball.maxNum){
        uni.showToast({
          title:this.ball.maxNumTips,
          icon:'none'
        })
        return
      }
      this.ballChildren.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      this.$forceUpdate()
      //console.log("+++++++++",item,this.ball,this.currentArr);
      this.$emit('changeData', {ballChildren : this.ballChildren, dataIndex : this.dataIndex, selectedIds:this.currentArr, ball: this.ball,ballItem:item})
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
    .right{
      .num{
        color: #DEEAFA;
      }
      .mark{
        color: #DEEAFA;
      }
    }
  }
}

</style>
