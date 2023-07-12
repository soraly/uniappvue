<template>
  <view class="history-draws" :style="{ paddingTop: statusBarH }">
    <nav-bar
      :title="title"
      :fontColor="'#FFFFFF'"
      :titleStyle="titleStyle"
      :header-style="headerStyle"
    >
    </nav-bar>
    <uni-list class="list-row">
      <uni-list-item
        class="list-rol"
        direction="column"
        v-for="(item, index) in dataList"
      >
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
            <view
              :key="index"
              class="draw-item-wrap"
              v-for="(ball, index) in setBalls(item.lotteryResult)"
            >
              <view class="draw-item">
                {{ ball }}
              </view>
              <view class="number-symbol">
                  <image v-if="index !== 2" src="./../../../static/img/liuhe/pcEgg/add.png"></image>
                  <image v-else src="./../../../static/img/liuhe/pcEgg/equal.png"></image>
                </view>
            </view>
            <view class="draw-item">
                {{setResultBalls(item.resultDetail)[0]}}
              </view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="btn-box">
      <view class="btn-item">
        <view class="btn" @click="back()">投注{{ title }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { getHistoryList } from "../../../utils/lottery/betting";

export default {
  name: "recent_draws",
  components: { NavBar },
  data() {
    return {
      title: uni.getStorageSync("lotteryNameTitle").title,
      statusBarH: uni.getStorageSync("systemInfo").safeArea.top + "px",
      headerStyle: {
        backgroundColor: "#1794FF",
      },
      titleStyle: {
        color: "#FFFFFF",
        fontSize: "34rpx",
      },
      dataList: [],
      lotteryId: 69,
      pageSize: 120,
    };
  },
  onLoad(option) {
    this.lotteryId = option.id;
    this.lists();
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    setBalls(str) {
      return str.split(",");
    },
    setResultBalls(str) {
      return str && str.split(" ") || "";
    },
    lists() {
      let prams = { pageSize: this.pageSize };
      if (this.lotteryId > 0) {
        prams.lotteryId = this.lotteryId;
      }
      getHistoryList(prams)
        .then((res) => {
          if (res.code == 200) {
            this.dataList = res.result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.history-draws {
  font-family: "PingFang SC";

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
              color: #b8b8b8;
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
        display: flex;
        .draw-item-wrap {
           display: flex;
            align-items: center;
            justify-content: center;
            .number-symbol {
                margin-top: 10rpx;
                image {
                  width: 35rpx;
                  height: 35rpx;
                }
              }
        }
        .draw-item-wrap:first-of-type {
              .draw-item {
                margin-left: 0;
              }
            }
        .draw-item {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          background-color: #d3556a;
          text-align: center;
          line-height: 70rpx;
          color: #ebfdff;
          font-size: 42rpx;
          margin-right: 10rpx;
          margin-left: 10rpx;
        }
      }

      .result-detail {
        font-size: 22rpx;
        line-height: 31rpx;
        color: #222222;
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
      background: #ffffff;

      .btn {
        //width: 244rpx;
        height: 62rpx;
        background: #086989;
        border-radius: 58rpx;
        font-weight: 500;
        font-size: 30rpx;
        text-align: center;
        color: #ddf2fb;
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
