<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <table>
      <tr v-for="(item, index) in menu" :key="index">
        <td v-for="(val, key) in item" :key="key" @click="toLink(val)">
          <image :src="val.img" mode="widthFix"></image>
          <p>{{ val.name }}</p>
        </td>
      </tr>
    </table>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '工具宝箱',
      menu: [
        [{
          'name': '恋人特码',
          'img': '../../static/img/toolbox/lrtm.png',
          'url': '/pages/toolbox/lover',
        },
        {
          'name': '生肖卡牌',
          'img': '../../static/img/toolbox/sxkp.png',
          'url': '/pages/toolbox/cnzodiac',
        },
        {
          'name': '摇一摇',
          'img': '../../static/img/toolbox/yyy.png',
          'url': '/pages/toolbox/shake',
        }],
        [{
          'name': '玄机锦囊',
          'img': '../../static/img/toolbox/xjml.png',
          'url': '/pages/toolbox/silkbag',
        },
        {
          'name': '幸运摇奖',
          'img': '../../static/img/toolbox/xycj.png',
          'url': '/pages/toolbox/luck',
        },
        {
          'name': '波肖转盘',
          'img': '../../static/img/toolbox/bxzp.png',
          'url': '/pages/toolbox/turntable',
        }],
        [{
          'name': '搅珠日期',
          'img': '../../static/img/toolbox/jzrq.png',
          'url': '/pages/toolbox/date',
        },
        {
          'name': '天机测算',
          'img': '../../static/img/toolbox/tjcs.png',
          'url': '/pages/toolbox/secret',
        },
        {
          'name': '挑码助手',
          'img': '../../static/img/toolbox/tmzs.png',
          'url': '',
        }]
      ]
    }
  },
  methods: {
    toLink(item) {
      if (item.name == '挑码助手') {
        pop("开发中", 2000)
        return false
      }
      uni.navigateTo({
        url: item.url
      })
    }
  }
}
</script>

<style scoped>
table {
  margin-top: 12rpx;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  background: #fff;
  color: #333;
  font-size: 28rpx;
}

table td {
  border: 2rpx solid #e0e0e0;
  padding: 16rpx 0 32rpx 0;
}

table td image {
  display: block;
  width: 80rpx;
  margin: 0 auto;
}

table td p {
  line-height: 40rpx;
  margin-top: 10rpx;
}</style>