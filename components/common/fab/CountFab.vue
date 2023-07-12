<template>
  <footer class="mint-tabbar is-fixed">
    <view class="mint-tab-item" v-for="(item, index) in menus[0]" :key="index" @click="tiaozhuan(item)">
      <view :class="!isActive(item.path) || 'router-link-exact-active router-link-active'" aria-current="page">
        <span class="mint-tab-item-icon">
          <span>{{ item.desc }}</span>
        </span>
        <span class="mint-tab-item-label">{{ item.text }}</span>
      </view>
    </view>

    <view class="mint-tab-item" @click="show = !show">
      <view>
        <span class="mint-tab-item-icon">
          <span>···</span>
        </span>
        <span class="mint-tab-item-label">更多</span>
      </view>
    </view>
    <view id="footer-confirm" class="confirm" v-show="show" @click="show = false">
      <view class="footer-confirm">
        <view class="mint-tabbar" v-for="(item, index) in menus" :key="index">
          <view class="mint-tab-item" v-for="(val, key) in item" :key="key" @click="tiaozhuan(val)">
            <view :class="!isActive(val.path) || 'router-link-exact-active router-link-active'" aria-current="page">
              <span class="mint-tab-item-icon">
                <image :src="val.icon"></image>
              </span>
              <span class="mint-tab-item-label">{{ val.text }}</span>
            </view>
          </view>
        </view>
        <view class="out"></view>
        <view class="in"></view>
      </view>
    </view>
  </footer>
</template>

<script>
export default {
  name: "CountFab",
  props: {
    lotterytype: {
      type: Number,
    }
  },
  data() {
    return {
      show: false,
      menus: [
        [
          {
            text: '六合统计',
            path: 'liuhe',
            desc: '统',
            prams: "",
            icon: "/static/img/tabbar/count/liuhe.png"
          },
          {
            text: '属性参照',
            path: 'sxcc',
            prams: "",
            desc: '属',
            icon: "/static/img/tabbar/count/shuxing.png"
          },
          {
            text: '特码历史',
            path: 'tmls',
            prams: 'type=2',
            desc: '特',
            icon: "/static/img/tabbar/count/tema.png"
          },
          {
            text: '正码历史',
            path: 'zmls',
            prams: "type=1",
            desc: '正',
            icon: "/static/img/tabbar/count/zhengma.png"
          },
        ],
        [
          {
            text: '尾数大小',
            path: 'wsdx',
            prams: "",
            desc: '尾',
            icon: "/static/img/tabbar/count/wei.png"
          },
          {
            text: '生肖特码',
            path: 'sxtm',
            prams: "",
            desc: '生',
            icon: "/static/img/tabbar/count/shengxiao.png"
          },
          {
            text: '生肖正码',
            path: 'sxzm',
            prams: "",
            desc: '肖',
            icon: "/static/img/tabbar/count/xiao.png"
          },
          {
            text: '波色特码',
            path: 'bstm',
            prams: "",
            desc: '波',
            icon: "/static/img/tabbar/count/se.png"
          },
        ],
        [
          {
            text: '波色正码',
            path: 'bszm',
            prams: "",
            desc: '波',
            icon: "/static/img/tabbar/count/bo.png"
          },
          {
            text: '特码两面',
            path: 'tmlm',
            prams: "",
            desc: '特',
            icon: "/static/img/tabbar/count/yu.png"
          },
          {
            text: '特码尾数',
            path: 'tmws',
            prams: "",
            desc: '尾',
            icon: "/static/img/tabbar/count/wei.png"
          },
          {
            text: '正码尾数',
            path: 'zmws',
            prams: "",
            desc: '数',
            icon: "/static/img/tabbar/count/shu.png"
          },
        ],
        [
          {
            text: '正码总分',
            path: 'zmzf',
            prams: "",
            desc: '分',
            icon: "/static/img/tabbar/count/fen.png"
          },
          {
            text: '号码波段',
            path: 'hmbd',
            prams: "",
            desc: '段',
            icon: "/static/img/tabbar/count/duan.png"
          },
          {
            text: '家禽野兽',
            path: 'jqys',
            prams: "",
            desc: '禽',
            icon: "/static/img/tabbar/count/qin.png"
          },
          {
            text: '连码走势',
            path: 'lmzs',
            prams: "",
            desc: '码',
            icon: "/static/img/tabbar/count/ma.png"
          },
        ],
        [
          {
            text: '连肖走势',
            path: 'lxzs',
            prams: "",
            desc: '连',
            icon: "/static/img/tabbar/count/lian.png"
          },
        ],
      ]
    }
  },
  methods: {
    //匹配路由
    isActive(path) {
      let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
      let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
      return curRoute.indexOf(path) !== -1
    },
    //跳转方法
    tiaozhuan: function (item) {
      console.log(item)
      let url = item.path + "?" + item.prams
      var lotterytype = this.lotterytype
      uni.redirectTo({
        url: url
      })
    },
  }
}
</script>

<style scoped>
.mint-tabbar.is-fixed {
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 1;
  max-width: 480px;
  margin: auto;
}

.mint-tabbar .mint-tab-item {
  padding: 0;
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.mint-tabbar {
  background-image: -webkit-linear-gradient(top, #fff, #fff 50%, transparent 0);
  background-image: linear-gradient(180deg, #fff, #fff 50%, transparent 0);
  background-size: 100% 12px;
  background-repeat: no-repeat;
  background-position: 0 0;
  position: relative;
  background-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  right: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  text-align: center;
  box-shadow: 0 5px 2px 0 hsl(0deg 0% 82% / 50%);
}

.mint-tabbar .mint-tab-item .router-link-active {
  background: #efefef;
}

.mint-tabbar .mint-tab-item uni-view {
  text-decoration: none;
  display: block;
  padding: 12px 0;
}

.mint-tabbar .mint-tab-item-icon {
  display: block;
  width: 62rpx;
  height: 62rpx;
  border-radius: 50%;
  background: #07c160;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  line-height: 62rpx;
  margin: auto auto 6rpx auto;
}

.mint-tab-item-icon>* {
  display: block;
  width: 68rpx;
  height: 68rpx;
}

.mint-tab-item-label {
  color: #333;
  font-size: 24rpx;
  line-height: 1;
}

.confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
  max-width: 480px;
  margin: auto;
}

.mint-tabbar .confirm .footer-confirm {
  position: absolute;
  background: #fff;
  box-sizing: border-box;
  bottom: 166rpx;
  width: calc(100vw - 48rpx);
  left: 24rpx;
  border-radius: 8rpx;
  padding-top: 20rpx;
  max-width: calc(480px - 48rpx);
}

.mint-tabbar .confirm .footer-confirm .mint-tab-item-icon,
.mint-tabbar .confirm .footer-confirm .mint-tabbar {
  background: none;
  box-shadow: none;
  position: static;
}

.mint-tabbar .confirm .footer-confirm .mint-tab-item {
  max-width: 25%;
}

.mint-tabbar .mint-tab-item {
  padding: 0;
}

.mint-tab-item {
  display: block;
  padding: 14rpx 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-decoration: none;
}

.mint-tabbar .confirm .footer-confirm .out {
  border: 26rpx solid transparent;
  border-top-color: #fff;
  bottom: -52rpx;
  right: 40rpx;
}

.mint-tabbar .confirm .footer-confirm .in {
  border: 26rpx solid transparent;
  border-top-color: #fff;
  bottom: -52rpx;
  right: 40rpx;
}

.mint-tabbar .confirm .footer-confirm .in,
.mint-tabbar .confirm .footer-confirm .out {
  position: absolute;
  width: 0;
  height: 0;
}
</style>