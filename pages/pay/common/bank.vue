<template>
  <view class="bank-div">
    <view class="bank" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <!--    <view class="notice-box">
      <view class="notice-row">
        <view class="icon">
          <image src="../../../static/img/pay/notice.png"></image>
        </view>
        <view class="desc">
          存款到以下账户后，请填写存款信息。实际转账金额请务必与填写金一致，才能快速到账。
        </view>
      </view>
    </view>-->
      <view class="title">平台收款账户</view>
      <view class="list-box">
        <view class="list-row">
          <view class="left">
            <image :src="info.logoMobile"></image>
          </view>
          <view class="center">
            <text>{{ info.title }}</text>
          </view>
          <view class="right" @click="copyText(info.title)">
            <image class="copy" src="../../../static/img/pay/copy.png"></image>
          </view>
        </view>
        <view class="list-row">
          <view class="left">
            <text>卡号：</text>
          </view>
          <view class="center">
            <text>{{ info.account }}</text>
          </view>
          <view class="right" @click="copyText(info.account)">
            <image class="copy" src="../../../static/img/pay/copy.png"></image>
          </view>
        </view>

        <view class="list-row">
          <view class="left">
            <text>户名：</text>
          </view>
          <view class="center">
            <text>{{ info.realName }}</text>
          </view>
          <view class="right" @click="copyText(info.realName)">
            <image class="copy" src="../../../static/img/pay/copy.png"></image>
          </view>
        </view>

        <view class="list-row">
          <view class="left">
            <text>支行：</text>
          </view>
          <view class="center">
            <text>{{ info.openBank }}</text>
          </view>
          <view class="right" @click="copyText(info.remark)">
            <image class="copy" src="../../../static/img/pay/copy.png"></image>
          </view>
        </view>
      </view>
      <view class="title">填写存数信息</view>
      <view class="from">
        <view class="from-row">
          <view class="from-rol">
            <view class="left">姓名：</view>
            <view class="right">
              <uni-easyinput class="input-item" v-model="formData.name" :inputBorder="false" @input="name"
                :styles="styles" :placeholderStyle="placeholderStyle2" placeholder="请输入存款人姓名"></uni-easyinput>
            </view>
          </view>
          <view class="from-rol">
            <view class="left">金额：</view>
            <view class="right">
              <uni-easyinput class="input-item" v-model="money" type="number" :inputBorder="false" @input="moenys"
                :styles="styles" :placeholderStyle="placeholderStyle2" placeholder="请输入充值金额"></uni-easyinput>
            </view>
          </view>
          <!--        <view class="from-rol">
          <view class="left">日期：</view>
          <view class="right">
            <uni-datetime-picker v-model="formData.date" :border="false" @change="change">
              <uni-easyinput v-model="formData.date" class="input-item"
                             :inputBorder="false"
                             :styles="styles"
                             :suffixIcon="'right'"
                             :placeholderStyle="placeholderStyle2" placeholder="请选择时间">
              </uni-easyinput>
            </uni-datetime-picker>
          </view>
        </view>-->
        </view>
      </view>
      <view class="next-box">
        <view class="next-btn" :class="isAction ? 'active' : 'next-btn'" @click="nextBtn()">下一步</view>
      </view>
      <view class="hint">
        <view class="hint-box">
          <text class="hint-title">温馨提示：</text>
          <view class="content">
            存款到以下账户后，请填写存款信息。实际转账金额请务必与填写金一致，才能快速到账。
          </view>
        </view>
      </view>
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
import { incomeCompany, incomeOnline } from "../../../utils/lottery/mine";
export default {
  name: "bank",
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
      placeholderStyle2: "font-weight: 400;font-size: 30rpx;",
      isAction: false,
      formData: {
        name: '',
        amount: '',
        date: '',
      }
    }
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
    isAC() {
      if (this.money.length > 0 && this.formData.name.length > 0) {
        this.isAction = true
      } else {
        this.isAction = false
      }
    },
    change(e) {
      this.formData.date = e
      this.isAC()
    },
    name: throttle(function () {
      this.isAC()
    }, 200),
    moenys: throttle(function () {
      this.isAC()
    }, 200),
    confirm() {
      let prams = {
        account: this.info.account,
        amount: this.money,
        bankName: this.info.title,
        id: this.info.id,
        realName: this.info.realName,
        userRealName: this.formData.name,
        /* userTime:this.formData.date*/
      };
      this.$refs.confirm.close()
      incomeCompany(prams).then(res => {
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

  .notice-box {
    .notice-row {
      height: 66rpx;
      padding: 5rpx 20rpx 5rpx 20rpx;
      background: rgba(252, 225, 184, 0.5);
      display: flex;
      align-items: center;

      .icon {
        image {
          height: 48rpx;
          width: 48rpx;
        }
      }

      .desc {
        font-weight: 500;
        font-size: 20rpx;
        line-height: 28rpx;
        color: #CC3333;
        margin-left: 10rpx;
      }
    }
  }

  .title {
    height: 80rpx;
    border-radius: 0px;
    padding: 0rpx 10rpx 0rpx 20rpx;
    background: #F6F6F6;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 30rpx;
    line-height: 80rpx;
    color: #999999;
  }

  .list-box {
    .list-row {
      font-size: 30rpx;
      line-height: 42rpx;
      color: #222222;
      display: flex;
      align-items: center;
      padding: 16rpx 20rpx;
      background: #FFFFFF;
      border-bottom: 2rpx solid #DDDDDD;

      .left {
        width: 15%;

        image {
          height: 48rpx;
          width: 48rpx;
        }
      }

      .center {
        width: 75%;
        font-size: 30rpx;
        line-height: 42rpx;
        color: #222222;
      }

      .right {
        width: 10%;

        image {
          height: 48rpx;
          width: 48rpx;
        }
      }
    }
  }

  .from {
    .from-row {
      .from-rol {
        display: flex;
        padding: 10rpx 20rpx 10rpx 20rpx;
        background: #FFFFFF;
        border-bottom: 1px solid #DDDDDD;
        align-items: center;

        .left {
          width: 15%;
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          color: #222222;
        }

        .right {
          width: 85%;
        }
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
}
</style>