<template>
  <view class="lottery-box" :style="[listStyle]" v-if="lotteryDetail">
    <slot  name="header">
      <header class="lottery-header">
          <view class="period-item">
            第<span>{{ lotteryDetail.id?(" " + (lotteryDetail.id + '').substr(0,(lotteryDetail.id + '').length-1) + " "):"" }}</span>期开奖结果
          </view>
          <view class="history-item" @click="lishi">
            查看历史记录
          </view>
      </header>
    </slot>
    <slot  name="lottery">
      <main class="lottery-center">
        <view class="van-col" v-for="(item,index) in numberList" :key="index">
          <view class="icon-text">
            <view :class="'slot-icon bg-amage-' + item.color">
              <span>{{ item.number }}</span>
            </view>
            <view class="slot-text">
              {{ item.shengXiao }}<span>/{{ item.wuXing }}</span>
            </view>
          </view>
        </view>
        <view class="van-col">
          <view class="icon-text">
            <uni-icons type="plusempty" size="30" color="rgb(172, 172, 172)"></uni-icons>
          </view>
        </view>
        <view class="van-col">
          <view class="icon-text">
            <view :class="'slot-icon bg-amage-' + sixNumber.color">
              <span>{{ sixNumber.number }}</span>
            </view>
            <view class="slot-text">
              {{ sixNumber.shengXiao }}<span>/{{ sixNumber.wuXing }}</span>
            </view>
          </view>
        </view>
      </main>
    </slot>
    <slot  name="footer">
      <footer class="lottery-footer">
          {{ lotteryDetail.title }}
      </footer>
    </slot>
  </view>
</template>

<script>
export default {
  name: "Lottery",
  props:{
    lotteryDetail:{
      type:Object,
      default:function(){
        return {
          numberList:[]
        }
      }
    },
    listStyle:{
      type:Object,
      default:function (){
        return {'border': '2rpx solid #07c160', 'background-size': '100% 100%', 'padding': '30rpx 20rpx', 'border-radius': '20rpx', 'background': '#fff'}
      }
    }
  },
  computed: {
    numberList() {
      if(this.lotteryDetail.numberList){
        return this.lotteryDetail.numberList.slice(0,6)
      }else{
        return []
      }
    },
    sixNumber(){
      if(this.lotteryDetail.numberList){
        return this.lotteryDetail.numberList[6]
      }else{
        return {color:1,number:0,shengXiao:'',wuXing:''}
      }
    }
  },
  methods:{
    lishi:function (){
      uni.navigateTo({
        url: '/pages/lottery/lottery?lotteryType=' + this.lotteryDetail.lotteryType
        // page.json定义的路径 传url 到webview界面去接收 实现跳转
      })
    },
  }
}
</script>

<style scoped>
.lottery-box .lottery-header{
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  padding-bottom: 20rpx;
}
.period-item span{
  color: #07c160;
}
.history-item{
  color: #07c160;
}
.lottery-box .lottery-center{
  display: flex;
  justify-content: space-between;
}
.lottery-box .lottery-center .slot-icon {
  width: 68rpx;
  height: 68rpx;
  line-height: 72rpx;
  font-size: 28rpx;
}
.lottery-box .lottery-center .slot-icon span{
  margin-left: 14rpx;
}
.lottery-box .lottery-center .slot-icon.bg-amage-1 {
  background-image: url("@/static/img/qiu/1.png");
  background-size: 100% 100%;
}
.lottery-box .lottery-center .slot-icon.bg-amage-2 {
  background-image: url("@/static/img/qiu/2.png");
  background-size: 100% 100%;
}
.lottery-box .lottery-center .slot-icon.bg-amage-3 {
  background-image: url("@/static/img/qiu/3.png");
  background-size: 100% 100%;
}
.lottery-box .lottery-center .slot-text{
  font-size: 24rpx;
  padding-top: 6rpx;
  color: #666;
  text-align: center;
}
.lottery-footer{
  text-align: center;
  padding-top: 20rpx;
  font-size: 24rpx;
  color: #eb5252;
}
</style>