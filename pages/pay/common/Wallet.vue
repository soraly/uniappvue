<template>
  <view class="bank-div">
    <view class="bank" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <scroll-view class="scroll-view-box" scroll-y="true">
        <view class="qrcode">
          <image :src="detail.qrCode"></image>
        </view>
        <view class="title">支付资讯</view>
        <view class="list-box">
          <view class="list-item">
            <view class="name">转账数量（USDT）</view>
            <view class="num">{{ money }}</view>
          </view>
          <view class="list-item">
            <view class="name">兑换比例（USDT/RMB）</view>
            <view class="num">{{ info.exchangeRatio }}</view>
          </view>
          <view class="list-item">
            <view class="name">到账金额（RMB）</view>
            <view class="num">{{ money * info.exchangeRatio }}</view>
          </view>
          <view class="list-item">
            <view class="name">转账地址</view>
            <view class="num" @click="copyText(detail.address)">
              <image class="copy" src="../../../static/img/pay/copy.png"></image>
            </view>
          </view>
          <view class="address">{{ detail.address }}</view>
        </view>
        <view class="title">交易资讯</view>
        <view class="input-row">
          <input class="uni-input" :placeholder-style="placeholderStyle" @input="moeny" v-model="payNo"
            placeholder="请输入交易ID" />
        </view>
        <view class="next-box">
          <view class="next-btn" :class="isAction ? 'active' : 'next-btn'" @click="nextBtn()">下一步</view>
        </view>
        <view class="hint">
          <view class="hint-box">
            <text class="hint-title">温馨提示：</text>
            <view class="content">
              <view class="label">
                １．<view class="text">不含转账手续费。</view>
              </view>
              <view class="label">
                ２．<view class="text">需要整个网络节点确认才能到账。</view>
              </view>
              <view class="label">
                ３．<view class="text">对换比例是可变动的，请尽快完成转账，如停留此超过15分钟，建议重新操作以获取最新兑换比例。</view>
              </view>
              <view class="label">
                ４．<view class="text">请勿保留旧的转账地址进行交易，否则金额奖无法到账。</view>
              </view>
              <view class="label">５．
                <view class="text">请勿转入非USDT资产，奖无法找回。</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <uni-popup ref="confirm" type="center">
        <view class="confirm-box">
          <view class="titles">提示</view>
          <view class="notice">您确认已经转账成功吗？</view>
          <view class="btn-box">
            <view class="cancel-btn" @click="cancel">取消</view>
            <view class="confirm-btn" @click="confirm">确认</view>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import uniDrawer from "../../../uni_modules/uni-drawer/components/uni-drawer/uni-drawer";
import { debounce, throttle } from "../../../utils/function";
import { incomeWallet } from "../../../utils/lottery/mine";
export default {
  name: "Wallet",
  components: { NavBar, uniDrawer },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
    money: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "填写信息",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      placeholderStyle: "'font-weight': '500';'font-size': '32rpx';'line-height': '45rpx';'color': '#757575';",
      styles: {
        'width': '100%',
        'height': '100%',
        'border': 'none',
        'background': '#FFFFFF',
        'text-align': 'left',
      },
      isAction: true,
      payNo: '',
      formData: {
        name: '',
        amount: '',
        date: '',
      }
    }
  },
  mounted() {
    this.detail.izOrderId == 1 ? this.isAction = false : this.isAction = true
  },
  methods: {
    back() {
      this.$emit('closePay');
    },
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: (res) => {
          uni.showToast({
            title: "复制成功"
          })
        }
      })
    },
    cancel() {
      this.$refs.confirm.close()
    },
    nextBtn() {
      if (this.isAction == false) {
        return false
      }
      this.$refs.confirm.open()
    },
    moeny: throttle(function () {
      if (this.detail.izOrderId == 1) {
        if (this.payNo !== '') {
          this.isAction = true
        } else {
          this.isAction = false
        }
      }
    }, 200),
    confirm() {
      let prams = {
        id: this.detail.id,
        num: this.money,
        payNo: this.payNo,
      };
      this.$refs.confirm.close()
      incomeWallet(prams).then(res => {
        if (res.code == 200) {
          pop("提交成功", 2000)
          uni.navigateTo({
            url: "/pages/user/accountLog/index"
          })
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.bank {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .scroll-view-box {
    height: calc(var(--vh) - 92rpx);
  }

  .title {
    height: 60rpx;
    border-radius: 0px;
    padding: 10rpx 10rpx 10rpx 20rpx;
    background: #F6F6F6;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 30rpx;
    line-height: 80rpx;
    color: #999999;
    display: flex;
    align-items: center;
  }

  .qrcode {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 20rpx 10rpx 10rpx;
    height: 250rpx;
    background: #FFFFFF;

    image {
      height: 220rpx;
      width: 220rpx;
    }
  }

  .list-box {
    display: flex;
    flex-direction: column;
    height: 360rpx;
    background: #FFFFFF;

    .list-item {
      display: flex;
      justify-content: space-between;
      margin: 24rpx 30rpx 0 30rpx;

      .name {
        font-weight: 400;
        font-size: 26rpx;
        line-height: 36rpx;
        color: #444444;
      }

      .num {
        font-weight: 400;
        font-size: 26rpx;
        line-height: 36rpx;
        color: #999999;

        image {
          height: 48rpx;
          width: 48rpx;
        }
      }
    }
  }

  .address {
    font-weight: 400;
    font-size: 30rpx;
    line-height: 42rpx;
    color: #14ADC4;
    text-align: center;
    margin-top: 30rpx;
  }

  .input-row {
    .uni-input {
      width: 93%;
      padding: 30rpx 10rpx 30rpx 45rpx;
      background: #FFFFFF;
      border: 0;
      text-align: left;
    }
  }

  .next-box {
    clear: both;
    margin-top: 29rpx;
    display: flex;
    justify-content: center;

    .next-btn {
      width: 705rpx;
      height: 90rpx;
      background: #C8C9CC;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .active {
      width: 705rpx;
      height: 90rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .hint {
    display: flex;
    justify-content: center;
    padding-bottom: 20rpx;

    .hint-box {
      width: 705rpx;
      margin-top: 42rpx;

      .hint-title {
        font-weight: 500;
        font-size: 30rpx;
        line-height: 42rpx;
        text-align: center;
        color: #CC3333;
      }

      .content {
        font-weight: 400;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #A1A1A1;
        margin: 6rpx 6rpx 0 0;

        .label {
          display: flex;

          .text {
            width: 90%;
          }
        }
      }
    }
  }

  .confirm-box {
    height: 299rpx;
    width: 436rpx;
    border-radius: 10rpx;
    padding: 20rpx 54rpx 20rpx 54rpx;
    background: #fff;

    .titles {
      height: 80rpx;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 80rpx;
      text-align: center;
      color: #9A9A9A;
      border-bottom: 2rpx solid #E6E6E6;
    }

    .notice {
      height: 160rpx;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 160rpx;
      text-align: center;
      color: #333333;
    }

    .btn-box {
      display: flex;
      color: #FFFFFF;
      font-weight: 400;
      font-size: 26rpx;

      .cancel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60rpx;
        width: 200rpx;
        border-radius: 264rpx;
        background: #8CB2C9;
        margin-right: 20rpx;
      }

      .confirm-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60rpx;
        width: 200rpx;
        border-radius: 264rpx;
        background: #FF9900;
        margin-left: 20rpx;
      }
    }
  }
}
</style>