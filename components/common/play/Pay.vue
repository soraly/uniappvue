<template>
  <view class="popup-content" :style="{marginTop:safeHeight}">
    <nav-bar :isBack="false" :leftWidth="50" :rightWidth="50">
      <block slot="left">
        <uni-icons @click="playcolse" type="back" size="18" style="font-weight: bold;margin-left: 10px"/>
      </block>
      <view class="input-view" style="font-size: 16px" slot="title">{{ videoTitle + '回放' }}</view>
    </nav-bar>
    <view style="width: 100%;display: block">
      <cover-view>
        <video id="myVideo" style="width: 100%;margin: auto"
               :poster="poster"
               :src="videourl"
               autoplay="true"
               loop="true"
               controls></video>
      </cover-view>
    </view>
    <view class="border-box">
      <view class="border-box-body" v-if="lastLottery">
        <lottery :lotteryDetail="lastLottery" :listStyle="{}">
          <template v-slot:header><span></span></template>
          <template v-slot:lottery></template>
          <template v-slot:footer><span></span></template>
        </lottery>
      </view>
    </view>
    <view class="vant-swiper-body-mini">
      <ads :listPicture="listPicture"></ads>
    </view>
  </view>
</template>

<script>
import Lottery from '../../../components/common/lottery/Lottery'
import Ads from '../../../components/common/ad/Ad'
import NavBar from "../../../components/common/navBar/navBar.vue";
import {period} from "../../../utils/lottery/index"
import {advertList, listSpreadByType} from "../../../utils/common/index.js"
export default {
  name: "pay",
  components: {Lottery, Ads, NavBar},
  props: {
    id: {
      type: Number,
      default: 0
    },
    //彩票期数
    lotteryRecordId:{
      id:{
        type:Number,
        default:0
      }
    },
    videourl: {
      type: String,
      default: ''
    },
    videoTitle: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
    },

    lotteryType:{
      type:Number,
    },
    year:{
      type:Number
    },
    poster:{
      type:String,
      default:'',
    },
  },
  data() {
    return {
      safeHeight:uni.getStorageSync('systemInfo').safeArea.top + "px",
      current:0,
      lastLottery:{},
      listPicture:[]
    }
  },
  mounted() {
    this.periodInfo();
    this.getAdvertList()
  },
  methods: {
    playcolse: function () {
      console.log(111)
      this.$emit("playcolse");
    },
    periodInfo:function (){
      let prams = {number:this.lotteryRecordId,lotteryType:this.lotteryType,year:this.year};
      period(prams).then(res=>{
        this.lastLottery = res.result
      }).catch(err=>{
        console.log(err)
      })
    },
    //轮播图获取
    getAdvertList(){
      let prams = {
        projectType:1,
        code:3,
      }
      advertList(prams).then(res=>{
        this.listPicture = res.result
      }).catch(err=>{

      })
    },
  }
}
</script>

<style scoped>
.header{
  width: 100%;
  max-width: 480px;
}
.popup-content {
  width: 100%;
  max-width: 480px;
  margin: auto;
}

#myVideo {
  width: 100%;
}
</style>