<template>
  <view>
    <view class="prv-down" v-show="isShow">
      <view class="down bg"></view>
      <view class="down">
        <navigator class="down-btn" url="/pages/user/downloadPage" hover-class="navigator-hover">
          下载APP
        </navigator>
        <text>看图更爽</text>
        <text class="downClose" @click="downClose">更爽...X</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "down",
  data(){
    return{
      isShow:true
    }
  },
  methods:{
    downClose(){
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.prv-down{
  width: 100%;
  .down{
    width: 100%;
    max-width: 480px;
    position: fixed;
    text-align: center;
    bottom: 50px;
    color: white;
    line-height: 50px;
    height: 50px;
    z-index: 12;
    font-size: 28rpx;
    .down-btn{
      display: inline;
      color: red;
      text-decoration: none;
      background: white;
      padding: 5px 10px;
      border-radius: 5px 0 0 5px;
    }
    text{
      text-decoration: none;
      background-color: forestgreen;
      padding: 5px 10px;
    }
    .downClose{
      background-color: crimson;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
    }
  }
  .bg{
    background-color: black;
    opacity: 0.5;
  }
}
</style>