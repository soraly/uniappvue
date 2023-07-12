<template>
  <view class="top-rank" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="top-head">
      <view class="top-hd">
        <view class="top-2">
          <view class="user-img-top top2">
            <image :src="rankList[1] ? rankList[1].headPic : ''" class="user-img" />
            <image @click="toHomePage(rankList[1])" mode="widthFix" src="/static/img/user/top2.png" class="user-img-xs" />
          </view>
          <view class="name">{{ rankList[1] ? rankList[1].username : '' }}</view>
          <view class="ms">
            {{ rankList[1] ? rankList[1].count : 0 }}粉丝
          </view>
        </view>
        <view class="top-1">
          <view class="user-img-top top1">
            <image :src="rankList[0] ? rankList[0].headPic : ''" class="user-img" />
            <image @click="toHomePage(rankList[0])" mode="widthFix" src="/static/img/user/top1.png" class="user-img-xs" />
          </view>
          <view class="name">{{ rankList[0] ? rankList[0].username : '' }}</view>
          <view class="ms">
            {{ rankList[0] ? rankList[0].count : 0 }}粉丝
          </view>
        </view>
        <view class="top-3">
          <view class="user-img-top top3">
            <image :src="rankList[2] ? rankList[2].headPic : ''" class="user-img" />
            <image @click="toHomePage(rankList[2])" mode="widthFix" src="/static/img/user/top3.png" class="user-img-xs" />
          </view>
          <view class="name">{{ rankList[2] ? rankList[2].username : '' }}</view>
          <view class="ms">
            {{ rankList[2] ? rankList[2].count : 0 }}粉丝
          </view>
        </view>
      </view>
      <view class="my-top">
        <uni-row class="top-item">
          <uni-col :span="18" class="czz">
            <view class="user-top">
              <image :src="userRank.headPic" class="user-img" />
              <view class="user-text">
                <view class="name">我</view>
                <view class="pm">{{ userRank.index === 0 ? "暂无排名" : userRank.index }}</view>
              </view>
            </view>
          </uni-col>
          <uni-col :span="6" class="leve-n">
            {{ userRank.count }}粉丝
          </uni-col>
        </uni-row>
      </view>
    </view>
    <view class="rank-body-list">
      <view class="rank-list" v-if="otherRankList.length > 0">
        <view class="rank-list-item" v-for="(item, index) in otherRankList" :key="index">
          <uni-row>
            <uni-col :span="3">
              <view class="num">{{ item.index }}</view>
            </uni-col>
            <uni-col :span="15">
              <view class="czz">
                <view class="user-top">
                  <image @click="toHomePage(item)" :src="item.headPic ? item.headPic : '/static/img/user/Frame21.png'"
                    class="userImg" />
                  <view class="user-text">
                    <view class="name p-top">{{ item.username }}</view>
                  </view>
                </view>
              </view>
            </uni-col>
            <uni-col :span="6">
              <view class="leve-n">
                {{ item.count }}粉丝
              </view>
            </uni-col>
          </uni-row>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>

import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { fansRankList } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "fansRank",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "粉丝排行榜",
      headerStyle: {
        backgroundColor: "#f94078"
      },
      fontColor: "#ffffff",
      titleStyle: {
        color: "#ffffff"
      },
      rankList: [],
      otherRankList: [],
      userRank: {
        count: 0,
        headPic: "",
        userName: ""
      }
    }
  },
  onReady() {
    this.getRankList()
  },
  methods: {
    toHomePage(item) {
      console.log(item)
      uni.navigateTo({
        url: '/pages/user/homepage/homepage?userId=' + item.userId
      })
    },
    //获取粉丝排行榜
    getRankList() {
      fansRankList().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.rankList = res.result.list
          let arr = [];
          res.result.list.forEach((i, k) => {
            if (k > 2) {
              arr.push(i)
            }
          })
          this.otherRankList = arr;
          this.userRank = res.result
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-rank {
  min-height: var(--vh);
  background: linear-gradient(1turn, #e336ab, #f94078);
  padding-bottom: 40rpx;

  .top-head {
    background-size: 100% 100%;
    position: relative;
    padding: 94rpx 30rpx 0;

    .top-hd {
      padding: 0 32rpx;

      .name {
        font-weight: 500;
        color: #f1f8ff;
        font-size: 32rpx;
        padding: 20rpx 0;
      }

      .ms {
        text-align: center;
        font-weight: 400;
        font-size: .24rem;
        color: #daecff;
        padding-bottom: 0.3rem;
      }

      .top-2 {
        margin-right: 16rpx;
        width: 172rpx;
        background: linear-gradient(1turn, hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .16));
        border-radius: 32rpx 32rpx 0 0;
        display: inline-block;
        text-align: center;
      }

      .top-1 {
        background: linear-gradient(1turn, hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .16));
        border-radius: 32rpx 32rpx 0 0;
        display: inline-block;
        text-align: center;
        width: 250rpx;
        margin-right: 16rpx;
      }

      .top-3 {
        background: linear-gradient(1turn, hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .16));
        border-radius: 32rpx 32rpx 0 0;
        display: inline-block;
        text-align: center;
        width: 172rpx;
      }
    }

    .my-top {
      padding: 30rpx;
      background: #fff;
      border-radius: 32rpx;

      .top-item {
        .user-top {
          height: 100rpx;
          padding-left: 120rpx;
          position: relative;

          .user-img {
            position: absolute;
            height: 100rpx;
            width: 100rpx;
            border-radius: 50%;
            left: 0;
            top: 0;
          }

          .user-text {
            padding-top: 16rpx;

            .name {
              font-weight: 400;
              font-size: 32rpx;
            }

            .pm {
              font-weight: 400;
              color: #666;
              font-size: 24rpx;
              padding-top: 10rpx;
            }
          }
        }

        .leve-n {
          line-height: 100rpx;
          color: #666;
          font-size: 24rpx;
          text-align: right;
        }
      }
    }
  }

  .rank-body-list {
    padding: 0 30rpx;
    margin-top: 30rpx;
    position: relative;

    .rank-list {
      background: #fff;
      padding: 30rpx 30rpx 0;
      border-radius: 32rpx;

      .rank-list-item {
        padding-bottom: 32rpx;

        .num {
          line-height: 100rpx;
          font-weight: 600;
          font-size: 32rpx;
        }

        .user-top {
          height: 100rpx;
          padding-left: 120rpx;
          position: relative;

          .userImg {
            position: absolute;
            height: 100rpx;
            width: 100rpx;
            border-radius: 50%;
            left: 0;
            top: 0;
          }

          .user-text {
            padding-top: 16rpx;

            .name.p-top {
              padding-top: 20rpx;
            }
          }
        }

        .leve-n {
          line-height: 100rpx;
          color: #666;
          text-align: right;
          font-size: 24rpx;
        }
      }
    }
  }
}

.user-img-top {
  position: relative;
  display: inline-block;

  .user-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .user-img-xs {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -4rpx;
  }
}

.user-img-top.top2 {
  width: 136rpx;
  height: 136rpx;
}

.user-img-top.top3 {
  width: 136rpx;
  height: 136rpx;
}

.user-img-top.top1 {
  width: 182rpx;
  height: 182rpx;
}

.user-img-top.top3 {
  width: 136rpx;
  height: 136rpx;
}

.uni-navbar__content {
  border: none;
}
</style>
