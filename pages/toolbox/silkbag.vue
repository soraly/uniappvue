<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <template v-slot:right>
        <picker @change="bindPickerChange" :value="index" :range="array" v-if="year">
          <uni-icons type="calendar" color="#07c160" size="18" style="width:15px;height:15px;margin-right:10px;" />
        </picker>
      </template>
    </NavBar>
    <view class="silkbag-body" v-if="!year" style="">
      <notice :content="content" :styleContent="styleContent"></notice>
      <p class="sub-title">{{ sinkBagInfo.title }}</p>
      <image mode="widthFix" src="../../static/img/toolbox/silkbag.png"></image>
      <view v-if="isOpen" class="body-content">
        <p v-for="(item, index) in sinkBagInfo.content">{{ item }}</p>
      </view>
      <button v-else type="primary" class="open" @click="isOpen = true">打开锦囊</button>
      <button type="primary" class="history" @click="goHistory">前往历史</button>
      <view class="footer-text">提示：打开锦囊是本期的六合彩的一道谜题，参透谜题将获得本期中奖号码，快来打开您的玄机吧！</view>
    </view>
    <view class="history-list" v-else>
      <view class="" v-if="list.length > 0">
        <uni-collapse v-for="(item, index) in list">
          <uni-collapse-item :showArrow="false">
            <template v-slot:title>
              <p class="history-item-title">
                {{ item.title }}
                <image mode="widthFix" src="../../static/img/toolbox/jtx.png"></image>
              </p>
            </template>
            <view class="content">
              <view class="history-item-content" style="">
                <p v-for="(val, key) in item.content">{{ val }}</p>
              </view>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
      <view class="empty" v-else>
        <empty></empty>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import { sinkBag, listYear, listSinkBag } from '../../utils/toolbox/index';
import Empty from '../../components/common/empty/empty'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "silkbag",
  components: {
    AlertInjectLayer,
    NavBar,
    Notice,
    Empty
  },

  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '玄机锦囊',
      content: '10万六合彩用户都说准的谜题，这一期，您猜出了什么玄机?',
      year: '',
      index: 0,
      styleContent: {
        'font-size': '24rpx',
        'margin-top': '6rpx 0 0 0',
        'line-height': '28rpx',
        'text-align': 'left',
        'box-sizing': 'border-box',
        padding: '0 20rpx'
      },
      isOpen: false,
      sinkBagInfo: {},
      array: [],
      list: [],
    }
  },
  onLoad(option) {
    this.year = option.year
    if (this.year) {
      this.listSinkBag()
    } else {
      this.sinkBag()
    }
    this.listLotteryDate()
  },
  methods: {
    bindPickerChange: function (e) {
      this.index = e.detail.value
      this.year = this.array[this.index]
      this.list = []
      this.listSinkBag()
    },
    goHistory() {
      let year = this.array[0]
      uni.navigateTo({
        url: 'silkbag?year=' + year,
      })
    },
    sinkBag() {
      sinkBag().then(res => {
        this.sinkBagInfo = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    listLotteryDate() {
      listYear().then(res => {
        this.array = res.data.list
      }).catch(err => {
        console.log(err)
      })
    },
    listSinkBag() {
      let prams = {
        jpushId: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
        year: this.year
      }
      listSinkBag(prams).then(res => {
        this.list = res.data.list
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.silkbag-body {
  position: relative;
  min-height: calc(var(--vh) - 46px);
  margin-top: 12rpx;
  background: #fff;
  padding: 20rpx 24rpx;
  box-sizing: border-box;
  padding-bottom: 120px;

  .sub-title {
    font-size: 36rpx;
    color: #333;
    line-height: 48rpx;
    margin: 40rpx 0 60rpx;
    text-align: center;
  }

  image {
    display: block;
    margin: 0 auto 68rpx auto;
    width: 376rpx;
  }

  .body-content {
    line-height: 56rpx;
    font-size: 36rpx;
    color: #db1f1f;
    margin: 0 auto 46rpx auto;
    text-align: center;
  }

  .open {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    background: #07c160;
    font-size: 32rpx;
    margin-top: 70rpx;
  }

  .history {
    border: 2rpx solid #07c160;
    background: #fff;
    color: #07c160;
    margin-top: 52rpx;
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
  }

  .footer-text {
    position: absolute;
    width: 90%;
    color: #333;
    font-size: 24rpx;
    text-align: center;
    line-height: 34rpx;
    bottom: 34rpx;
  }
}

.history-list {
  position: absolute;
  height: 100%;
  top: 104rpx;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  background: #fff;

  .history-item-title {
    font-size: 36rpx;
    height: 100rpx;
    line-height: 50rpx;
    padding: 22rpx 28rpx 0;
    box-sizing: border-box;

    image {
      float: right;
      width: 28rpx;
      margin-top: 16rpx;
    }
  }

  .history-item-content {
    height: 142rpx;
    text-align: center;
    padding-top: 26rpx;
    background: #f7f7f7;

    p {
      line-height: 50rpx;
      margin-bottom: 14rpx;
      font-size: 36rpx;
      color: #db1f1f;
    }
  }
}
</style>