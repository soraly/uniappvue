<template>
  <view class="history-draws" :style="{ paddingTop: statusBarH }">
    <nav-bar :title="title" :fontColor="'#FFFFFF'" :titleStyle="titleStyle" :header-style="headerStyle">
    </nav-bar>
    <uni-list class="list-row">
      <uni-list-item class="list-rol" direction="column" v-for="(item, index) in dataList">
        <!-- 自定义 header -->
        <template v-slot:header>
          <view class="slot-box">
            <uni-row class="header-row">
              <uni-col class="header-col" :span="14">
                <span class="period">第{{ item.lotteryNo }}期</span>
              </uni-col>
              <uni-col class="header-col time-box" :span="10">
                <span class="time">{{ item.lotteryTime }}</span>
              </uni-col>
            </uni-row>
          </view>
        </template>
        <!-- 自定义 body -->
        <template v-slot:body>
          <view class="draws">
            <draws :lotteryDetail="item.numberList"></draws>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="btn-box">
      <view class="btn-item">
        <view class="btn" @click="back()">投注{{ title }}</view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Draws from "../../components/common/lottery/Draws";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { getHistoryList } from "../../utils/lottery/betting";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "recent_draws",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Draws
  },
  data() {
    return {
      title: uni.getStorageSync('lotteryNameTitle').title,
      statusBarH: uni.getStorageSync("systemInfo").safeArea.top + "px",
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        color: '#FFFFFF',
        fontSize: '34rpx',
      },
      dataList: [],
      lotteryId: 69,
      pageSize: 120,
    }
  },
  onLoad(option) {
    this.lotteryId = option.id
    this.lists()
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    lists() {
      let prams = { 'pageSize': this.pageSize };
      if (this.lotteryId > 0) {
        prams.lotteryId = this.lotteryId
      }
      getHistoryList(prams).then(res => {
        if (res.code == 200) {
          this.dataList = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.history-draws {
  font-family: 'PingFang SC';

  .list-row {
    .list-rol {
      .slot-box {
        .header-row {
          .header-col {
            font-weight: 400;
            font-size: 24rpx;
            line-height: 34rpx;

            .period {
              color: #333333;
            }

            .time {
              color: #B8B8B8;
            }
          }

          .time-box {
            display: flex;
            justify-content: flex-end;
          }
        }
      }

      .draws {
        margin: 22rpx 0;
      }
    }
  }

  .btn-box {
    height: 82rpx;

    .btn-item {
      width: 100%;
      max-width: 480px;
      height: 82rpx;
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0px -2rpx 10rpx rgba(0, 0, 0, 0.25));
      background: #FFFFFF;

      .btn {
        //width: 244rpx;
        height: 62rpx;
        background: #1794FF;
        border-radius: 58rpx;
        font-weight: 500;
        font-size: 30rpx;
        text-align: center;
        color: #DDF2FB;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10rpx 47rpx;
        box-sizing: border-box;
      }
    }
  }
}
</style>
