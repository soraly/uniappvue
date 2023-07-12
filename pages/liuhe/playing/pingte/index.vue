<template>
  <scroll-view scroll-y="true" class="ping-te">
    <view class="type-name">
      {{playData.name}}
      <image src="./../../../../static/img/liuhe/desc.png" @click="showRule"/>
    </view>
    <view class="balls">
      <view v-for="(item, index) in playData.children[0].children[0].children" :key="item.id" @click="onClickItem(item)">
        <view :class="item.isSelected === true ? 'item selected' : 'item'">
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
                <view class="num-ball-list-item" v-for="(item, index) in setZodiac(item.name)" :style="setBg(item.color)">
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
import UniRow from "../../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../../uni_modules/uni-row/components/uni-col/uni-col";
import {mapGetters} from 'vuex';
import Playing from "../../../../utils/common/playing";
export default {
  name: "index",
  props:{
    playData:{
      default : {},
      type : Object
    },
    ball: {},
    dataIndex: {},
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  components:{
    UniCol,
    UniRow,
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  data(){
    return {
      playing:new Playing(),
      currentType: 2,
      currentName:"",
      zodiac:null,
      types:[],
      ballList:[],
      currentArr:[],
      zodiacList:uni.getStorageSync('lotteryStatus').shengxiaoList,
    }
  },
  watch:{
    orderList(){
      this.setDefaultSelected()
    }
  },
  mounted() {
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
      //console.log("orderList:",this.orderList,this.playData);
      let selectedIds = this.orderList.length ? this.orderList.map(i => i.playId) : []
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.playData.children[0].children[0].children.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        // return;
      }
      // this.playData.children[0].children[0].children.forEach(child => {
      //   child.isSelected = selectedIds.includes(child.id);
      // })
      // this.$forceUpdate()
    },
    onSelectedType(item){
      //console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.ballList = item.children;
    },
    showRule(){
      this.$emit('open', this.playData.children[0].children[0])
    },
    onSeletedOne(num){
      this.$refs.ball[num].onClickItem(num)
    },
    setZodiac(name){
      let zodiac = this.zodiacList;
      for (let i=0;i < zodiac.length;i++){
        if(name === zodiac[i].name){
          return zodiac[i].list;
        }
      }
    },
    setBg(color){
      return this.playing.setBg(color)
    },
    onClickItem(item){
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      this.playData.children[0].children[0].children.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      //console.log(this.playData.children[0].children[0].children);
      this.$forceUpdate()
      this.changeChildren({ballChildren : this.playData.children[0].children[0].children, dataIndex : this.dataIndex, selectedIds:this.currentArr, ball: this.playData.children[0].children[0],ballItem:item})
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

.ping-te{
  height: 100%;
  .type-name{
    height: 70rpx;
    line-height: 70rpx;
    color: #8CB2C9;
    font-size: 34rpx;
    text-align: center;
    background: #CCDBEE;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0rpx 2rpx 2rpx #CCCCCC;
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
            text-align: center;
            line-height: 67rpx;
        }
      }
    }
    .item.selected{
      background: #0099CC;
      box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
      color: #DEEAFA;
    }
    .right-mark{
      position: absolute;
      right: 8rpx;
      top: 3rpx;
      font-size: 20rpx;
    }
  }
}
</style>
