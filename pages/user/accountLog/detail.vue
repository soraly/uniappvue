<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="step-box">
      <view class="step-item">
        <image src="/static/img/user/accountlog/lv.png" v-if="detail.status >= -1"></image>
        <image src="/static/img/user/accountlog/hui.png" v-else></image>
        <view class="title" :class="{ 'hui-title': detail.status >= -1 }">{{ detail.type == '充值' ? '发起充值' : '发起提现' }}
        </view>
        <view class="time">{{ detail.createTime }}</view>
        <view class="line" :class="{ 'hui-line': detail.status < -1 }"></view>
      </view>
      <view class="step-item">
        <image src="/static/img/user/accountlog/lv.png" v-if="detail.status >= 0"></image>
        <image src="/static/img/user/accountlog/hui.png" v-else></image>
        <view class="title" :class="{ 'hui-title': detail.status >= 0 }">受理中</view>
        <view class="time">{{ detail.lockTime }}</view>
        <view class="line" :class="{ 'hui-line': detail.status < 1 }"></view>
      </view>
      <view class="step-item">
        <image src="/static/img/user/accountlog/lv.png" v-if="detail.status == 1"></image>
        <image src="/static/img/user/accountlog/err.png" v-else-if="detail.status == 2"></image>
        <image src="/static/img/user/accountlog/hui.png" v-else></image>
        <view class="title" :class="{ 'hui-title': detail.status == 1, 'hong-title': detail.status == 2 }">{{ getText }}
        </view>
        <view class="time">{{ detail.confirmTime }}</view>
      </view>
    </view>
    <view class="detail-row">
      <view class="detail-item">
        <view class="title">订单金额</view>
        <view class="right">{{ detail.amount }}元</view>
      </view>
      <view class="detail-item" v-if="detail.type == '充值'">
        <view class="title">充值赠送金额</view>
        <view class="right">{{ detail.discountAmount }}元</view>
      </view>
      <view class="detail-item" v-if="detail.type == '提现'">
        <view class="title">提现手续费</view>
        <view class="right">{{ detail.fee }}元（{{ detail.feeRatio }}%）</view>
      </view>
      <view class="detail-item">
        <view class="title">订单时间</view>
        <view class="right">{{ detail.createTime }}</view>
      </view>
      <view class="detail-item">
        <view class="title">交易方式</view>
        <view class="right">{{ detail.childType }}</view>
      </view>
      <view class="detail-item">
        <view class="title">附言</view>
        <view class="right remark">{{ detail.remark }}</view>
      </view>
      <view class="detail-item">
        <view class="title">订单编号</view>
        <view class="right">{{ detail.orderNo }}</view>
      </view>
      <view class="detail-item">
        <view class="title">订单来源</view>
        <view class="right">
          <image src="/static/img/user/accountlog/h5.png"></image>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import Common from "./common/common";
import { accessInfo } from "../../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Common
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "订单详情",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      detail: null,
      formData: {
        createTime: '',
        id: '',
        source: 1,
      }
    }
  },
  onLoad(option) {
    /*    console.log(option);*/
    //方式二：接收参数
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    eventChannel.on('argParams', function (data) {
      option = data
    })
    this.detail = option
    this.formData.createTime = option.createTime
    this.formData.id = option.id
    this.formData.source = option.source
    this.getInfo()
    console.log(this.detail)
  },
  mounted() {

  },
  computed: {
    getText() {
      if (this.detail.type == '充值') {
        if (this.detail.status == 1) {
          return "支付成功";
        } else if (this.detail.status == 2) {
          return "充值失败";
        } else {
          return "支付成功"
        }
      } else {
        if (this.detail.status == 1) {
          return "提现成功";
        } else if (this.detail.status == 2) {
          return "提现失败";
        } else {
          return "提现成功"
        }
      }
    }
  },
  methods: {
    getInfo: function () {
      let prams = this.formData
      console.log(prams)
      accessInfo(prams).then(res => {
        this.detail = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  font-family: 'PingFang SC';

  .step-box {
    height: 230rpx;
    left: 0px;
    background: #FFFFFF;
    display: flex;
    align-items: center;

    .step-item {
      width: 33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      image {
        height: 50rpx;
        width: 50rpx;
      }

      .title {
        font-weight: 400;
        font-size: 30rpx;
        text-align: center;
        margin-top: 20rpx;
        color: #999999;
      }

      .hui-title {
        color: #137620;
      }

      .hong-title {
        color: #CC3333;
      }

      .time {
        font-weight: 400;
        font-size: 22rpx;
        text-align: center;
        color: #999999;
        margin-top: 20rpx;
        height: 32rpx;
      }

      .line {
        position: absolute;
        height: 4rpx;
        width: 162rpx;
        background: linear-gradient(180deg, #6BD776 0%, #24A335 100%);
        border-radius: 20rpx;
        top: 20rpx;
        right: -80rpx;
      }

      .hui-line {
        background: #CCCCCC;
      }
    }
  }

  .detail-row {
    margin-top: 20rpx;
    background: #FFFFFF;
    padding: 0rpx 30rpx;

    .detail-item {
      display: flex;
      justify-content: space-between;
      height: 79rpx;

      .title {
        width: 27%;
        font-weight: 400;
        font-size: 26rpx;
        color: #444444;
        display: flex;
        align-items: center;
      }

      .right {
        width: 73%;
        text-align: end;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        image {
          height: 40rpx;
          width: 40rpx;
        }
      }

      .remark {
        color: #CC3333;
      }
    }
  }
}
</style>