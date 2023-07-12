<template>
  <scroll-view scroll-y="true" class="dragon-tiger-one-six">
    <view class="balls">
      <view v-for="(item, index) in ballList" :key="item.id">
        <view v-if="item.showType == 1">
          <view class="type-name">
            {{playData.name}}
            <image src="./../../../../static/img/liuhe/desc.png" @click="showRule"/>
            <rules-dialog ref="rules" :helpStr="playData.children[0].children[0].helpStr" :tipsStr="playData.children[0].children[0].tipsStr"></rules-dialog>
          </view>
          <ball ref="ball" :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index" @changeData="changeChildren"/>
        </view>
        <view v-if="item.showType == 2">
          <view class="type-name">
            {{currentName}}
            <image src="./../../../../static/img/liuhe/desc.png" @click="showRule"/>
            <rules-dialog ref="rules" :exampleStr="item.exampleStr" :helpStr="item.helpStr" :tipsStr="item.tipsStr"></rules-dialog>
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
  mounted() {
    this.onSelectedType(this.playData.children[0])
  },
  data(){
    return {
      currentType: 2,
      currentName:"特码A",
      zodiac:null,
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types:[

      ],
      ballList:[],
      playing:new Playing(),
    }
  },

  methods:{
    setColorToNum(list,colorList){
      let newList = list.filter(item=>
        colorList.some(i => item.name == i.number)
      )
    },
    onSelectedType(item){
      console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.ballList = item.children;
    },
    selectZodiacList(item){
      this.zodiac = item.name;
    },
    showRule(){
      this.$emit('open',this.ballList[0])
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

.dragon-tiger-one-six{
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
    }
  }
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

  }
}
</style>
