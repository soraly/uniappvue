<template>
  <view class="invation-wrap" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <view slot="right" class="tip" @click="openTip">
        ?
      </view>
    </NavBar>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" type="dialog">
      <view class="pop-tip-box">
        <view class="title">分享有礼</view>
        <view class="text-box">
          <view>1.分享app，好友填写邀请码注册后，可获得一次性1.0元的一级拉新奖励；如果您是代言人，则可获得4.9元的奖励哦。</view>
          <view>2.用户直接下级会员邀请好友注册登录后，可获得0.18元的二级拉新奖励。</view>
          <view>3.今日的邀请奖励必须今日领取，过期不候哦。</view>
        </view>
        <view class="shuom">领取步骤：我的-活动中心-邀请好友当中进行领取。</view>
        <view class="btn" @click="setApply">立即申请代言人</view>
      </view>
    </uni-popup>
    <view class="main-body">
      <view class="tupian"></view>
      <view class="code-info">
        <view class="code">
          <image :src="shareObj.qrCodePath" />
        </view>
        <view class="text">扫码下载APP，填写邀请码注册哟<br>{{ shareObj.inviteUrl }}</view>
        <view class="text-code">我的邀请码：{{ shareObj.inviteCode }}</view>
      </view>
    </view>
    <view class="bottom-sy">
      <uni-row class="van-row">
        <uni-col :span="12" class="van-col van-col--12">
          <image
            src="data:image/png;base64,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"
            @click="onShare" />
          <view @click="onShare">微信好友</view>
        </uni-col>
        <uni-col :span="12" class="van-col van-col--12">
          <image
            src="data:image/png;base64,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"
            @click="onShare" />
          <view @click="onShare">微信朋友圈</view>
        </uni-col>
      </uni-row>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { share, applySpoke } from "../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "invite",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "邀请好友",
      shareObj: {
        inviteCode: "",
        inviteUrl: "",
        qrCodePath: ""
      }
    }
  },
  onReady() {
    this.shareToFriends()
  },
  methods: {
    //邀请好友
    shareToFriends() {
      share().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.shareObj = res.result
        }
      })
    },
    //申请代言人
    setApply() {
      applySpoke().then(res => {
        uni.showToast({
          title: res.message,
          icon: "none"
        })
      })
    },
    onShare() {
      uni.showToast({
        title: "请下载APP进行分享",
        icon: "none"
      })
    },
    openTip() {
      // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
      this.$refs.popup.open("center")
    }
  }
}
</script>

<style lang="scss" scoped>
.invation-wrap {
  min-height: var(--vh);
  position: relative;

  .tip {
    color: rgb(102, 102, 102);
    border-radius: 50%;
    border: 1px solid rgb(102, 102, 102);
    width: 28rpx;
    height: 28rpx;
    text-align: center;
    line-height: 28rpx;
  }

  .pop-tip-box {
    width: 600rpx;
    padding: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      text-align: center;
      padding-bottom: 30rpx;
    }

    .text-box {
      color: #666;
      line-height: 44rpx;

      view {
        padding-bottom: 40rpx;
      }
    }

    .shuom {
      font-weight: 500;
      line-height: 44rpx;
    }

    .btn {
      height: 116rpx;
      width: 100%;
      line-height: 116rpx;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
      text-align: center;
      background-image: url('@/static/img/user/yqhybtn.png');
      background-size: 100% 100%;
      margin-top: 40rpx;
    }
  }

  .main-body {
    position: absolute;
    top: 92rpx;
    bottom: 200rpx;
    background-image: url("@/static/img/user/yq-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;

    .tupian {
      margin-top: 40rpx;
      background-image: url("@/static/img/user/yqhy-bg.png");
      background-repeat: no-repeat;
      background-size: 100%;
      height: 100%;
    }

    .code-info {
      background: #fff;
      padding: 40rpx;
      position: absolute;
      top: 480rpx;
      border-radius: 20rpx;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
    }

    .code {
      width: 370rpx;
      height: 370rpx;
      background: #eee;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .text {
      font-size: 24rpx;
      color: #666;
      padding: 20rpx 0;
    }

    .text-code {
      font-weight: 600;
    }
  }

  .bottom-sy {
    height: 200rpx;
    position: fixed;
    width: 100%;
    background: #fff;
    bottom: 0;
    text-align: center;
    font-size: 28rpx;

    .van-row {
      .van-col {
        image {
          width: 84rpx;
          height: 84rpx;
          margin-top: 40rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
}
</style>
