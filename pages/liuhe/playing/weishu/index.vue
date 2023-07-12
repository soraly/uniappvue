<template>
  <scroll-view scroll-y="true" class="wei-shu">
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
      <view class="type-name">
        {{currentName}}
        <image src="./../../../../static/img/liuhe/desc.png" @click="showRule()"/>
      </view>
      <view class="balls">
        <view v-for="(item, index) in ballList" :key="item.id"
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
import Playing from "../../../../utils/common/playing";
import {mapGetters} from "vuex";

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

  },
  data(){
    return {
      currentType: 2,
      currentName:"",
      zodiac:null,
      playing:new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      weiShuList: uni.getStorageSync('lotteryStatus').weiShuList,
      ballList:[],
      helpStr:"",
      tipsStr:"",
      exampleStr:"",
      currentArr:[],
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
        return;
      }
      this.ballList.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
      })
      this.$forceUpdate()
    },
    //由于接收到后台数据后需要和颜色的list匹配颜色导致顺序乱了，所以需要对新数组排序
    compare(prop) {
      return (obj1, obj2)=>{
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
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
      newArr.sort(this.compare('number'));
      //console.log(newArr);
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
    onSelectedType(item){
      //console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.helpStr = item.children[0].helpStr;
      this.tipsStr = item.children[0].tipsStr;
      this.exampleStr = item.children[0].exampleStr;
      this.ballList = item.children[0].children;
      this.ball = item.children[0];
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
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
    onClickItem(item){
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      // let ball = this.playData.children[key].children[0];
      // if(this.currentArr.length > ball.maxNum){
      //   uni.showToast({
      //     title:ball.maxNumTips,
      //     icon:'none'
      //   })
      //   return
      // }
      this.ballList.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      //console.log(this.ballList);
      this.$forceUpdate()
      this.changeChildren({ballChildren : this.ballList, dataIndex : this.dataIndex, selectedIds:this.currentArr, ball: this.ball,ballItem:item})
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
    }
  },

}
</script>

<style lang="scss" scoped>

.wei-shu{
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
          text-align: center;
          line-height: 67rpx;
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
    .right-mark{
      position: absolute;
      right: 8rpx;
      top: 3rpx;
      font-size: 20rpx;
    }
  }
}
</style>
