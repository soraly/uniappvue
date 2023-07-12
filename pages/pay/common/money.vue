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

      <view class="list-div" v-if="info.fixedAmount != null && info.fixedAmount.length > 0">
        <view class="top-box"></view>
        <view class="list-row">
          <view class="list-item" v-for="(item, index) in moneyList" :class="{ actives: money == item }"
            @click="selectMoney(item)">
            {{ item + " 元" }}
          </view>
        </view>
      </view>

      <view class="input-item" v-else>
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
      <uni-popup ref="confirm" type="center" background-color="#fff">
        <view class="confirm-box">
          <view class="title">提示</view>
          <view class="notice">您确认现在就开始充值吗？</view>
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
import { incomeOnline } from "../../../utils/lottery/mine";
export default {
  name: "money",
  components: { NavBar, uniDrawer },
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
    }, 500),
    nextBtn() {
      if (this.isAction == false) {
        return false
      }
      this.$refs.confirm.open()
    },
    cancel() {
      this.$refs.confirm.close()
    },
    confirm() {
      let prams = {
        amount: this.money,
        id: this.info.id
      };
      this.$refs.confirm.close()
      incomeOnline(prams).then(res => {
        if (res.code == 200) {
          //#ifdef H5
          window.location.href = res.result
          //#endif
          //#ifdef APP-PLUS
          plus.runtime.openURL(res.result)
          //#endif
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
      .uni-input {
        width: 90%;
        height: 130rpx;
        padding: 0rpx 10rpx 0rpx 45rpx;
        background: #FFFFFF;
        border: 0;
        text-align: left;
      }
    }
  }

  .list-div {
    .top-box {
      height: 130rpx;
      border-radius: 0px;
    }

    .list-row {
      border-top: 2rpx solid #DDDDDD;
      display: flex;
      flex-wrap: wrap;
      padding: 20rpx;
      gap: 24rpx;

      .list-item {
        height: 100rpx;
        width: 30%;
        border-radius: 10rpx;
        background: #FFFFFF;
        border: 1px solid #E6E6E6;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .actives {
        background: #8CB2C9;
        color: #FFFFFF;
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
    height: 339rpx;
    width: 436rpx;
    border-radius: 10rpx;
    padding: 0rpx 54rpx 0rpx 54rpx;

    .title {
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