<template>
  <view class="ball-lists">
    <view v-for="(item, index) in ballChildren" :class="item.isSelected === true ? 'ball-item selected' : 'ball-item'" :key="item.id" @click="onClickItem(item)" :style="setItemStyle(index,ballChildren.length)">
      <uni-row>
        <uni-col :span="12">
          <view class="left">
            <view class="num">{{item.name}}</view>
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
    ballChildren:{
      type : Array,
      default: null,
    },
    ball: {},
    dataIndex: {},
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  watch:{
    data(d){
      // //console.log("123:",d);
    },
    orderList(){
      this.setDefaultSelected()
    }
  },
  data () {
    return {
      current:null,
      playing:new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      currentArr:[],
    }
  },
  components: {UniCol, UniRow},
  mounted(){
    // //console.log("aaaa", this.ballChildren)
    this.setDefaultSelected()
  },
  methods:{
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

    setItemStyle(index,len){
      if(index > len-5){
        return {
          width: "50%",
        }
      }else {
        return {
          width: "33.3%",
        }
      }
    },
    setBgColor (code,list) {
      let style = new Object();
      if(!list)  list=[{"name":"红波","list":[{"number":"01","color":1},{"number":"02","color":1},{"number":"07","color":1},{"number":"08","color":1},{"number":"12","color":1},{"number":"13","color":1},{"number":"18","color":1},{"number":"19","color":1},{"number":"23","color":1},{"number":"24","color":1},{"number":"29","color":1},{"number":"30","color":1},{"number":"34","color":1},{"number":"35","color":1},{"number":"40","color":1},{"number":"45","color":1},{"number":"46","color":1}]},{"name":"蓝波","list":[{"number":"03","color":2},{"number":"04","color":2},{"number":"09","color":2},{"number":"10","color":2},{"number":"14","color":2},{"number":"15","color":2},{"number":"20","color":2},{"number":"25","color":2},{"number":"26","color":2},{"number":"31","color":2},{"number":"36","color":2},{"number":"37","color":2},{"number":"41","color":2},{"number":"42","color":2},{"number":"47","color":2},{"number":"48","color":2}]},{"name":"绿波","list":[{"number":"05","color":3},{"number":"06","color":3},{"number":"11","color":3},{"number":"16","color":3},{"number":"17","color":3},{"number":"21","color":3},{"number":"22","color":3},{"number":"27","color":3},{"number":"28","color":3},{"number":"32","color":3},{"number":"33","color":3},{"number":"38","color":3},{"number":"39","color":3},{"number":"43","color":3},{"number":"44","color":3},{"number":"49","color":3}]}];
      list.forEach(item=>{
        item.list.forEach(c=>{
          if(code === c.number){
            style = this.playing.setBg(c.color)
          }
        })
      })
      return style;
    },
    onClickItem(item){
      console.log(this.currentArr, item, "444")
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
.ball-lists{
  display: flex;
  flex-wrap:wrap;
  //grid-template-columns: 197rpx 197rpx 197rpx;
   .ball-item{
    box-sizing: border-box;
    box-sizing: border-box;
    background: #DEEAFA;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
    .left{
      position: relative;
      width: 100%;
      height: 110rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .num{
        //position: absolute;
        //z-index: 2;
        //left: 29rpx;
        //top: 21rpx;
        line-height: 70rpx;
           text-align: center;
           width: 64.51rpx;
           height: 70rpx;
           color: #FFFFFF;
           font-size: 28rpx;
           background-image: url("./../../../../static/img/liuhe/ssc/ball.png");
           background-size: 100% 100%;
           background-repeat: no-repeat;
           background-position: center;
      }
    }
    .right{
      position: relative;
      width: 100%;
      height: 110rpx;
      .num{
        line-height: 110rpx;
        text-align: left;
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
