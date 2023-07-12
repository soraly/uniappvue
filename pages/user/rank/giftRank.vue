<template>
  <view class="top-rank" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="top-head">
      <view class="top-hd">
        <view class="top-2">
          <view class="user-img-top top2">
            <image
              src="https://img.sycccf.com:4949/unite49files/user/2021/12/01/1376523/1638360542399-20211201200902-1610491737.png"
              class="user-img" />
            <image mode="widthFix" src="https://49156.com/img/top2.645397b7.png" class="user-img-xs" />
          </view>
          <view class="name">东方神起</view>
          <view class="ms">
            66531粉丝
          </view>
        </view>
        <view class="top-1">
          <view class="user-img-top top1">
            <image
              src="https://img.sycccf.com:4949/unite49files/user-small/2020/08/17/41924/1597651482014-20200817160442-947497278.jpg"
              class="user-img" />
            <image mode="widthFix" src="https://49156.com/img/top1.1b533e43.png" class="user-img-xs" />
          </view>
          <view class="name">墨羽尘曦</view>
          <view class="ms">
            78992粉丝
          </view>
        </view>
        <view class="top-3">
          <view class="user-img-top top3">
            <image src="https://img.sycccf.com:4949/unite49files/user/2022/08/18/1333445/20220818234143-1094191866.png"
              class="user-img" />
            <image mode="widthFix" src="https://49156.com/img/top3.c9683bbc.png" class="user-img-xs" />
          </view>
          <view class="name">浅月流歌</view>
          <view class="ms">
            61992粉丝
          </view>
        </view>
      </view>
      <view class="my-top">
        <uni-row class="top-item">
          <uni-col :span="18" class="czz">
            <view class="user-top">
              <image :src="userInfo.headImgUrl" class="user-img" />
              <view class="user-text">
                <view class="name">我</view>
                <view class="pm">暂无排名</view>
              </view>
            </view>
          </uni-col>
          <uni-col :span="6" class="leve-n">
            0粉丝
          </uni-col>
        </uni-row>
      </view>
    </view>
    <view class="rank-body-list">
      <view class="rank-list" v-if="rankList.length > 0">
        <view class="rank-list-item" v-for="(item, index) in rankList">
          <uni-row>
            <uni-col :span="3">
              <view class="num">{{ item.num }}</view>
            </uni-col>
            <uni-col :span="15">
              <view class="czz">
                <view class="user-top">
                  <image :src="item.img || detailLogo" class="userImg" />
                  <view class="user-text">
                    <view class="name p-top">{{ item.name }}</view>
                  </view>
                </view>
              </view>
            </uni-col>
            <uni-col :span="6">
              <view class="leve-n">
                61128粉丝
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
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "giftRank",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "礼物排行榜排行榜",
      headerStyle: {
        backgroundColor: "#ef4343"
      },
      fontColor: "#ffffff",
      titleStyle: {
        color: "#ffffff"
      },
      userInfo: {},
      detailLogo: '/static/img/user/Frame21.png',
      rankList: [
        {
          num: 4,
          img: "https://img.sycccf.com:4949/unite49files/user-small/2021/04/24/1409553/1619245006485-20210424141646-1619245007406917.jpg",
          name: "流星划过了永恒"
        },
        {
          num: 5,
          img: "https://img.sycccf.com:4949/unite49files/user-small/2020/12/27/1429024/1609045587265-20201227130627-645992966.jpg",
          name: "诸葛村夫"
        },
        {
          num: 6,
          img: "",
          name: "frank"
        },
        {
          num: 7,
          img: "",
          name: "迪丽热巴"
        },
        {
          num: 8,
          img: "",
          name: "墨羽尘曦"
        }, {
          num: 9,
          img: "",
          name: "白爷神算"
        },
        {
          num: 10,
          img: "",
          name: "国妓总奸"
        }
      ]
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync("userInfo")
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 24) {
          this.detailLogo = item.url
          throw Error();
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-rank {
  min-height: var(--vh);
  background: linear-gradient(1turn, #f65d7e, #ef4343);
  ;
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

