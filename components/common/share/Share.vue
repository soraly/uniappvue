<template>
  <view class="share-body">
    <view class="van-row">
      <view class="van-col van-col--8" @click="shares(1)">
        <view class="icon-text"><view>
          <image src="/static/img/wx.png"></image>
        </view>
          <view class="text">微信</view><!---->
        </view>
      </view>
      <view class="van-col van-col--8"  @click="shares(2)">
        <view class="icon-text"><view>
          <image src="/static/img/pyq.png"></image>
        </view>
          <view class="text">朋友圈</view><!---->
        </view>
      </view>
      <view class="van-col van-col--8">
        <a :href="'sms:?body='+text">
          <view class="icon-text">
            <view>
              <image src="/static/img/sms.png"></image>
            </view>
            <view class="text">短信</view>
            <!---->
          </view>
        </a>
      </view>
    </view>
    <view class="ft-btn van-hairline--top" @click="closefx">取消</view>
  </view>
</template>

<script>
import {share} from "../../../utils/user";

export default {
  name: "Share",
  data(){
    return{
      text:'',
    }
  },
  mounted(){
//动态设置swiper的高度
    this.share();
    // APP：
    // #ifdef APP-PLUS
      plusReady();
    // #endif

    // H5:
    // #ifdef H5
        showClose:true
    // #endif
  },
  methods:{
    //获取分享数据
    share:function (){
      share().then(res=>{
        this.text = res.result.shareStr
      }).catch(err=>{
        console.log(err)
      })
    },

    //分享
    shares:function (type){
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf('micromessenger') !== -1;
      console.log(isWeixin)
      if (!isWeixin && type<3) {
        uni.showToast({
          title:"在微信打开才能分享哦",
          duration:3000,
          icon:'none'
        })
        this.$emit('closefx')
        return false;
      }
      if(type == 1){
        uni.share({
          provider: "weixin",
          scene: "WXSceneSession",
          type: 1,
          summary: this.text,
          success: function (res) {
            console.log("success:" + JSON.stringify(res));
          },
          fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
          }
        });
      }else if(type == 2){
        uni.share({
          provider: "weixin",
          scene: "WXSceneTimeline",
          type: 1,
          summary: this.text,
          success: function (res) {
            console.log("success:" + JSON.stringify(res));
          },
          fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
          }
        });
      }else{
        var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
        msg.to = [];
        msg.body = this.text;
        plus.messaging.sendMessage( msg );
      }
    },
    //关闭
    closefx:function (){
      this.$emit('closefx')
    }
  }
}
</script>

<style scoped>
.share-body {
  padding-top: 40px;
}
.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 1px;
  text-align: center;
}
.van-col--8 {
  width: 33.33333333%;
}
.van-col .icon-text {
  display: inline-block;
  text-align: center;
  position: relative;
}
.icon-text image {
  width: 36px;
  height: 36px;
}
.icon-text .text {
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #555;
}
.share{
  z-index: 9999999;
}
.share-body .ft-btn {
  padding: 15px 0;
  margin-top: 100px;
  text-align: center;
  box-sizing: border-box;
  border: 1px solid #ebedf0;
}
.uni-noticebar-icon{
  color: red !important;
}
</style>