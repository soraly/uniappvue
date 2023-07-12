<template>
  <view class="add-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="title">请绑定本人的第三方钱包地址</view>
    <view class="from">
      <view class="from-row">
        <view class="from-rol">
          <view class="left">真实姓名</view>
          <view class="right">
            <uni-easyinput class="input-item" v-model="formData.realName" @input="realNames" @clear="isDone"
              :inputBorder="false" :styles="styles" :disabled="isDisabled" :placeholderStyle="placeholderStyle2"
              placeholder="请输入姓名">
            </uni-easyinput>
          </view>
        </view>
        <view class="from-rol">
          <view class="left">钱包名称</view>
          <view class="right" @click="selectBank()">
            <view class="text-box">
              <view class="text" v-if="!BankInfo">请选择钱包</view>
              <view class="bank" v-else>
                <image :src="BankInfo.logoMobile"></image>
                {{ BankInfo.name }}
              </view>
            </view>
            <view class="arrow">
              <uni-icons type="forward" style="color: #999999;" size="20"></uni-icons>
            </view>
          </view>
        </view>

        <view class="from-rol">
          <view class="left">收款地址</view>
          <view class="right">
            <uni-easyinput class="input-item" v-model="formData.bankNumber" @input="bankNumbers" @clear="isDone"
              :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyle2" placeholder="请输入您的钱包收款地址">
            </uni-easyinput>
          </view>
        </view>
      </view>
    </view>
    <view class="next-box">
      <view class="next-btn" :class="isAction ? 'active' : 'next-btn'" @click="nextBtn">下一步</view>
    </view>
    <uni-drawer ref="bank" :mode="'right'" :width="100">
      <bank-list :isShow="false" @closePay="closePay" :data="wallet" :title="'选择第三方钱包'" @searchBank="searchBank"
        @setBank="setBank">
      </bank-list>
    </uni-drawer>
    <uni-drawer ref="bankConfirm" :mode="'right'" :width="100">
      <ConfirmWallet @closeNext="closeNext" @backIndex="backIndex" :data="BankInfo" :form-data="formData" />
    </uni-drawer>
    <uni-drawer ref="succ" :mode="'right'" :width="100">
      <Success />
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import BankList from "./common/BankList";
import ConfirmWallet from "./common/ConfirmWallet";
import { getRealName, walletList } from "../../../utils/lottery/mine";
import Success from "./common/Success";
import { throttle } from "../../../utils/function";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "wallet",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, BankList, ConfirmWallet, Success
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "添加第三方钱包地址",
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
      keyword: '',
      wallet: [],
      BankInfo: null,
      isDisabled: false,
      formData: {
        bankId: '',
        realName: '',
        bankNumber: '',
      }
    }
  },
  onLoad() {
    this.realName()
    this.getWalletList()
  },
  methods: {
    selectBank() {
      this.$refs.bank.open()
    },
    searchBank(keyword) {
      this.keyword = keyword
      this.getWalletList()
    },
    setBank(item) {
      this.BankInfo = item
      this.formData.bankId = item.id
      this.isDone()
      this.closePay()
    },
    closePay() {
      this.$refs.bank.close()
    },
    realNames: throttle(function () {
      this.isDone()
    }, 200),
    bankNumbers: throttle(function () {
      this.isDone()
    }, 200),
    isDone() {
      if (this.formData.realName != '' && this.formData.bankNumber != '' && this.formData.bankId != '') {
        this.isAction = true
      } else {
        this.isAction = false
      }
    },
    nextBtn() {
      this.$refs.bankConfirm.open()
    },
    closeNext() {
      this.$refs.bankConfirm.close()
    },
    backIndex() {
      this.$refs.bankConfirm.close()
      this.$refs.succ.open()
    },
    realName() {
      getRealName().then(res => {
        if (res.result) {
          this.isDisabled = true
          this.formData.realName = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getWalletList() {
      walletList().then(res => {
        this.wallet = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-box {
  font-family: 'PingFang SC';

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

  .from {
    .from-row {
      .from-rol {
        display: flex;
        height: 90rpx;
        padding: 0rpx 20rpx 0rpx 20rpx;
        background: #FFFFFF;
        border-bottom: 1px solid #DDDDDD;
        align-items: center;

        .left {
          width: 20%;
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          color: #222222;
        }

        .right {
          width: 80%;
          display: flex;

          .text-box {
            width: 90%;
            margin-left: 20rpx;
            color: #999999;
          }

          .bank {
            width: 90%;
            color: #222222;
            display: flex;
            align-items: center;

            image {
              margin-right: 4rpx;
              height: 40rpx;
              width: 40rpx;
            }
          }

          .arrow {
            width: 10%;
            text-align: right;
          }
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
}
</style>