<template>
  <scroll-view scroll-y="true" class="zheng-ma-one-six">
    <view class="tab">
      <view
          class="tab-item"
          v-for="data in playData.children"
          :key="data.id"
      >
        <view class="balls">
          <view v-for="(item, index) in data.children" :key="item.id">
            <view v-if="item.showType == 1">
              <view class="type-name">
                {{item.name}}
                <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
              </view>
              <ball :missOrMatch="missOrMatch" ref="ball" :data="item"/>
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
      </view>
    </view>



  </scroll-view>
</template>

<script>
import Ball from "./ball";
import TextBall from "./text-ball";
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
    TextBall
  },
  data(){
    return {
      currentType: 2,
      currentName:"特码A",
      zodiac:null,
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types:[],
      playing:new Playing(),
      ballList:[],
      ballSelects:[],//选择后球的id集合
      currentBallChildren:[],//合并1-6的每种球
      currentBall:[],//单选点击每种球详情的集合
    }
  },
  mounted() {
    // this.onSelectedType(this.playData.children[0])
  },
  methods:{
    setColorToNum(list,colorList){
      let newList = list.filter(item=>
        colorList.some(i => item.name == i.number)
      )
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
    //处理已选id集合
    setBallSelects(selectedIds){
      this.ballSelects = this.ballSelects.concat(selectedIds);
      this.ballSelects = this.ballSelects.filter((item, index, array) => {
        return array.indexOf(item) === index
      })
      console.log("ballSelects",this.ballSelects,this.currentBall);
      let orderList = [];
      this.ballSelects.forEach(id=>{
        this.currentBall.forEach(item=>{
          item.children.forEach(ball=>{
            if(id === ball.id){
              let obj = {
                "content": "",
                "methodName": item.name,
                "mode": 1,
                "chaseNum":3,
                "chaseStop":0,
                "playId": id,
                "rebatePoint": 0,
                "stakeCount": 1,
                "totalPrice": 0,
                "unitPrice": 0,
                "code":item.code,
              }
              orderList.push(obj)
            }
          })
        })
      })
      return orderList;
    },
    //处理ball集合
    setBallArr(ball){
      this.currentBall.push(ball);
      this.currentBall = this.playing.setArrObj(this.currentBall);
    },
    changeChildren(dataObj) {
      //由于正码1-6布局渲染特殊，对数据特殊处理
      this.playData.children.forEach(data=>{
        data.children.forEach(item=>{
          console.log(item.children);
          this.currentBallChildren = this.currentBallChildren.concat(item.children)
        })
      })
      this.currentBallChildren = this.playing.setArrObj(this.currentBallChildren);
      console.log(this.currentBallChildren)
      let {ballChildren, dataIndex, selectedIds, ball} = dataObj;
      this.setBallArr(ball);
      // console.log(this.setBallSelects(selectedIds));
      let orderList = this.setBallSelects(selectedIds);
      this.$store.dispatch('setOrderList', orderList).then(()=> {
        console.log(orderList, this.orderList)
      })
      dataObj.ballChildren = this.currentBallChildren;
      dataObj.selectedIds = this.ballSelects;
      this.$emit("selectedBall",dataObj)
    }
  },

}
</script>

<style lang="scss" scoped>

.zheng-ma-one-six{
  height: 100%;
  .tab{
    .tab-item{
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
  }



}
</style>
