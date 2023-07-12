<template>
  <scroll-view scroll-y="true" class="zheng-te">
    <scroll-view scroll-x="true" class="tab">
      <center-tab :marginWidth="marginWidth">
         <view slot="content-tabs"
          :class="currentType == item.id ? 'tab-item active' : 'tab-item'"
          v-for="(item, index) in playData.children"
          @click="onSelectedType(item, index)"
          :key="item.id"
      >
        {{ item.name }}
      </view>
      </center-tab>
    </scroll-view>

      <view class="balls">
        <view v-for="(item, index) in ballList" :key="item.id">
          <view v-if="item.showType == 1">
            <view class="type-name">
              {{currentName}}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
              <rules-dialog ref="rules" :exampleStr="item.exampleStr" :helpStr="item.helpStr" :tipsStr="item.tipsStr"></rules-dialog>
            </view>
            <ball ref="ball" :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index" @changeData="changeChildren"/>
          </view>
          <view v-if="item.showType == 2">
            <view class="type-name">
              {{currentName}}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
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
import CenterTab from "../../common/CenterTab";

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
    TextBall,
    CenterTab
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  watch: {
    ballList: {
      deep: true,
      handler: function (oldV, newV) {
        // console.log(oldV, newV)
      }
    }
  },
  data(){
    return {
      currentType: 2,
      currentName:"",
      playing:new Playing(),
      zodiac:null,
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types:[

      ],
      zodiacList:[
        {
          label:"鼠",
          value:1,
        },
        {
          label:"牛",
          value:2,
        },
        {
          label:"虎",
          value:3,
        },
        {
          label:"兔",
          value:4,
        },
        {
          label:"龙",
          value:5,
        },
        {
          label:"蛇",
          value:6,
        },
      ],
      ballList:[],
      marginWidth: "0px"
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
    onSelectedType(item, index){
      // console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.ballList = item.children;
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
       //将当前点击的tab居中显示
      if(index <= 1 ){
        this.marginWidth = "0px";
      }else {
        this.marginWidth = `-${40.7 * (index - 1)}%`
      }
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
      let param = {
        "lotteryId": 69,
        "lotteryNo": "202302091209",
        "orderList": []
      }
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

.zheng-te{
  height: 100%;
  .tab{
    display: flex;
    white-space: nowrap;
    width: 100%;
    .tab-item{
      flex: 1;
      text-align: center;
      height: 56rpx;
      width: 238rpx;
      line-height: 56rpx;
      display: inline-block;
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
