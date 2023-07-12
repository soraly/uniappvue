<template>
  <view @click="homepage(item)">
    <uni-row class="list-row">
      <uni-col :span="4" class="img-box">
        <image :src="item.headPic"></image>
      </uni-col>
      <uni-col :span="20" class="text-box">
        <view class="text">{{ item.username }}</view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
export default {
  name: "Fans",
  props:{
    item:{
      type:Object,
      default:null,
    }
  },
  methods:{
    //用户主页
    homepage:function (item){
      uni.navigateTo({
        url : "/pages/user/homepage/homepage?userId="+item.userId
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.list-row{
  padding: 13px 16px;
  .img-box{
    width: 84rpx;
    height: 84rpx;
    image{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .text-box{
    margin-left: 20rpx;
    .text{
      height: 84rpx;
      line-height: 84rpx;
      font-size: 32rpx;
      color: #333;
    }
  }
  :after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
}
</style>