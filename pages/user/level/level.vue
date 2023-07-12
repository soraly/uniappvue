<template>
  <view class="user-level" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <view slot="right" class="right-text" @click="toMyLevel">我的成长值</view>
    </NavBar>
    <uni-popup ref="popup" type="center">
      <view class="block">
        <view class="t-b"><text>VIP特权</text></view>
        <view class="text">
          <view style="color: rgb(255, 69, 69);">1.论坛昵称变成红色</view>
          <view style="color: rgb(161, 80, 12);">2.查看专家统计</view>
          <view style="color: rgb(161, 80, 12);">3.成长值领取发翻倍奖励</view>
          <view style="color: rgb(161, 80, 12);">4.购买年度VIP服务可获得改名卡一张</view>
        </view>
        <view class="l-r-btn"><text @click="chargeVip">一月10元</text><text @click="chargeVip">一年100元</text></view>
        <view class="close"><i class="van-icon van-icon-close" style="font-size: 32px;">
            <!---->
          </i></view>
      </view>
    </uni-popup>
    <view class="level-wrap">
      <view class="top-notice clearfix">
        <text>当前等级：新手上路</text>
        <text class="czz">成长值：{{ score }}</text>
      </view>
      <view class="table-wrap">
        <view class="title">用户等级列表</view>
        <view class="table">
          <uni-table border stripe emptyText="暂无更多数据">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="105">用户等级</uni-th>
              <uni-th align="center" width="105">等级勋章</uni-th>
              <uni-th align="center" width="105">所需成长值</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr v-for="(item, index) in list" :key="index">
              <uni-td align="center">{{ item.name }}</uni-td>
              <uni-td align="center">
                <image :src="item.pictureUrl" mode="widthFix" />
              </uni-td>
              <uni-td align="center">{{ item.score }}</uni-td>
            </uni-tr>
          </uni-table>
        </view>
        <view class="how-get">
          如何获取成长值？
        </view>
        <view class="get-list">
          <view>1.用户每次分享好友，好友通过分享注册并填写邀请码，成功拉新一人可获得一级拉新奖励100点成长值，每天10次封顶；</view>
          <view>2.用户下级会员分享好友，好友通过分享注册并填写邀请码，成功拉新一人可同时获得二级拉新奖励10点成长值，每天10次封顶；</view>
          <view>3.用户每发帖一次，可获得10点成长值，每天5次封顶；</view>
          <view>4.用户每回帖一次，可获得1点成长值，每天100次封顶；</view>
          <view>5.用户每点赞一次，可获得1点成长值，每天100次封顶。</view>
          <view>6.购买VIP可使积分加倍哦，<text class="buy" @click="toBuy">去购买</text></view>
        </view>
        <view class="how-get">
          用户升级有什么好处？
        </view>
        <view class="get-list">
          <view>1.等级越高，可获得的勋章也就越多哦；</view>
          <view>2.当等级为专家以上时，就可以接受打赏了哦。</view>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { myScore, userLevelList } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "level",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "用户等级",
      score: 0,
      list: [
      ]
    }
  },
  onLoad() {
    this.getUserLevelList()
    myScore().then(res => {
      console.log(res)
      this.score = res.result.score
    })
  },
  methods: {
    //获取用户等级列表
    getUserLevelList() {
      userLevelList().then(res => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.result
        }
      })
    },
    toMyLevel() {
      uni.navigateTo({
        url: "/pages/user/level/myLevel"
      })
    },
    toBuy() {
      this.$refs.popup.open()
    },
    chargeVip() {
      this.$refs.popup.close()
      uni.showToast({
        title: "兑换成功后才能购买VIP",
        icon: "none"
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.user-level {
  .block {
    width: 580rpx;
    height: 580rpx;
    background-image: url(../../../static/img/user/vipImg.png);
    background-size: 100% 100%;
    position: relative;

    .t-b {
      position: absolute;
      right: 86rpx;
      top: 180rpx;

      text {
        width: 132rpx;
        height: 60rpx;
        background: #a1500c;
        border-radius: 30rpx;
        color: #fee2c7;
        text-align: center;
        line-height: 60rpx;
        display: inline-block;
        font-weight: 600;
      }
    }

    .text {
      position: absolute;
      font-size: 24rpx;
      top: 180rpx;
      margin-left: 106rpx;
      line-height: 44rpx;
    }

    .l-r-btn {
      position: absolute;
      bottom: 40rpx;
      width: 100%;
      text-align: center;

      text {
        width: 200rpx;
        height: 84rpx;
        background: #ffe2c6;
        border-radius: 42rpx;
        border: 0.02rem solid #979797;
        color: #a1500c;
        font-size: 32rpx;
        line-height: 84rpx;
        display: inline-block;
        margin-left: 40rpx;
      }
    }

    .close {
      text-align: center;
      font-size: 24rpx;
      color: #a9a9a9;
      position: absolute;
      bottom: -100rpx;
      left: 50%;
      margin-left: -32rpx;
    }
  }

  .right-text {
    color: #07c160;
    font-size: 28rpx;
  }

  .level-wrap {
    .top-notice {
      background: #e1e1e1;
      height: 84rpx;
      color: #333;
      font-size: 28rpx;
      line-height: 84rpx;
      padding: 0 30rpx;

      .czz {
        float: right;
      }
    }

    .table-wrap {
      background: #fff;
      text-align: center;
      padding: 24rpx 30rpx;

      .title {
        padding: 24rpx;
      }

      .table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 46rpx;

        image {
          width: 44rpx;
        }
      }

      .how-get {
        text-align: left;
        color: #333;
        font-size: 32rpx;
        margin-bottom: 18rpx;
      }

      .get-list {
        color: #666;
        font-size: 28rpx;
        line-height: 40rpx;
        text-align: left;
        margin-bottom: 30rpx;

        .buy {
          color: #07c160;
        }
      }
    }

  }


}</style>
