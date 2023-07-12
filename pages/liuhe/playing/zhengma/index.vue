<template>
  <scroll-view scroll-y="true" class="zheng-ma">
    <view class="tab">
      <view
          :class="currentType == item.id ? 'tab-item active' : 'tab-item'"
          v-for="item in playData.children"
          @click="onSelectedType(item)"
          :key="item.id"
      >
        {{ item.name }}
      </view>
    </view>
      <view class="balls">
        <view v-for="(item, index) in ballList" :key="item.id">
          <view v-if="item.showType == 1">
            <view class="type-name">
              {{item.name}}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
            </view>
            <ball :missOrMatch="missOrMatch" ref="ball" :ballChildren="item.children" :ball="item" :dataIndex="index" @changeData="changeChildren"/>
          </view>
          <view v-if="item.showType == 2">
            <view class="type-name">
              {{item.name}}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
            </view>
            <text-ball :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index" @changeData="changeChildren"></text-ball>
          </view>
        </view>
      </view>
  </scroll-view>
</template>

<script>
import Ball from "./ball";
import TextBall from "./text-ball";
import RulesDialog from "../../common/rulesDialog";
import {mapGetters} from 'vuex';
import Playing from "../../../../utils/common/playing";
export default {
  name: "index",
  props:{
    playData:{
      default : {},
      type : Object
    },
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  components:{
    Ball,
    RulesDialog,
    TextBall
  },
  data(){
    return {
      currentType: 2,
      currentName:"",
      zodiac:null,
      playing:new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types:[],
      ballList:[]
    }
  },
  mounted() {
    // 默认点击特码A
    this.onSelectedType(this.playData.children[0])
  },
  methods:{
    setColorToNum(list,colorList){
      let newList = list.filter(item=>
        colorList.some(i => item.name == i.number)
      )
    },
    onSelectedType(item){
      // console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.ballList = item.children;
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
    },
    selectZodiacList(item){
      this.zodiac = item.name;
    },
    showRule(item){
      this.$emit('open',item)
    },
    onSeletedOne(num){
      this.$refs.ball[num].onClickItem(num)
    },
    changeChildren(dataObj) {
      let {ballChildren, dataIndex, selectedIds, ball} = dataObj;
      let orderList = this.playing.setOrders(ball,selectedIds);
      this.$store.dispatch('setOrderList', orderList).then(()=> {
        // console.log(orderList, this.orderList)
      })
      this.$emit("selectedBall",dataObj)
    }
  },

}
</script>

<style lang="scss" scoped>

.zheng-ma{
  height: 100%;
  .tab{
    display: flex;
    .tab-item{
      flex: 1;
      text-align: center;
      height: 56rpx;
      line-height: 56rpx;
      background: #CCDBEE;
      border-width: 0px 1rpx 2rpx 1rpx;
      border-style: solid;
      border-color: #B5D4E6;
      /*box-shadow: inset 0px 4rpx 4rpx #FFFFFF;*/
      color: #458198;
      font-size: 30rpx;
    }
    .tab-item.active{
      background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
      color: #BAE8FA;
      border-width: 0 0 2rpx 2rpx;
      border-style: solid;
      border-color: #B5D4E6;
      box-shadow: inset 0 3rpx 2rpx rgba(0, 0, 0, 0.5);
    }
  }
  .zodiac{
    display: flex;
    .zodiac-item{
      flex:1;
      height: 63rpx;
      line-height: 63rpx;
      background: #DEEAFA;
      border-width: 2px 1px 1px 1px;
      border-style: solid;
      border-color: #B5D4E6;
      text-align: center;
      font-size: 30rpx;
      color: #03536E;
      width: 100rpx;
    }
    .zodiac-item.active{
      background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
      color: #BAE8FA;
    }
  }

  .balls{
    .type-name{
      height: 70rpx;
      line-height: 70rpx;
      color: #8CB2C9;
      font-size: 34rpx;
      text-align: center;
      background: #CCDBEE;
      border: 1rpx solid #B5D4E6;
      box-shadow: inset 0px 2rpx 2rpx #CCCCCC;
      display: flex;
      align-items: center;
      justify-content: center;
      image{
        width: 34rpx;
        height: 34rpx;
        margin-left: 22rpx;
      }
    }
  }
}
</style>
