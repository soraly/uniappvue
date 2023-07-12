<template>
  <uni-popup ref="msg">
    <view class="pop-box">
      <view class="pop-header">
        <view class="text">查看最新消息（{{ index + 1 }}）</view>
        <!-- <view class="close-btn" @click="closePop">
          <uni-icons type="closeempty" color="#8CB2C9" size="30" style="font-size: 48rpx;"></uni-icons>
        </view> -->
      </view>
      <view class="title-box">
        <view class="title-text">
          {{ list.length > 0 ? list[index].title : '' }}
        </view>
        <view class="icon-box">
          <uni-icons type="bottom" color="#C7C7CC" size="30" style="font-size: 50rpx;"></uni-icons>
        </view>
      </view>
      <view class="time-box">
        <view class="time">{{ list.length > 0 ? list[index].dateTime : '' }}</view>
        <view class="look" @click="detail" v-if="list[index] && list[index].detailId">查看详情 》</view>
      </view>
      <swiper :current="index" :circular="true" @change="change" class="swiper">
        <swiper-item v-for="item in list">
          <scroll-view :scroll-with-animation="true" :scroll-y="true" class="swiper-slide" v-if="item.type == 1">
            <mp-html :content="item.content" />
          </scroll-view>
          <view class="swiper-slide" v-else-if="item.type == 2">
            <image :src="item.content" mode="center"></image>
          </view>
          <scroll-view :scroll-with-animation="true" :scroll-y="true" class="swiper-slide" v-else>
            <view class="task-box">
              <view class="task-item" v-for="(item, index) in item.data3">
                <image class="label" v-if="item.type == 'day'" src="/static/img/liuhe/activity/mr.png"></image>
                <image class="label" v-else-if="item.type == 'sign'" src="/static/img/liuhe/activity/qd.png"></image>
                <image class="label" v-else-if="item.type == 'single'" src="/static/img/liuhe/activity/dc.png"></image>
                <image class="label" v-else src="/static/img/liuhe/activity/mz.png"></image>
                <view class="left">
                  <view class="title">
                    {{ item.des }}
                  </view>
                  <view class="progress-box">
                    <liu-progressbar
                      :progress="item.taskSpeed > item.taskVolume ? 100 : (item.taskSpeed / item.taskVolume) * 100"
                      bgColor="#00C200" dsColor="#DDDDDD" color="#FFFFFF" fontSize="24rpx" :height="'26rpx'"
                      :borderRadius="'40rpx'" />
                  </view>
                </view>
                <view class="right">
                  <view class="btn">
                    <image v-if="item.status == 1" @click="getReceive(item)" src="/static/img/liuhe/activity/lqbtn.png">
                    </image>
                    <image v-else-if="item.status == 2" src="/static/img/liuhe/activity/ylq.png"></image>
                    <image v-else @click="goUrl(item)" src="/static/img/liuhe/activity/go-btn.png"></image>
                  </view>
                  <view class="coin">
                    <image src="/static/img/liuhe/activity/coin.png"></image>
                    <text class="coin-text">{{ item.rewardMoney }}</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
      <view class="dot-box">
        <view class="dot-item" :class="{ active: index == key }" v-for="(item, key) in list"></view>
      </view>
      <view class="btn-box">
        <view class="text" @click="updateIndex('prev')">上一条</view>
        <view class="yd-btn" @click="bindPop">已读不再提醒</view>
        <view class="text" @click="updateIndex('next')">下一条</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { pop } from "../../../utils/common/index";
import { receive, apply } from "../../../utils/activity/index";

