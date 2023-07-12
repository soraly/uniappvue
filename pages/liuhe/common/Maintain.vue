<template>
  <view>
    <uni-popup ref="maintain" type="center">
      <view class="maintain-box">
        <image src="/static/img/liuhe/index/wh.png"></image>
        <view class="name">
          {{ info.name }}
        </view>
        <view class="time-box">
          <view class="time-item" v-for="(item,index) in info.timeInfos" :key="index">
            <view v-for="(val,key) in item" :key="key">{{val}}</view>
          </view>
        </view>
        <view class="ok" @click="closeMaintain">知道了</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: "Maintain",
  data(){
    return{
      info: {name:'',timeInfos:[]}
    }
  },
  methods:{
    openMaintain(result){
      this.info = result
      console.log(this.info)
      this.$refs.maintain.open()
    },
    closeMaintain(){
      this.$refs.maintain.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.maintain-box{
  height: 590rpx;
  width: 620rpx;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  image{
    height: 127rpx;
    width: 127rpx;
  }
  .name{
    font-weight: 400;
    font-size: 36rpx;
    color: #3BABAA;
    margin-top: 30rpx;
  }
  .time-box{
    display: flex;
    margin-top: 30rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #444444;
    width: 100%;
    justify-content: space-evenly;
    .time-item{
      view{
      }
      :last-child{
        color: #3BABAA;
      }
    }
  }
  .ok{
    margin-top: 40rpx;
    width: 450rpx;
    height: 60rpx;
    background: #FFFFFF;
    border: 1px solid #3BABAA;
    border-radius: 10rpx;
    font-weight: 500;
    font-size: 28rpx;
    line-height: 60rpx;
    text-align: center;
    color: #3BABAA;
  }
}
</style>