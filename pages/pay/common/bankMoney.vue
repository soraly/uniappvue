<template>
  <view class="bank-div">
    <view class="money" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <view class="pay-box">
        <uni-list class="list-row" :border="false">
          <uni-list-item class="list-item">
            <template v-slot:header>
              <view class="slot-box">
                <image class="slot-image" :src="info.logoMobile" mode="widthFix"></image>
              </view>
            </template>
            <!-- 自定义 body -->
            <template v-slot:body>
              <text class="slot-text">{{ info.title }}</text>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
      <view class="line"></view>

      <view class="input-item">
        <view class="input-row">
          <input class="uni-input" :placeholder-style="placeholderStyle" type="number" @input="moeny" v-model="money"
            :placeholder="'请输入充值金额（' + info.singleMinLimit + '-' + info.singleMaxLimit + '）'" />
        </view>
      </view>

      <view class="next-box">
        <view class="next-btn" :class="isAction ? 'active' : 'next-btn'" @click="nextBtn()">下一步</view>
      </view>
      <view class="hint">
        <view class="hint-box">
          <text class="hint-title">温馨提示：</text>
          <view class="content">
            {{ info.remark }}
          </view>
        </view>
      </view>
      <uni-drawer ref="pay" mode="right" :width="100">
        <scroll-view class="scroll-view-box" scroll-y="true">
          <Bank :info="info" :money="money" @closePay="closePay" />
        </scroll-view>
      </uni-drawer>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import uniDrawer from "../../../uni_modules/uni-drawer/components/uni-drawer/uni-drawer";
import { debounce, throttle } from "../../../utils/function";
import Bank from "./bank";

export default {
  name: "bankMoney",
  components: { NavBar, uniDrawer, Bank },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "充值输入金额",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      placeholderStyle: "'font-weight': '500';'font-size': '32rpx';'line-height': '45rpx';'color': '#757575';",
      money: "",
      moneyList: [],
      isAction: false,
    }
  },
  mounted() {
    if (this.info.fixedAmount != null && this.info.fixedAmount.length > 0) {
      this.moneyList = this.info.fixedAmount.split(",");
    }
  },
  methods: {
    back() {
      this.$emit('closePay');
    },
    onClick() {
      console.log(1111)
      this.$refs.test.open()
    },
    closePay() {
      this.$refs.pay.close()
    },
    selectMoney(item) {
      this.money = item + ""
      if (this.money.length > 0) {
        this.isAction = true
      } else {
        this.isAction = false
      }
      console.log(this.isAction)
    },
    moeny: throttle(function () {
      if (this.money >= this.info.singleMinLimit && this.money <= this.info.singleMaxLimit) {
        this.isAction = true
      } else {
        this.isAction = false
      }
    }, 200),
    nextBtn() {
      if (this.isAction == false) {
        return false
      }
      this.$refs.pay.open()
    },
    cancel() {
      this.$refs.confirm.close()
    },
  }
}
</script>

<style lang="scss" scoped>
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.money {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .pay-box {
    .list-row {
      background: #F6F6F6;

      .list-item {
        height: 120rpx;
        /*margin-top: 10rpx;*/
        background: #FFFFFF;

        .slot-box {
          display: flex;
          align-items: center;

          .slot-image {
            height: 54rpx;
            width: 54rpx;
          }
        }

        .slot-text {
          font-weight: 500;
          font-size: 32rpx;
          line-height: 45rpx;
          display: flex;
          align-items: center;
          color: #222222;
          margin-left: 18rpx;
        }
      }
    }

  }

  .line {
    height: 10rpx;
    border-radius: 0px;
    background: #F6F6F6;
  }

  .input-item {
    width: 100%;
    border-bottom: 2rpx solid #DDDDDD;
    ;

    .input-row {
      height: 130rpx;

      .uni-input {
        width: 90%;
        padding: 0rpx 10rpx 0rpx 45rpx;
        background: #FFFFFF;
        border: 0;
        text-align: left;
        height: 100%;
      }
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
        margin: 20rpx 6rpx 0 0;
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

  .scroll-view {
    /* #ifndef APP-NVUE */
    width: 100%;
    height: 100%;
    /* #endif */
    flex: 1
  }

  // 处理抽屉内容滚动
  .scroll-view-box {
    flex: 1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>