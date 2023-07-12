<template>
  <view class="data-show" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <view slot="right" class="tip" @click="$refs.pop.open()"> ? </view>
    </NavBar>
    <view class="data-show-box">
      <view class="title">所得金额月度报表</view>
      <view class="charts-box">
        <qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
      </view>
      <view class="table-box">
        <view class="title">报表详情</view>
        <uni-table border stripe emptyText="暂无更多数据">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="left">月份</uni-th>
            <uni-th width="85" align="center">总推广数</uni-th>
            <uni-th width="85" align="center">有效用户</uni-th>
            <uni-th width="85" align="center">所得金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr>
            <uni-td>2020-10-20</uni-td>
            <uni-td align="right">0</uni-td>
            <uni-td align="right">0</uni-td>
            <uni-td align="right">0</uni-td>
          </uni-tr>
          <uni-tr>
            <uni-td>2020-10-20</uni-td>
            <uni-td align="right">0</uni-td>
            <uni-td align="right">0</uni-td>
            <uni-td align="right">0</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <uni-popup ref="pop" background-color="#fff">
        <view class="popup-content">
          <view class="popup-content-title">
            温馨提示<uni-icons style="
                font-weight: normal;
                position: absolute;
                right: 0;
                top: 2rpx;
              " type="close" color="#ccc" size="44rpx" @click="$refs.pop.close()"></uni-icons>
          </view>
          <view class="text-box">
            <view>1.报表只展示本年的数据；图表展示所有数据；</view>
            <view>2.总推广数：该平台所有填写您的邀请码的总用户数；</view>
            <view>3.有效用户：满足代言人当中的有效用户基准的用户总数；</view>
            <view>
              4.用户的所得金额为：拉新奖励+活动奖励+基础工资+拉新返佣等用户在平台所得的一切金额
            </view>
            <view>5.该报表在每个月初自动生成</view>
          </view>
        </view>
      </uni-popup>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "reports",
  components: {
    AlertInjectLayer,
    NavBar,
  },
  data() {
    return {
      title: "月度报表",
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      chartData: {},
      opts: {
        title: {
          name: "所得金额月度报表",
        },
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          data: [
            {
              min: 0,
            },
          ],
        },
        extra: {
          column: {
            type: "group",
          },
        },
      },
    };
  },
  onReady() {
    this.getServerData();
  },
  methods: {
    getServerData() {
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
          series: [
            // {
            //   name: "目标值",
            //   data: [35, 36, 31, 33, 13, 34],
            // },
            {
              name: "完成量",
              data: [18, 27, 21, 24, 6, 28],
            }
          ],
        };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ table {
  min-width: 100% !important;
}

.popup-content {
  width: 530rpx;
  padding: 40rpx;

  &-title {
    font-size: 38rpx !important;
    font-weight: 600 !important;
    text-align: center;
    padding-bottom: 30rpx;
    position: relative;
  }

  .text-box {
    color: #666;
    line-height: 44rpx;
    font-size: 28rpx;

    view {
      padding-bottom: 40rpx;
    }
  }
}

.tip {
  color: rgb(102, 102, 102);
  border-radius: 50%;
  border: 1px solid rgb(102, 102, 102);
  width: 28rpx;
  height: 28rpx;
  text-align: center;
  line-height: 28rpx;
}

.data-show {
  .data-show-box {
    background-color: #fff;
    position: relative;
    padding: 30rpx;

    &::before {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      content: " ";
      pointer-events: none;
      top: 0;
      border-top: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    .title {
      padding: 20rpx 0;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 44rpx;
    }
  }
}
</style>
