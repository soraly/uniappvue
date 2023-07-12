<template>
  <scroll-view scroll-y="true" class="te-ma">
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
      <scroll-view scroll-x class="zodiac" v-if="currentType === 2">
        <view
            v-for="(item, index) in zodiacList"
            :class="item.selected ? 'zodiac-item active' : 'zodiac-item'"
            :key="index"
            @click="selectZodiacList(item)"

        >{{item.name}}</view>
      </scroll-view>
      <view class="balls" v-if="ballList">
        <view v-for="(item, index) in ballList" :key="item.id">
          <view v-if="item.showType == 1">
            <view class="type-name">
              {{currentName}}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)"/>
            </view>
            <ball ref="ball"  :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index" @changeData="changeChildren"/>
          </view>
          <view v-if="item.showType == 2">
            <view class="type-name">
              {{currentName}}
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
  computed: {
    ...mapGetters(['orderList'])
  },
  watch: {
    playData:{
      deep:true,
      handler(n,o){
        // 游戏数据刷新后 刷新界面 否则出现空白
       for (let index in n.children){
         let item=n.children[index];
         if(this.currentType==item.id){
           this.onSelectedType(item)
           break;
         }
       }
      }
    },

    ballList: {
      deep: true,
      handler: function (oldV, newV) {

      }
    }
  },
  data(){
    return {
      currentType: 2,
      currentName:"特码A",
      zodiac:null,
      playing:new Playing(),
      types:[
        {
          label:"特码A",
          value:1
        },
        {
          label:"特码B",
          value:2
        }
      ],
      zodiacList:[],
      ballList:[],
      currentZodiac:[]
    }
  },

  mounted() {
    // 默认点击特码A
    this.onSelectedType(this.playData.children[0])
    let zodiacList = this.playing.getStorage('lotteryStatus').shengxiaoList
    zodiacList.forEach(i => i.selected = false)
    this.zodiacList = zodiacList
  },

  methods:{
    setCurrentHeight(){
      return this.playing.setCurrentHeight()
    },
    onSelectedType(item){
      // console.log("onSelectedType");
      //console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.ballList = item.children;
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
    },
    //获取已选球（数组）并去重
    setSelectedArr(arr,item){
      arr.some(i=>i === item.name)
          ?
          arr.forEach((i, index)=>{
            i === item.name
                ?
                arr.splice (index,1)
                :
                null
          })
          :
          arr.push(item.name)
      return arr
    },
    selectZodiacList(item){
      this.currentZodiac = this.setSelectedArr(this.currentZodiac,item);
      this.zodiacList.forEach(i=>{
        i.selected = this.currentZodiac.includes(i.name)
      })
      //console.log(this.zodiacList);
      let arr = item.list;
      let ballChildren = this.playData.children[0].children[0].children;
      ballChildren.forEach(data=>{
        arr.forEach(i=>{
          if(data.name === i.number){
            this.$refs.ball[0].onClickItem(data);
          }
        })
      })
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
      })
      this.$emit("selectedBall",dataObj)
    },

  },

}
</script>

<style lang="scss" scoped>

.te-ma{
  width: 100%;
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
      border-color: #CCDBEE;
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
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
    .zodiac-item{
      box-sizing: border-box;
      flex:1;
      height: 63rpx;
      line-height: 63rpx;
      background: #DEEAFA;
      border-style: solid;
      border-color: #B5D4E6;
      text-align: center;
      font-size: 30rpx;
      color: #03536E;
      width: 100rpx;
      display: inline-block;
      border-width: 0px 2rpx 2rpx 0px;
    }
    .zodiac-item.active{
      background: linear-gradient(180deg, #DAEAFD 0%, #D3E5FA 44.6%, #A7C8E5 100%);
      color: #03536E;
      border-width: 0 2rpx 2rpx 0;
      border-style: solid;
      border-color: #B5D4E6;
      box-shadow: inset 0 4rpx 3rpx #FFFFFF;
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
