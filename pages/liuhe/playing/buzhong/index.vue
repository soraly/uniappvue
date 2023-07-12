<template>
  <scroll-view scroll-y="true" class="bu-zhong">
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
      <view class="type-name">
        {{currentName}}
        <image src="./../../../../static/img/liuhe/desc.png" @click="showRule()"/>
      </view>
      <view class="balls" v-if="ballList">
        <ball ref="ball" :missOrMatch="missOrMatch" :ball="ball" :ballChildren="ballList" @changeData="changeChildren"/>
      </view>
  </scroll-view>
</template>

<script>
import Ball from "./ball";
import {mapGetters} from 'vuex'
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
    CenterTab
  },
  data(){
    return {
      playing:new Playing(),
      currentType: 2,
      currentName:"",
      zodiac:null,
      ball:{},
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types:[],
      helpStr:"",
      tipsStr:"",
      exampleStr:"",
      ballList:[],
      marginWidth: "0px"
    }
  },
  mounted() {
    this.onSelectedType(this.playData.children[0])
  },
  methods:{
    setColorToNum(list,colorList){
      colorList.forEach(f=>{
        list.forEach(l=>{
          f.list.forEach(c=>{
            if(l.code == c.number){
              l.color = c.color
            }
          })
        })
      })
      return list;
    },
    onSelectedType(item, index){
      // console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.helpStr = item.children[0].helpStr;
      this.tipsStr = item.children[0].tipsStr;
      this.exampleStr = item.children[0].exampleStr;
      this.ballList = this.setColorToNum(item.children[0].children,this.colorList);
      this.ball = item.children[0];
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
    showRule(){
      this.$emit('open',{
        exampleStr : this.exampleStr,
        helpStr : this.helpStr,
        tipsStr : this.tipsStr,
      })
    },
    onSeletedOne(num){
      this.$refs.ball[num].onClickItem(num)
    },
    changeChildren(dataObj) {
      let {ballChildren, dataIndex, selectedIds, ball} = dataObj;
      let orderList = this.playing.setOrders(this.ball, selectedIds);

      this.$store.dispatch('setOrderList', orderList).then(()=> {
        // console.log(orderList, this.orderList)
      })
      this.$emit("selectedBall",dataObj)
    }
  },

}
</script>

<style lang="scss" scoped>

.bu-zhong{
  height: 100%;
  .tab{
    display: flex;
    white-space: nowrap;
    width: 100%;
    .tab-item{
      width: 238rpx;
      text-align: center;
      height: 56rpx;
      display: inline-block;
      line-height: 56rpx;
      background: #CCDBEE;
      border-width: 0px 1rpx 2rpx 1rpx;
      border-style: solid;
      border-color: #B5D4E6;
      box-shadow: inset 0px 4rpx 4rpx #FFFFFF;
      color: #458198;
      display: inline-block; // 设置为行内块
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
  .balls{

  }
}
</style>
