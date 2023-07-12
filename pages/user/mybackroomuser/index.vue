<template>
  <view class="backroom-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="我拉黑的用户" is-back></nav-bar>
    <view class="backroom-box-body">
      <view class="search">
        <uni-search-bar v-model="searchValue" placeholder="点击搜索作者或者标题..." cancelButton="always" cancelText="搜索"
          radius="50" bg-color="#fff" @confirm="search" @cancel="search" @clear="clear">
        </uni-search-bar>
      </view>
      <view class="content">
        <view class="list-box">
          <template v-if="this.list.length > 0">
            <view v-for="(item, index) in list" :key="index" class="list-item">
              <view class="top">
                <view class="img">
                  <image style="width: 100rpx; height: 100rpx; border-radius: 50%" :src="item.headPic"></image>
                </view>
                <view class="info">
                  <view class="username">{{ item.blockedUserName }}</view>
                </view>
                <view class="count">
                  <view class="menu" @click="removeBlock(item)">取消拉黑</view>
                </view>
              </view>
            </view>
          </template>
          <empty v-else> </empty>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar.vue";
import empty from "@/components/common/empty/empty.vue";
import { listUserPunish, cancelBlock } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer, NavBar, empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      list: [],
      searchValue: "",
      over: false,
      formData: {
        name: "",
        pageNum: 1
      }
    };
  },
  onLoad() {
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
    getList() {
      listUserPunish(this.formData).then(res => {
        if (res.code === 200) {
          if (res.result.records.length < 10) {
            this.over = true
          }
          this.list = this.list.concat(res.result.records)
          console.log(this.list)
        }
      })
    },
    removeBlock(item) {
      this.formData.pageNum = 1
      this.formData.name = ""
      this.list = []
      cancelBlock({
        blockedUserId: item.blockUserId
      }).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
          this.getList()
        } else {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }

      })
    },
    search(val) {
      console.log("search", val);
    },
  },
};
</script>

<style lang="scss">
.list-item {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;

  &>.top {
    display: flex;
    align-items: center;
    height: 84rpx;
    gap: 0 20rpx;

    &>.info {
      display: flex;
      height: 100%;
      align-items: center;
      font-size: 30rpx;
    }

    &>.count {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: end;

      &>.menu {
        width: 200rpx;
        height: 60rpx;
        text-align: center;
        line-height: 60rpx;
        border-radius: 30rpx;
        font-size: 30rpx;
        color: #fff;
        background: #07c160;
      }
    }
  }
}

.backroom-box-body {
  width: 100%;
  height: calc(100% - 58px);
  position: absolute;
  display: flex;
  flex-direction: column;

  &>.content {
    flex: 1;

    &>.list-box {
      display: flex;
      flex-direction: column;
      padding: 0 20rpx 20rpx 20rpx;
      gap: 20rpx 0;
    }
  }
}
</style>
