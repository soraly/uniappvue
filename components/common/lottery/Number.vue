 <template>
  <view class="lottery">
    <view class="lottery-row">
      <view class="icon-text" v-for="(item,index) in numberList" :key="index">
        <view :class="'slot-icon bg-amage-' + item.color">
          {{ item.number }}
        </view>
        <view class="slot-text">
          {{ item.shengXiao }}
        </view>
      </view>
      <view class="icon-text">
        <span>+</span>
      </view>
      <view class="icon-text">
        <view :class="'slot-icon bg-amage-' + sixNumber.color">
          {{ sixNumber.number }}
          <image src="/static/img/liuhe/detail/te.png"></image>
        </view>
        <view class="slot-text">
          {{ sixNumber.shengXiao }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Number",
  props:{
    lotteryDetail:{
      type:Object,
      default:function(){
        return {
          numberList:[]
        }
      }
    }
  },
  computed: {
    numberList() {
      if(this.lotteryDetail){
        return this.lotteryDetail.slice(0,6)
      }else{
        return []
      }
    },
    sixNumber(){
      if(this.lotteryDetail){
        return this.lotteryDetail[6]
      }else{
        return {color:1,number:0,shengXiao:'',wuXing:''}
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.lottery{
  .lottery-row{
    display: flex;
    .icon-text{
      margin-right: 10rpx;
      .slot-icon{
        width: 58.43rpx;
        height: 58.43rpx;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 33rpx;
        color: #EBFDFF;
        border-radius: 50%;
        position: relative;
        image{
          position: absolute;
          top: -5px;
          background: #F0B12E;
          width: 26rpx;
          height: 26rpx;
          right: -5px;
          border-radius: 50%;
        }
      }
      .bg-amage-1{
        background: #0A87CB;
      }
      .bg-amage-2{
        background: #0AC868;
      }
      .bg-amage-3{
        background: #D3556A;
      }
      .slot-text{
        font-weight: 400;
        font-size: 25rpx;
        line-height: 35rpx;
        color: #333333;
        text-align: center;
        margin-top: 14rpx;
      }
      span{
        font-size: 50rpx;
        font-weight: 700;
        color: #D9D9D9;
        line-height: 60rpx;
      }
    }
  }
}
</style>