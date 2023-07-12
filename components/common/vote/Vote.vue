<template>
  <view role="dialog" class="van-dialog" style="z-index: 2065;">
    <view class="van-dialog__header">{{ year }}年第{{ period }}期</view>
    <view class="van-dialog__content">
      <view class="dialog-set-vote">
        <view class="van-row">
          <view class="van-col van-col--6" style="padding-left: 2.5px; padding-right: 5px;" v-for="(item,index) in voteResult" :key="index">
            <view :class="animalId == item.animalId ? 'item act' : 'item'" @click="animalId=item.animalId">
              {{ item.animalName }}
              <view class="text">{{ item.voteCount }}票</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="van-hairline--top van-dialog__footer" @click="vote">
      <view class="vote-btn-box">投票</view>
    </view>
  </view>
</template>

<script>
import {vote} from '../../../utils/user/index.js'
export default {
  name: "Vote",
  props:{
    relatedId:{
      type:Number,
      default:0
    },
    year:{
      type:Number,
      default:0,
    },
    period:{
      type:Number,
      default: 0,
    },
    voteResult:{
      type:Array
    },
    type:{
      type:Number,
      default:1
    }
  },
  data(){
    return{
      animalId:0
    }
  },
  methods:{
    //投票
    vote:function (){
      if (!isLogin()) {
        this.$emit('closeVote');
        this.$emit('openPopup');
        return false
      }
      if(!this.animalId){
        pop("请选择要投票的选项")
        return false
      }
      let prams = {animalId:this.animalId,relatedId:this.relatedId,type:this.type}
      vote(prams).then(res=>{
        this.$emit('closeVote');
        if(res.code == 200){
        }
        pop(res.message,3000)
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.van-dialog {
  max-width: 960rpx;
}
.van-dialog {
  position: fixed;
  top: 45%;
  left: 50%;
  width: 640rpx;
  overflow: hidden;
  font-size: 32rpx;
  background-color: #fff;
  border-radius: 32rpx;
  -webkit-transform: translate3d(-50%,-50%,0);
  transform: translate3d(-50%,-50%,0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: .3s;
  transition: .3s;
  -webkit-transition-property: opacity,-webkit-transform;
  transition-property: opacity,-webkit-transform;
  transition-property: transform,opacity;
  transition-property: transform,opacity,-webkit-transform;
}
.van-dialog__header {
  padding-top: 52rpx;
  font-weight: 500;
  line-height: 48rpx;
  text-align: center;
}
.van-dialog__content{
  display: inline-block;
}
.dialog-set-vote {
  padding: 30rpx 30rpx 20rpx 30rpx;
}
.dialog-set-vote .item.act {
  background: #07c160;
  color: #fff;
}
.dialog-set-vote .item.act .text {
  color: #fff !important;
}
.dialog-set-vote .item {
  border: 2rpx solid #f1f1f1;
  text-align: center;
  border-radius: 8rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  padding: 16rpx 0;
}
.dialog-set-vote .item uni-view {
  font-size: 24rpx;
  color: #7e7e7e;
  padding-top: 6rpx;
}
.van-dialog__footer {
  height: 80rpx;
  width: 100%;
  line-height: 80rpx;
  text-align: center;
  color: rgb(7, 193, 96);
  border-top: 1px solid #ebedf0;
}
</style>