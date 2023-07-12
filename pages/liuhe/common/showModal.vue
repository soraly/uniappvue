<template>
  <view class="show-modal">
    <uni-popup ref="confirm" background-color="#fff">
      <view class="confirm-box">
        <view class="confirm-div">
          <view class="header">
            {{ title }}
          </view>
          <slot name="content">

          </slot>
          <view class="btn-box">
            <view class="cancel" @click="cancelBtn">取消</view>
            <view class="confirm-act" @click="submit">确认</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  name:"showModal",
  props:{
    title:{}
  },
  methods:{
    show(){
      this.$refs.confirm.open('center')
    },
    close(){
      this.$refs.confirm.close()
    },
    cancelBtn(){
      this.$refs.confirm.close()
      this.$emit('cancelBtn')
    },
    submit(){
      this.$emit('submit')
    }
  }
}
</script>
<style lang="scss" scoped>
.show-modal{
.confirm-div{
  min-width: 540rpx;
  padding: 20rpx 38rpx;
.header{
  width: 100%;
  text-align: center;
  height: 60rpx;
  border-bottom: 2rpx solid #E6E6E6;
  font-weight: 400;
  font-size: 32rpx;
  line-height: 40rpx;
  color: #9A9A9A;
}
.list-box{
  padding-top: 20rpx;
  height: 660rpx;
.title{
  display: flex;
  justify-content: space-between;
.name{
  font-weight: 400;
  font-size: 28rpx;
  line-height: 39rpx;
  color: #333333;
}
.period{
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: right;
  color: #9A9A9A;
}
}
.list-row{
  padding-top: 30rpx;
  height: 500rpx;
.list-item{
.played{
  font-weight: 400;
  font-size: 28rpx;
  line-height: 39rpx;
  color: #333333;
}
.number{
  font-weight: 400;
  font-size: 25rpx;
  line-height: 35rpx;
  color: #39788D;
}
.note-box{
  font-weight: 400;
  font-size: 28rpx;
  line-height: 39rpx;
  color: #333333;
  margin-bottom: 20rpx;
.note{
  margin-right: 24rpx;
}
}
}
}

}
.count-box{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64rpx;
  line-height: 64rpx;
  border-top: 2rpx solid #E6E6E6;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
  color: #000000;
.note-total,.moeney-total{
  color: #FF9900;
  margin: 0 2rpx 0 2rpx;
}
}
.btn-box{
  display: flex;
  justify-content: space-evenly;
.cancel,.confirm-act{
  border-radius: 264rpx;
  height: 60rpx;
  width: 200rpx;
  text-align: center;
  color: #FFFFFF;
  line-height: 60rpx;
}
.cancel{
  background: #8CB2C9;
}
.confirm-act{
  background: #FF9900;
}
.confirm-act.closing{
  background: #CCCCCC;
}
}

}

}
</style>
