<template>
  <view>
    <uni-popup class="dialog-box" ref="popup" type="dialog" background-color="#fff">
      <view class="msg-box">
        <view class="header">
          <view class="close">
            <image mode="widthFix" src="./../../../static/img/liuhe/close.png" @click="close"></image>
          </view>
          玩法说明
        </view>
        <view class="content">
          <rich-text :nodes="helpStr"></rich-text>
        </view>
        <view class="footer">
          <view class="title">投注示例：</view>
          <view class="text">
            玩法说明投注方案：{{ exampleStr }}
          </view>
          <view class="text">
            <text class="title">示例号码：</text>
            {{ tipsStr }}
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  props:{
    helpStr:{
      default:null,
      type:String,
    },
    tipsStr:{
      default:null,
      type:String,
    },
    exampleStr:{
      default:null,
      type:String,
    }
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    /**
     * 点击取消按钮触发
     * @param {Object} done
     */
    close() {
      this.$refs.popup.close()
    },
    /**
     * 点击确认按钮触发
     * @param {Object} done
     * @param {Object} value
     */
    confirm(value) {
      // 输入框的值
      console.log(value)
      // TODO 做一些其他的事情，手动执行 close 才会关闭对话框
      // ...
      this.$refs.popup.close()
    }
  }
}
</script>
<style lang="scss" scoped>
  .msg-box{
    background: #FFFFFF;
    width: 580rpx;
    //height: 464rpx;
    border-radius: 20rpx;
    padding: 22rpx 40rpx;
    .header{
      text-align: center;
      padding-bottom: 14rpx;
      font-size: 40rpx;
      color: #323233;
      border-bottom: 2px solid #E7E7E7;
      position: relative;
      .close{
        position: absolute;
        right: 0;
        top: 0;
        image{
          width: 32rpx;
        }
      }
    }
    .content{
      padding: 22rpx 0;
      font-size: 29rpx;
      line-height: 41rpx;
      letter-spacing: -0.01em;
      color: #333333;
      flex: none;
      order: 0;
      flex-grow: 0;
      border-bottom: 2px solid #E7E7E7;
      text-align: left;
    }
    .footer{
      padding: 22rpx 0;
      .title{
        font-weight: 400;
        font-size: 29rpx;
        line-height: 41rpx;
        color: #E86772;
        text-align: left;
      }
      .text{
        font-weight: 400;
        font-size: 29rpx;
        line-height: 41rpx;
        color: #333333;
        text-align: left;
        margin: 15rpx 0 15rpx 0;
        word-break: break-all;
      }
    }
  }

</style>
