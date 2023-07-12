<template>
  <view id="tab-bar" :style="{ paddingBottom: safeArea }">
    <view class="tab-item" v-for="(item, key) in bar" @click="itemClick(item.path)">
      <view class="item-box" :class="{ 'item-center': key === 2 }">
        <view class="img-box" :class="{ center: key === 2, 'center-bg': key === 2 && current == key }">
          <image class="img" :lazy-load="true" :src="current == key ? item.url : item.img"></image>
        </view>
        <view class="item-text" :class="{ 'item-text-color': key == current }">
          {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "TabBar",
  props: {
    current: String
  },
  data() {
    return {
      safeArea: uni.getStorageSync('systemInfo').safeAreaInsets.bottom + "px",
      bar: [
        {
          id: 1,
          img: "/static/img/tabbar/bar1.png",
          url: "/static/img/tabbar/bar1_1.png",
          text: "六合论坛",
          path: '/pages/home/index/Index'
        },
        {
          id: 2,
          img: "/static/img/tabbar/bar2.png",
          url: "/static/img/tabbar/bar2_1.png",
          text: '淘料',
          path: '/pages/market/index',
        },
        {
          id: 3,
          img: "/static/img/tabbar/bar3.png",
          url: "/static/img/tabbar/bar3.png",
          text: '购彩大厅',
          path: '/pages/liuhe/index',
        },
        {
          id: 4,
          img: "/static/img/tabbar/bar4.png",
          url: "/static/img/tabbar/bar4_1.png",
          text: '发现',
          path: '/pages/find/index'
        },
        {
          id: 5,
          img: "/static/img/tabbar/bar5.png",
          url: "/static/img/tabbar/bar5_1.png",
          text: "我的",
          path: '/pages/user/index'
        },
      ]
    }
  },
  computed: {

  },

  methods: {
    isActive(index) {
      let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
      let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
      return this.bar[index].path.indexOf(curRoute) !== -1
    },
    itemClick(path) {
      console.log(path)
      if (path == '') {
        pop('敬请期待', 2000)
        return false
      }
      uni.switchTab({
        url: path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#tab-bar {
  z-index: 12;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  width: 100%;
  height: 50px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  position: fixed;
  bottom: -1px;
  max-width: 480px;
  width: 100%;
  background: url('/static/img/tabbar/bar-bg.png');
  background-size: 100% 100%;

  .tab-item {
    height: 100%;
    color: #646566;
    cursor: pointer;
    display: grid;
    place-content: center;
    position: relative;

    .item-box {
      display: flex;
      flex-direction: column;
      gap: 6rpx;
      justify-content: space-around;
      height: 100%;
    }

    .item-center {
      z-index: 1;
      color: #646566;
      display: flex;
      align-items: center;
      flex-direction: column;
      /*gap: 6px;*/
      position: absolute;
      bottom: 0;
      width: 100%;
      height: fit-content;
    }

    .item-text {
      font-family: MiSans;
      font-size: 12rpx;
      font-style: normal;
    }

    .item-text-color {
      color: #2BCB65;
    }

    .img-box {
      display: grid;
      place-content: center;

      .img {
        width: 24px;
        height: 24px;
      }
    }

    .center {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 44px;
      background: rgba(160, 171, 165, 1);
      margin-bottom: 6rpx;
    }

    .center-bg {
      background: #07C160;
    }
  }
}
</style>
