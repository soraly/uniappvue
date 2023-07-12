<template>
  <view class="numbers">
    <view class="ball" v-for="(item,index) in numberList" :key="index">
      <view :class="`ball-img ${getImgCss(item.color)}`">
<!--        <image :src="getImg(item.color)"></image>-->
      </view>
      <view class="ball-num">
        {{ item.number }}
      </view>
    </view>
    <view class="ball" :style="addBallStyle">
      <view class="ball-img">
        <image class="add" src="../../../static/img/liuhe/add.png" :style="addStyle"></image>
      </view>
    </view>
    <view class="ball">
      <view class="ball-img">
        <image :src="getImg(sixNumber.color)"></image>
      </view>
      <view class="ball-num">
        {{ sixNumber.number }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "numbers",
  props:{
    numbers:{
      type : Array,
      default:()=>{
        return []
      }
    },
    addStyle:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    addBallStyle:{
      type:Object,
      default:()=>{
        return {};
      }
    }
  },
  data(){
    return {
      ball1:require('./../../../static/img/liuhe/ball/1.png'),
      ball2:require('./../../../static/img/liuhe/ball/2.png'),
      ball3:require('./../../../static/img/liuhe/ball/3.png'),
    }
  },
  computed: {
    numberList() {
      if(this.numbers.length > 0){
        return this.numbers.slice(0,6)
      }else{
        return []
      }
    },
    sixNumber(){
      if(this.numbers.length > 0){
        return this.numbers[6]
      }else{
        return {color:1,number:0,shengXiao:'',wuXing:''}
      }
    }
  },
  methods:{
    getImg(color){
      if(color == 1){
        return this.ball1
      }else if(color == 2){
        return this.ball2
      }else if(color == 3){
        return this.ball3
      }else{
        return this.ball4
      }
    },
    getImgCss(color){
      return "ball-"+color;
    }
  }
}
</script>

<style lang="scss" scoped>
.numbers{
  padding: 0 21rpx 0 21rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .ball:last-child{
    margin: 0;
  }
  .ball{
    position: relative;
    width: 58rpx;
    height: 67rpx;
    margin-right: 8rpx;
    overflow: hidden;
    .ball-img{
      position: absolute;
      width: 58rpx;
      height: 67rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .add{
        width: 25rpx;
        height: 25rpx;
      }
      image{
        width: 58rpx;
        height: 67rpx;
      }
    }
    .ball-num{
      font-size: 28rpx;
      position: absolute;
      width: 58rpx;
      height: 67rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .ball-1{
    background-image: url(/static/img/liuhe/ball/1.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .ball-2{
    background-image: url(/static/img/liuhe/ball/2.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .ball-3{
    background-image: url(/static/img/liuhe/ball/3.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
}

</style>
