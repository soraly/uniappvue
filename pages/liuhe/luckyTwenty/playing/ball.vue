<template>
  <view class="ball-list">
    <view :style="setItemStyle(index, ballChildren.length)" v-for="(item, index) in ballChildren" :class="item.isSelected === true  ? 'ball-item selected' : 'ball-item'" :key="item.id" @click="onClickItem(item)">
          <view class="box">
            <view class="left">
              <view class="num" :style="setBallBg(item.code)">
                <text>{{item.name}}</text>
              </view>
            </view>
            <view class="right">
              <view class="num" v-if="ball">
                {{ item.odds }}
              </view>
            </view>
          </view>
      <view class="mark">{{missOrMatchText(item)}}</view>
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
    setBallBg(code){
      let style;
      if(code.length == 1){
        code = "0" + code
      }
      let colorObj = this.playing.setBallColorConfig();
      for(let i in colorObj){
        let arr = colorObj[i].split(',');
        arr.forEach(item=>{
          if(code == item){
            style = this.playing.setBg(i)
          }
        })
      }
      return style;
    },
    setDefaultSelected() {
      let selectedIdsOrder = [];
      this.orderList.length ? this.orderList.forEach(order=>{
        if(Number(order.playId)>0) selectedIdsOrder.push(Number(order.playId));
      }) : null;
      let selectedIdsContent = this.orderList.length &&this.orderList[0].content ? this.orderList[0].content.split(',').map(i =>{return  Number(i)}) : [];

      let selectedIds = selectedIdsOrder.length>=selectedIdsContent.length?selectedIdsOrder:selectedIdsContent;
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        // return;
      }
      this.ballChildren.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
      })
      this.$forceUpdate()
    },
    setItemStyle(index, len){
      let defaultWidth="30%";
      if (index > len - 3) {
            return {
                width: "50%",
            }
        } else {
            return {
                width: "33.3%",
            }
        }
      return {width:defaultWidth};
    },
    onClickItem(item){
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      // if(this.currentArr.length > this.ball.maxNum){
      //   uni.showToast({
      //     title:this.ball.maxNumTips,
      //     icon:'none'
      //   })
      //   return
      // }
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
      position: relative;
      box-sizing: border-box;
      background: #DEEAFA;
      border: 1rpx solid #B5D4E6;
      box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
     .box{
       width: 153rpx;
       display: flex;
       .left{
         position: relative;
         width: 98.5rpx;
         height: 110rpx;
         display: flex;
         justify-content: center;
         align-items: center;
         margin-right: 30rpx;
         .num{
           //position: absolute;
           //z-index: 2;
           //left: 29rpx;
           //top: 21rpx;
           line-height: 70rpx;
           text-align: center;
           width: 64.51rpx;
           height: 70rpx;
           font-size: 28rpx;
          //  background-image: url("./../../../../static/img/liuhe/ssc/ball.png");
           background-size: 100% 100%;
           background-repeat: no-repeat;
           background-position: center;
           text{
            color: #333;
           }
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

       }
     }
     .mark{
       position: absolute;
       right: 8rpx;
       top: 8rpx;
       font-size: 20rpx;
       color: #8CB2C9;
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