export default {
  name: "HomePop",
  data() {
    return {
      index: 0,
      status: true,
      list: []
    }
  },
  mounted() {
    let bindPop = this.getCache('bindPop')
    if (!bindPop) {
      this.$refs.msg.open("center")
    }
    this.getPop()
  },
  methods: {
    change(event) {
      this.index = event.detail.current
    },
    updateIndex(type) {
      let index = this.index
      console.log('index', index);
      if (type === 'next') {
        index = index === this.list.length - 1 ? 0 : index += 1
      } else if (type === 'prev') {
        index = index === 0 ? this.list.length - 1 : index -= 1

      }
      this.index = index
    },
    bindPop() {
      this.setCache('bindPop', 1, 60 * 60 * 1000);
      this.$refs.msg.close()
    },
    setCache(key, value, expire = 0) {
      let obj = {
        data: value, //存储的数据
        time: Date.now() / 1000, //记录存储的时间戳
        expire: expire //记录过期时间，单位秒
      }
      uni.setStorageSync(key, JSON.stringify(obj))
    },
    closePop() {
      this.$refs.msg.close()
    },
    getCache(key) {
      let val = uni.getStorageSync(key)
      if (!val) {
        return null
      }
      val = JSON.parse(val)
      if (val.expire && Date.now() / 1000 - val.time > val.expire) {
        uni.removeStorageSync(key)
        return null
      }
      return val.data
    },
    getPop() {
      let prams = {
        position: 1,
        projectType: 2
      }
      pop(prams).then(res => {
        if (res.code == 200) {
          this.list = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getReceive(item) {
      let prams = {
        ruleId: item.ruleId,
        taskId: item.detailId
      }
      receive(prams).then(res => {
        if (res.code == 200) {
          pop("领取成功", 2000)
          this.getInfo()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goUrl(item) {
      let url = '';
      if (this.list[this.index].data3JumpType == 1) {
        url = "/pages/pay/index"
      } else if (this.list[this.index].data3JumpType == 2) {
        url = ""
      } else {
        url = "/pages/liuhe/list"
      }
      uni.navigateTo({ url: url })
    },
    detail() {
      let url = '';
      if (this.list.length > 0) {
        if (this.list[this.index].type == 1 && this.list[this.index].detailId > 0) {
          url = "/pages/liuhe/notice/detail?id=" + this.list[this.index].detailId
        } else if (this.list[this.index].type == 2) {
          url = ""
        } else if (this.list[this.index].type == 3 && this.list[this.index].detailId > 0) {
          url = "/pages/liuhe/activity/detail?id=" + this.list[this.index].detailId
        }
      }
      uni.navigateTo({ url: url })
    },
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  height: 830rpx;
  width: 500rpx;
  font-family: 'PingFang SC';
  background: #fff;
  border-radius: 10rpx;

  .pop-header {
    height: 80rpx;
    background: linear-gradient(180deg, #1794FF 0%, #1794FF 0.01%, #1794FF 21.88%, #0089FF 100%);
    border-radius: 5rpx 5rpx 0px 0px;
    position: relative;

    .text {
      font-weight: 400;
      font-size: 30rpx;
      line-height: 80rpx;
      text-align: center;
      color: #FFFFFF;
    }

    .close-btn {
      position: absolute;
      right: 16rpx;
      top: 16rpx;
    }
  }

  .title-box {
    /* 自动布局 */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    padding: 0px 25rpx 0 30rpx;
    background: #FFFFFF;
    border-bottom: 1px solid #E7E7E7;

    .title-text {
      font-style: normal;
      font-weight: 400;
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .icon-box {}
  }

  .time-box {
    box-sizing: border-box;
    /* 自动布局 */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 25rpx 0px 30rpx;
    height: 68rpx;
    background: #FFFFFF;
    border-bottom: 1px solid #E7E7E7;

    .time {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }

    .look {
      font-weight: 400;
      font-size: 24rpx;
      color: #1794FF;
    }
  }

  .swiper {
    height: 384rpx;
    padding: 0rpx 30rpx 0px 20rpx;

    .swiper-slide {
      height: 384rpx;
      padding-right: 10rpx;

      image {
        height: 364rpx;
        width: 590rpx;
      }

      .task-box {
        .task-item {
          margin-top: 10rpx;
          padding: 20rpx;
          background: #FFFFFF;
          border: 1px solid #DDDDDD;
          border-radius: 10px;
          display: flex;
          align-items: center;
          position: relative;

          .label {
            position: absolute;
            top: 0;
            left: 0;
            height: 20rpx;
            width: 44rpx;
          }

          .left {
            width: 100%;

            .title {
              font-weight: 300;
              font-size: 24rpx;
              color: #000000;
            }

            .progress-box {
              margin-top: 12rpx;
            }
          }

          .right {
            .btn {
              display: flex;
              justify-content: center;

              image {
                height: 39rpx;
                width: 109rpx;
              }
            }

            .coin {
              margin-top: 6rpx;
              display: flex;
              justify-content: center;
              align-items: center;

              image {
                height: 24rpx;
                width: 24rpx;
              }

              .coin-text {
                margin-left: 10rpx;
                font-weight: 400;
                font-size: 20rpx;
                color: #FE9D2A;
              }
            }
          }
        }
      }
    }
  }

  .dot-box {
    height: 68rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #E7E7E7;

    .dot-item {
      margin-left: 10rpx;
      height: 10rpx;
      width: 10rpx;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
    }

    .active {
      background: #3881A8;
    }
  }

  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30rpx;
    height: 130rpx;
    background: #FFFFFF;
    border-top: 1px solid #E7E7E7;

    .text {
      color: #1794FF;
      font-size: 24rpx;
    }

    .yd-btn {
      width: 200rpx;
      height: 70rpx;
      border-radius: 10rpx;
      background: #1794FF;
      color: #FFFFFF;
      font-weight: 500;
      font-size: 24rpx;
      display: grid;
      place-content: center;
    }
  }
}
</style>