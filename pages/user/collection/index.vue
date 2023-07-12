<template>
  <view class="collection-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="我的收藏" is-back></nav-bar>
    <view class="collection-box-body">
      <view class="type">
        <view v-for="(item, index) in typeArr" :key="index"
          :class="item.name === activeType.name ? 'type-item-active' : ''" class="type-item" @click="handleType(item)">
          <text v-if="!item.url">{{ item.label }}</text>
          <img v-else :src="item.name === activeType.name ? item.active : item.url" alt="" />
        </view>
      </view>
      <view class="search">
        <uni-search-bar v-model="formData.title" :placeholder="searchTitle" placeholder-style="color: #c9c9cb;"
          bgColor="#FFFFFF" cancelButton="always" cancelText="搜索" @confirm="search" @cancel="search" @clear="clear">
        </uni-search-bar>
      </view>
      <view class="tab">
        <view v-for="(item, index) in tabArr" :key="index" :class="item.name === activeTab.name ? 'tab-item-active' : ''"
          class="tab-item" @click="handleTab(item)">
          {{ item.label }}
        </view>
      </view>
      <view class="list">
        <template v-if="this.list.length > 0">
          <view v-for="(item, index) in list" :key="index" class="list-item" @click="pictureDetail(item)">
            <view class="left">
              <view class="img">
                <image style="width: 178rpx; height: 124rpx;" :src="item.pictureUrl" />
              </view>
              <view class="label">{{ item.pictureName }}</view>
            </view>
            <view class="right">
              <view :class="getClass(item.lotteryType)">
                <image style="width: 30rpx; height: 30rpx; border-radius: 50%" :src="getTypeIcon(item.lotteryType)">
                </image>
                {{ getLotteryType(item.lotteryType) }}
              </view>
              <view class="icon">
                <uni-icons type="forward" size="32rpx"></uni-icons>
              </view>
            </view>
          </view>
        </template>
        <empty v-else> </empty>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import empty from "@/components/common/empty/empty.vue";
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
import NavBar from '@/components/common/navBar/navBar.vue';
import { myCollection } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer, UniIcons, empty, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      searchValue: "",
      over: false,
      formData: {
        pageNum: 1,
        lotteryType: "",
        title: "",
        type: 1
      },
      typeArr: [
        {
          label: "全部",
          name: "",
        },
        {
          label: "澳彩",
          name: "2",
        },
        {
          label: "港彩",
          name: "1",
        },
        {
          label: "台彩",
          name: "3",
        },
        {
          label: "新彩",
          name: "4",
        },
        // {
        //   label: "世界杯",
        //   name: "zc",
        //   url: "/static/img/user/collection/collection-zq.gif",
        //   active: "/static/img/user/collection/collection-zq2.gif",
        // },
      ],
      tabArr: [
        {
          label: "六合图库",
          name: "lh",
        },
        {
          label: "幽默猜测",
          name: "ym",
        },
      ],
      activeTab: {
        label: "六合图库",
        name: "lh",
      },
      activeType: {
        label: "全部",
        name: "",
      },
      list: [],
    };
  },
  computed: {
    searchTitle() {
      return `查找${this.activeType.label}收藏的帖子`;
    },
  },
  onLoad(option) {
    this.getList();
  },
  onReachBottom() {
    if (this.over === false) {
      this.formData.pageNum++
      this.getList()
    } else {
      return
    }
  },
  methods: {
    getLotteryType(type) {
      switch (type) {
        case 1:
          return "香港"
        case 2:
          return "澳门"
        case 3:
          return "台湾"
        case 4:
          return "新加坡"
      }
    },
    getTypeIcon(type) {
      switch (type) {
        case 1:
          return "/static/img/menu/act-2.png"
        case 2:
          return "/static/img/menu/act-1.png"
        case 3:
          return "/static/img/menu/act-3.png"
        case 4:
          return "/static/img/menu/act-4.png"
      }
    },
    getClass(type) {
      switch (type) {
        case 1:
          return "tag hk"
        case 2:
          return "tag mo"
        case 3:
          return "tag tw"
        case 4:
          return "tag sn"
      }
    },
    back() {
      uni.navigateBack();
    },
    search() {
      this.list = []
      this.formData.pageNum = 1
      this.getList()
    },
    getList() {
      myCollection(this.formData).then(res => {
        if (res.code === 200) {
          this.list = this.list.concat(res.result.records)
          if (res.result.records.length < 10) {
            this.over = true
          }
        }
      })
    },
    //图库详情
    pictureDetail(item) {
      uni.setStorageSync('lotteryType', item.lotteryType);
      if (item.type == 1) {
        let url = "/pages/picture/detail?id=" + item.pictureId
        uni.navigateTo({
          url: url,
        })
      } else {
        let url = '/pages/vote/index?id=' + item.pictureId
        uni.navigateTo({
          url: url,
        })
      }

    },
    // 类型点击事件
    handleType(item) {
      this.activeType = item;
      console.log("type", item);
      this.list = []
      this.formData.lotteryType = item.name
      this.formData.pageNum = 1
      this.getList();
    },
    // 选项卡切换事件
    handleTab(item) {
      this.activeTab = item;
      if (this.activeTab.name == "lh") {
        this.over = false;
        this.list = [];
        this.formData.pageNum = 1;
        this.formData.type = 1;
        this.getList()
      }
      else if (this.activeTab.name == "ym") {
        this.over = false;
        this.list = [];
        this.formData.pageNum = 1;
        this.formData.type = 8;
        this.getList()
      } else {
        this.list = []
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx;
  padding: 20rpx 32rpx;
  background-color: #fff;
  font-size: 28rpx;
  color: #323233;
  position: relative;

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    transform: scaleY(.5);
  }

  &>.left {
    display: flex;
    align-items: center;
    gap: 0 20rpx;

  }

  &>.right {
    display: flex;
    align-items: center;
    gap: 0 20rpx;

    &>.tag {
      padding: 0 10rpx;
      height: 44rpx;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #fff;
      display: flex;
      align-items: center;
    }

    .tag.mo {
      background-color: #07c160;
    }

    .tag.tw {
      background-color: #0755c1;
    }

    .tag.hk {
      background-color: #c10707;
    }

    .tag.sn {
      background-color: #b907c1;
    }

    &>.icon {
      color: #969799;
      display: flex;
      align-items: center;
    }
  }
}

.collection-box-body {
  background-color: #f8f8f8;
  width: 100%;
  height: calc(100% - 58px);
  position: absolute;
  display: flex;
  flex-direction: column;
  padding-top: 16rpx;

  .search {}

  &>.type {
    padding: 0 9px;
    display: flex;
    align-items: center;
    margin: 0 16px;

    .type-item-active {
      background-color: #07c160 !important;
      color: #fff !important;
    }

    .type-item {
      flex: 1;
      color: #07c160;
      font-size: 13px;
      border: 1px solid #07c160;
      text-align: center;
      line-height: 28px;
      height: 28px;
      background-color: #fff;

      &:not(:first-child) {
        border-left: none;
      }

      img {
        height: 100%;
      }
    }
  }

  &>.tab {
    background-color: #fff;
    display: flex;
    align-items: center;

    .tab-item-active {
      color: #07c160;
      font-weight: 500;
    }

    .tab-item {
      flex: 1;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      text-align: center;
    }
  }

  &>.list {
    margin-top: 5px;
    background-color: #fff;
    position: relative;
    flex: 1;
  }
}
</style>
