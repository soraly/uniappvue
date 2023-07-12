<template>
  <scroll-view scroll-y="true" class="lian-wei">
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
        <image src="./../../../../static/img/liuhe/desc.png" @click="showRule"/>
      </view>
      <view class="balls">
        <view v-for="(item, index) in ballList"
              :key="item.id"
              @click="onClickItem(item)"
        >
          <view
              :class="item.isSelected === true ?
            'item selected' :'item'"
          >
            <uni-row>
              <uni-col :span="4">
                <view class="left">
                  {{item.name}}
                </view>
              </uni-col>
              <uni-col :span="4">
                <view class="odds">
                  {{item.odds}}
                </view>
              </uni-col>
              <uni-col :span="16">
                <view class="num-ball-list">
                  <view class="num-ball-list-item" v-for="(item, index) in setWeishu(item.name)" :style="setBg(item.color)">
                    {{item.number}}
                  </view>
                </view>
              </uni-col>
            </uni-row>
            <view class="right-mark">
              {{missOrMatchText(item)}}
            </view>
          </view>
        </view>
      </view>
  </scroll-view>
</template>

<script>
// import Ball from "./ball";
import Playing from "../../../../utils/common/playing";
import {mapGetters} from "vuex";
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
    // Ball,
    CenterTab
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  data(){
    return {
      playing: new Playing(),
      currentType: 2,
      currentName:"",
      zodiac:null,
      ballList:[],
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      weiShuList: uni.getStorageSync('lotteryStatus').weiShuList,
      helpStr:"",
      tipsStr:"",
      exampleStr:"",
      currentArr:[],
      levelTwo:{},
      marginWidth: "0px"
    }
  },
  watch:{
    orderList(){
      this.setDefaultSelected()
    }
  },
  mounted() {
    this.onSelectedType(this.playData.children[0])
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
      //console.log("orderList:",this.orderList,this.playData);
      let selectedIds = this.orderList.length ? this.orderList.map(i => i.playId) : []
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.ballList.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
      }
      // this.ballList.forEach(child => {
      //   child.isSelected = selectedIds.includes(child.id);
      // })
      // this.$forceUpdate()
    },
    onSelectedType(item, index){
      //console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.helpStr = item.children[0].helpStr;
      this.tipsStr = item.children[0].tipsStr;
      this.exampleStr = item.children[0].exampleStr;
      this.ballList = item.children[0].children;
      this.levelTwo = item.children[0];
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
      //将当前点击的tab居中显示
      if(index <= 1 ){
        this.marginWidth = "0px";
      }else {
        this.marginWidth = `-${40.7 * (index - 1)}%`
      }
    },
    setColorToNum(list,colorList){
      let newArr = [];
      colorList.forEach(f=>{
        list.forEach(l=>{
          f.list.forEach(c=>{
            if(l == c.number){
              let obj = {
                color : c.color,
                number : l,
              }
              newArr.push(obj)
            }
          })
        })
      })
      return newArr;
    },
    setWeishu(name){
      let weiShuList = this.weiShuList;
      for (let i=0;i < weiShuList.length;i++){
        if(name === weiShuList[i].name){
          return this.setColorToNum(weiShuList[i].list,this.colorList);
        }
      }
    },
    setBg(color){
      return this.playing.setBg(color)
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
    onClickItem(item, key){
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      let ball = this.levelTwo;
      if(this.currentArr.length > ball.maxNum){
        uni.showToast({
          title:ball.maxNumTips,
          icon:'none'
        })
        return
      }
      this.ballList.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      //console.log(this.ballList);
      this.$forceUpdate()
      this.changeChildren({ballChildren : this.ballList, dataIndex : this.dataIndex, selectedIds:this.currentArr, ball: ball,ballItem:item})
    },
    changeChildren(dataObj) {
      let {ballChildren, dataIndex, selectedIds, ball} = dataObj;
      let orderList = this.playing.setOrders(ball,selectedIds);
      this.$store.dispatch('setOrderList', orderList).then(()=> {
        // //console.log(orderList, this.orderList)
      })
      this.$emit("selectedBall",dataObj)
    },
    missOrMatchText(item) {
      let attrKey = this.missOrMatch;
      return item[attrKey] || item[attrKey] === 0 ? item[attrKey] : "";
    },
  },

}
</script>

<style lang="scss" scoped>

.lian-wei{
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
    .item{
      height: 110rpx;
      background: #DEEAFA;
      border: 1rpx solid #B5D4E6;
      box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
      font-size: 28rpx;
      color: #8CB2C9;
      box-sizing: border-box;
      position: relative;
      .left{
        font-size: 38rpx;
        color: #03536E;
        text-align: center;
        line-height: 110rpx;
      }
      .odds{
        text-align: center;
        line-height: 110rpx;
      }
      .num-ball-list{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-top: 22rpx;
        padding-right: 40rpx;
        .num-ball-list-item{
          width: 58rpx;
          height: 67rpx;
          font-size: 28rpx;
          color: #333333;
          margin-right: 5rpx;
         display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .item.selected{
      background: #0099CC;
      box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
      color: #DEEAFA;
      .left{
        color: #DEEAFA;
      }
    }

    .right-mark {
      position: absolute;
      right: 8rpx;
      top: 8rpx;
      font-size: 20rpx;
    }
  }
}
</style>
