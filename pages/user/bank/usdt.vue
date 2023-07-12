<template>
  <view class="add-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="title">请绑定本人的USDT地址</view>
    <view class="from">
      <view class="from-row">
        <view class="from-rol">
          <view class="left">USDT地址</view>
          <view class="right">
            <uni-easyinput class="input-item" v-model="formData.bankNumber" @blur="isDone" @clear="isDone"
              :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyle2" placeholder="请输入您的USDT地址">
            </uni-easyinput>
          </view>
        </view>
        <view class="from-rol">
          <view class="left">网络</view>
          <view class="right" @click="selectBank()">
            <view class="text-box">
              <view class="text" v-if="!BankInfo">请选择网络</view>
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
      </view>
    </view>
    <view class="next-box">
      <view class="next-btn" :class="isAction ? 'active' : 'next-btn'" @click="nextBtn">下一步</view>
    </view>
    <uni-drawer ref="bank" :mode="'right'" :width="100">
      <bank-list @closePay="closePay" :data="bank" @searchBank="searchBank" @setBank="setBank">
      </bank-list>
    </uni-drawer>
    <uni-drawer ref="bankConfirm" :mode="'right'" :width="100">
      <ConfirmUsdt @closeNext="closeNext" @backIndex="backIndex" :data="BankInfo" :form-data="formData" />
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
import ConfirmUsdt from "./common/ConfirmUsdt";
import Success from "./common/Success";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { bankList } from "../../../utils/lottery/mine";

export default {
  name: "usdt",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, BankList, ConfirmUsdt, Success
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "添加USDT地址",
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
        'text-align': 'right',
      },
      placeholderStyle2: "font-weight: 400;font-size: 30rpx;text-align:right",
      isAction: false,
      keyword: '',
      bank: [
        { id: 1, name: 'TRC20', logoMobile: '/static/img/user/bank/trc.png' },
        { id: 2, name: 'ERC20', logoMobile: '/static/img/user/bank/erc.png' },
        { id: 3, name: 'OMNI', logoMobile: '/static/img/user/bank/omni.png' },
        { id: 4, name: 'BEP2', logoMobile: '/static/img/user/bank/bep.png' }
      ],
      BankInfo: null,
      formData: {
        bankId: '',
        bankNumber: '',
      }
    }
  },
  onLoad() {
  },
  methods: {
    selectBank() {
      this.$refs.bank.open()
    },
    searchBank(keyword) {
      this.keyword = keyword
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
    isDone() {
      if (this.formData.bankNumber != '' && this.formData.bankId != '') {
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

          .input-item {
            text-align: right;
          }

          .text-box {
            width: 90%;
            margin-left: 20rpx;
            color: #999999;
            text-align: right;
          }

          .bank {
            width: 90%;
            color: #222222;
            display: flex;
            align-items: center;
            justify-content: flex-end;

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