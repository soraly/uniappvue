<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :title="title">
      <block slot="right">
        <view class="uni-list-cell-db">
          <picker @change="bindTimeChange" :value="index" :range="array">
            <uni-icons custom-prefix="iconfont" type="rili" color="#07c160" size="16" style="margin-right:10px;" />
          </picker>
        </view>
      </block>
    </nav-bar>
    <!--表格部分-->
    <table>
      <tr style="line-height: 40px;">
        <th v-for="(item, index) in tableData.rows" :key="index">{{ item.label }}</th>
      </tr>
      <tr v-for="(item, index) in tableData.rols" :key="index">
        <td class="">
          <view>{{ item.yearAndTerm }}</view>
        </td>
        <td>
          <view :class="item.normal1.red == 0 || 'red'">{{ item.normal1.value }}</view>
        </td>
        <td>
          <view :class="item.normal2.red == 0 || 'red'">{{ item.normal2.value }}</view>
        </td>
        <td>
          <view :class="item.normal3.red == 0 || 'red'">{{ item.normal3.value }}</view>
        </td>
        <td>
          <view :class="item.normal4.red == 0 || 'red'">{{ item.normal4.value }}</view>
        </td>
        <td>
          <view :class="item.normal5.red == 0 || 'red'">{{ item.normal5.value }}</view>
        </td>
        <td>
          <view :class="item.normal6.red == 0 || 'red'">{{ item.normal6.value }}</view>
        </td>
        <td>
          <view :class="item.special.red == 0 || 'red'">{{ item.special.value }}</view>
        </td>
      </tr>
    </table>
    <!--底部-->
    <view class="footer">
      <count-fab :lotterytype="lotteryType"></count-fab>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import CountFab from "../../components/common/fab/CountFab"
import { consecutiveStat } from "../../utils/zxcount";
import { listYear } from '../../utils/live/index'
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "lmzs",
  components: {
    AlertInjectLayer, CountFab, NavBar
  },
  data() {
    const date = new Date();
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '连码走势图',
      lotteryType: 1,
      type: 1,
      years: '',
      index: 0,
      array: [],
      startDate: (date.getFullYear() - 4) + '',
      endDate: (date.getFullYear()) + '',
      tableData: [],
    }
  },
  onLoad(option) {
    console.log(option)
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    eventChannel.on('argParams', function (data) {
      console.log(data)
      this.lotteryType = data.lotteryType
    })
    this.lotteryType = uni.getStorageSync('lotteryType')
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.listYear()
    this.consecutiveStat()
  },
  methods: {
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //时间选择
    bindTimeChange: function (e) {
      this.years = this.array[e.detail.value]
      this.consecutiveStat()
    },
    listYear() {
      let prams = { lotteryType: this.lotteryType }
      listYear(prams).then(res => {
        this.array = res.result
        this.years = this.array[this.index]
      }).catch(err => {
        console.log(err)
      })
    },
    consecutiveStat: function () {
      let prams = { year: this.years, type: this.type };
      consecutiveStat(prams).then(res => {
        this.tableData = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.header-box,
.header,
.box-bg {
  height: 46px;
}

.input-view {
  font-size: 16px;
}

.uni-subtitle {
  font-size: 14px;
}

.footer {
  height: 80px;
}

.curyear {
  width: 50px;
  height: 35px;
  line-height: 35px;
  color: #03bf03;
  margin-right: 5px;
}

table {
  width: 100%;
  background: #fff;
  margin-top: 12rpx;
  border-collapse: collapse;
  text-align: center;
}

table th {
  font-weight: 400;
  color: #333;
  font-size: 24rpx;
}

table tr:nth-of-type(2n) {
  background: #f8f8f8;
}

table tr {
  line-height: 56rpx;
}

table tr td {
  font-size: 28rpx;
  border: 1px solid #e1e1e1;
}

table td>uni-view.red {
  width: 44rpx;
  height: 44rpx;
  color: #fff;
  background: red;
  border-radius: 50%;
  text-align: center;
  line-height: 44rpx;
  margin: 0 auto;
}
</style>