<template>
  <view class="wallet-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="content">
      <view class="header">
        <view class="left">
          <view class="title">
            <view>账户总余额</view>
            <view class="balance-box">
              <u-count-to class="balance" :decimals="2" :start-val="0" :end-val="balance" v-if="!loading"></u-count-to>
              <u-loading :show="loading" size="24"></u-loading>
            </view>
            <image class="refshs" :class="{ run: loading }" src="/static/img/user/wallet/refsh.png" @click="getInit()">
            </image>
          </view>
          <view class="tip">仅可拉回整数余额</view>
        </view>
        <view class="btn" @click="rollInBack()">一键回收</view>
      </view>
      <view class="list-box">
        <view class="category-list">
          <view class="item" :class="{ selected: categoryId === 0 }" @click="categoryId = 0">
            <image class="img" :src="`/static/img/liuhe/activity/quota/${categoryId === 0 ? '' : 'ac'}0.png`">
            </image>
            <view class="name">全部</view>
          </view>
          <view class="item" :class="{ selected: categoryId === item.id }" v-for="(item, index) in categoryList"
            :key="index" @click="categoryId = item.id">
            <image class="img"
              :src="`/static/img/liuhe/activity/quota/${categoryId === item.id ? item.id : 'ac' + item.id}.png`"></image>
            <view class="name">{{ item.name }}</view>
          </view>
        </view>

        <view class="right">
          <uni-search-bar class="search" bgColor="#fff" radius="10"
            :placeholderStyle="'color:rgba(37, 98, 86, 0.75);font-size: 24rpx;'" placeholder="平台搜索" clearButton="none"
            cancelButton="none" v-model="platformName" @confirm="getInit()" />

          <Empty v-if="!loading && !list.length" />
          <view class="loding" v-if="loading">
            <image src="/static/img/liuhe/load.gif"></image>
            <text class="text">加载中...</text>
          </view>
          <view class="list" v-else>
            <view class="item" v-for="(item, index) in list" :key="index">
              <view class="title">
                <image class="img" :src="item.logo"></image>
                <view class="name">{{ item.platformName }}</view>
                <image class="img" :class="{ run: curr === item.platformId || currAll }"
                  src="/static/img/user/wallet/refshs.png" @click="rollInBack(item)"></image>
              </view>
              <view class="divider"></view>
              <view class="tip" :class="{ tip1: item.text === '已回收' }">{{ item.text }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { initQuota, rollIn } from "../../../utils/lottery/mine";

import Empty from '../../../components/common/empty/empty'
export default {
  name: "quota",
  components: {
    AlertInjectLayer,
    NavBar,
    Empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "额度回收",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      loading: false,
      isRoll: false,
      platformName: '',
      categoryId: 0,
      curr: 0,
      currAll: false,
      balance: '',
      categoryList: [],
      list: [],
    }
  },
  onLoad(option) {
    this.getInit()
  },
  onShow() {
  },
  watch: {
    categoryId(val) {
      this.getInit()
    }
  },
  methods: {
    getInit() {
      this.loading = true
      const params = {
        platformId: !!this.platformId,
        platformName: this.platformName
      }
      if (this.categoryId) {
        params.categoryId = this.categoryId
      }
      console.log('params', params);
      initQuota(params).then(res => {
        this.balance = res.result.balance
        this.categoryList = res.result.categoryList
        this.list = res.result.list
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    async rollInBack(item = null) {
      if (this.isRoll) {
        pop("正在回收中...", 2000)
        return false
      }
      uni.showLoading({
        title: '正在回收'
      });
      this.isRoll = true
      let params = {
      }
      if (this.categoryId) {
        params.categoryId = this.categoryId
      }
      if (item) {
        this.curr = item.platformId
        params.platformId = item.platformId
      } else {
        this.currAll = true
      }
      const res = await rollIn(params).catch(err => {
        console.log(err)
      })
      if (res.code == 200) {
        this.balance = res.result.balance
        this.categoryList = res.result.categoryList
        this.list = res.result.list
      }
      pop(res.message, 2000)
      this.isRoll = false
      this.curr = 0
      this.currAll = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wallet-box {
  background: #f6f6f6;
  height: var(--vh);

  .content {
    padding: 10rpx;
    display: flex;
    flex-direction: column;
    /*gap: 20rpx;*/
    min-height: calc(100% - 200rpx);

    .header {
      display: flex;
      justify-content: space-between;
      padding: 10rpx;
      background: #FFFFFF;
      border-radius: 20rpx;
      align-items: center;

      .left {
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .title {
          display: flex;
          align-items: center;
          gap: 20rpx;
          font-size: 24rpx;
          color: #444444;
          line-height: 34rpx;

          .balance-box {
            display: flex;
            align-items: center;
            gap: 20rpx;
            min-width: 100rpx;
            justify-content: center;

            .balance {
              color: #FF8A00 !important;
              font-size: 24rpx !important;
            }

          }

          .refshs {
            width: 30rpx;
            height: 30rpx;
            filter: brightness(0.5);
          }
        }

        .tip {
          font-size: 18rpx;
          color: #999999;
          line-height: 25rpx;
        }

      }

      .btn {
        padding: 8rpx 12rpx;
        background: #36ACA9;
        border-radius: 10rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #FFFFFF;
      }
    }

    .list-box {
      display: flex;
      /*gap: 20rpx;*/
      flex: 1;
      /*底部gap失效导致贴紧*/
      margin-top: 20rpx;
      .category-list {
        display: flex;
        flex-direction: column;
        /*gap: 20rpx;!*同样低版本flex+gap gap失效的问题*!*/
        overflow: auto;
        flex-shrink: 0;
        max-height: calc(var(--vh) - 230rpx);
        margin-right: 20rpx;
        .item {
          height: 70rpx;
          background: #FFFFFF;
          margin-bottom: 20rpx;
          box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 4rpx 4rpx 0rpx rgba(0, 0, 0, 0.09),
            0rpx 9rpx 5rpx 0rpx rgba(0, 0, 0, 0.05),
            0rpx 15rpx 6rpx 0rpx rgba(0, 0, 0, 0.01),
            0rpx 24rpx 7rpx 0rpx rgba(0, 0, 0, 0.00);
          ;
          border-radius: 10px;
          display: flex;
          gap: 20rpx;
          align-items: center;
          padding: 0 15px;
          box-sizing: border-box;


          .img {
            width: 44rpx;
            height: 44rpx;
            flex-shrink: 0;
          }

          .name {
            font-size: 24rpx;
            line-height: 34rpx;
            color: #666666;
            white-space: nowrap;
          }
        }

        .selected {
          background: linear-gradient(180deg, #4FACFD 0%, #4FACFD 0%, #20B5FA 0.01%, #0089FF 100%);

          .name {
            color: #fff;
          }
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        /*gap: 10rpx;*/

        .search {
          padding: 0;
          border: 1px solid rgba(66, 175, 153, 0.25);
          overflow: hidden;
          margin-bottom: 10rpx;
          /deep/ .uni-searchbar__box {
            flex-direction: row-reverse;

            .uni-searchbar__box-search-input {
              padding-left: 20rpx;
            }
          }
        }

        .loding {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;

          image {
            width: 100rpx;
            height: 100rpx;
          }

          .text {
            font-weight: 400;
            font-size: 24rpx;
            color: #555555;
          }
        }

        .list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20rpx;
          overflow: auto;
          height: fit-content;
          max-height: calc(var(--vh) - 330rpx);

          .item {
            background: #FFFFFF;
            border-radius: 10rpx;

            .title {
              display: flex;
              align-items: center;
              gap: 20rpx;
              padding: 10rpx;

              .img {
                width: 40rpx;
                height: 40rpx;
                flex-shrink: 0;
              }

              .name {
                font-size: 24rpx;
                line-height: 34rpx;
                color: #222222;
                flex: 1;
                white-space: nowrap;
                max-width: 18vw;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .divider {
              border-top: 1px solid #eee;
            }

            .tip {
              padding: 10rpx;
              font-size: 20rpx;
              line-height: 28rpx;
              color: #FF0000;
              height: 14px;
            }

            .tip1 {
              color: #FF8A00;
            }
          }
        }
      }
    }
  }

  .run {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>
