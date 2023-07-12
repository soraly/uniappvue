<template>
  <view class="home-div" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :content="content" :is-show-right="isShowRight" :header-style="headerStyle"
      :font-color="fontColor" :bg-color="bgColor" :title-style="titleStyle">
      <template v-slot:right>
        <uni-icons type="more-filled" size="16" color="rgb(255, 255, 255)" style="margin-right: 10rpx"
          @click="openJin"></uni-icons>
      </template>
    </NavBar>
    <view :style="'height:' + (userHeadHeight + mTabsHeight + childTabsHeight) + 'px'">
      <view class="header-row">
        <view class="user-head">
          <view class="user-info-warp">
            <uni-row>
              <uni-col :span="4.5">
                <view class="user-avatar">
                  <image :src="userInfo.headImgUrl" />
                </view>
              </uni-col>
              <uni-col :span="19">
                <view class="user-user-name">
                  <text class="name">{{ userInfo.nickname }}</text>
                </view>
                <view class="tool" v-if="userId">
                  <image src='../../../static/img/forum/shang.png' style="width: 64rpx;height: 64rpx;"></image>
                  <view class="m-follow" @click="concern()">
                    <text class="add-follow">{{ userInfo.concern == 0 ? '关注' : '已关注' }}</text>
                  </view>
                </view>
                <view class="medal-list">
                  <image v-for="(item, index) in userInfo.medalList" class="medal-img" :src='item.filePath'
                    style="width: 40rpx;height: 40rpx;"></image>
                </view>
              </uni-col>
            </uni-row>
          </view>
          <view class="info-account">
            <uni-row>
              <uni-col :span="6">
                <view class="info-item" @click="toUrl('/pages/user/fans/index')">
                  <view class="info-text num">{{ userInfo.fansCount | moneyFormat }}</view>
                  <view class="info-text">粉丝</view>
                </view>
              </uni-col>
              <uni-col :span="6">
                <view class="info-item" @click="toUrl('/pages/user/mycare/index')">
                  <view class="info-text num">{{ userInfo.concernCount | moneyFormat }}</view>
                  <view class="info-text">关注</view>
                </view>
              </uni-col>
              <uni-col :span="6">
                <view class="info-item">
                  <view class="info-text num">{{ userInfo.publishCount | moneyFormat }}</view>
                  <view class="info-text">发布</view>
                </view>
              </uni-col>
              <uni-col :span="6">
                <view class="info-item">
                  <view class="info-text num">{{ userInfo.thumbUpCount | moneyFormat }}</view>
                  <view class="info-text">获赞</view>
                </view>
              </uni-col>
            </uni-row>
          </view>
        </view>
        <view class="tab-content">
          <view class="m-tabs">
            <view :class="type === item.type ? 'm-tabs-item act' : 'm-tabs-item'" v-for="(item, index) in tabItems"
              :key="index" @click="onClickItem(item)">{{ item.name }}</view>
          </view>
          <view class="child-tabs">
            <view class="type">
              <view v-for="(item, index) in typeArr" :key="index"
                :class="item.lotteryType === activeType.lotteryType ? 'type-item-active' : ''" class="type-item"
                @click="handleType(item)">
                <text>{{ item.name }}</text>
              </view>
            </view>
            <view class="search">
              <uni-search-bar v-model="searchValue" :placeholder="searchTitle" bgColor="#fff" cancelButton="always"
                cancelText="搜索" @confirm="search" @cancel="search" @clear="clear">
              </uni-search-bar>
            </view>
          </view>
        </view>
      </view>
    </view>
    <z-paging class="paging"
      :style="'background: #f8f8f8;height:calc(var(--vh) - 56px - ' + safeHeight + ' - ' + (userHeadHeight + mTabsHeight + childTabsHeight) + 'px)'"
      ref="paging" v-model="dataList" @query="listLatest" :refresher-enabled="false" :hide-empty-view="false"
      :empty-view-center="true" :empty-view-text="'暂无数据'" :empty-view-img="'/static/img/wu.png'" :fixed="false"
      :empty-view-style="{ 'margin-top': '75px' }" :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <view class="list-bd">
        <tu-jie :user-id="userId" :dataList="dataList" v-if="type == 12 || type == 5"></tu-jie>
        <forum :user-id="userId" :dataList="dataList" v-else></forum>
      </view>
    </z-paging>
    <!--弹窗-->
    <view class="jin-box">
      <uni-popup ref="jinPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="true">
        <view class="van-action-sheet__content">
          <button type="primary" class="action-button" @click="fenxiang()">分享</button>
          <button type="primary" class="action-button red" v-show="userInfo.userBlock == 0 && userId"
            @click="block">拉黑</button>
          <button type="primary" class="action-button red" v-show="userInfo.userBlock == 1 && userId"
            @click="cancelBlock">取消拉黑</button>
        </view>
        <view class="van-action-sheet__gap"></view>
        <button type="primary" class="action-button" @click="closeJin">取消</button>
      </uni-popup>
    </view>
    <!-- 分享 -->
    <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
      <share @closefx="closefx"></share>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import Forum from "../../../components/common/list/forum";
import TuJie from "../../../components/common/list/tujie";
import Login from "../../../components/common/login/Login";
import Share from "../../../components/common/share/Share";
import { userPublish } from '../../../utils/forum/index.js'
import { info, concern, block, cancelBlock } from '../../../utils/user/index.js'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "homepage",
  components: {
    AlertInjectLayer,
    NavBar,
    Forum,
    TuJie,
    Login,
    Share,
  },
  computed: {
    searchTitle() {
      return this.activeType.label;
    },
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "用户主页",
      content: "...",
      isShowRight: true,
      userId: '',
      userInfo: {
        id: '',
        headImgUrl: "",
        userName: "",
      },
      headerStyle: {
        backgroundColor: "#07c160"
      },
      titleStyle: {
        color: "#FFFFFF"
      },
      fontColor: "#FFFFFF",
      bgColor: "#07c160",
      tabItems: [
        { type: 3, name: '高手论坛' },
        { type: 2, name: '发现' },
        { type: 4, name: '资料大全' },
        { type: 12, name: '图解小组' },
        /*{type:5,name:'竞猜小组'}*/
      ],
      type: 3,
      currentType: 0,
      searchValue: "",
      typeArr: [
        { lotteryType: 0, name: '全部' },
        { lotteryType: 2, name: '澳彩' },
        { lotteryType: 1, name: '港彩' },
        { lotteryType: 3, name: '台彩' },
        { lotteryType: 4, name: '新彩' }
      ],
      activeType: {
        label: "查找全部发布的帖子",
        lotteryType: 0,
      },
      findTypeList: [
        {
          img: "/static/img/menu/1.png",
          act: "/static/img/menu/act-1.png",
          name: "澳彩",
        },
        {
          img: "/static/img/menu/2.png",
          act: "/static/img/menu/act-2.png",
          name: "港彩",
        },
        {
          img: "/static/img/menu/3.png",
          act: "/static/img/menu/act-3.png",
          name: "台彩",
        },
        {
          img: "/static/img/menu/4.png",
          act: "/static/img/menu/act-4.png",
          name: "新彩",
        },
      ],
      userHeadHeight: 0,
      mTabsHeight: 0,
      childTabsHeight: 0,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dataList: [],
    }
  },
  onLoad(option) {
    this.userId = option.userId
    this.getUserInfo()
    this.$nextTick(function () {
      this.navY()
    })
  },
  methods: {
    navY: function () {
      /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
      const query = uni.createSelectorQuery();
      query.select('.user-head').boundingClientRect(data => {
        this.userHeadHeight = data.height;
      }).exec();
      query.select('.m-tabs').boundingClientRect(data => {
        this.mTabsHeight = data.height;
      }).exec();
      query.select('.child-tabs').boundingClientRect(data => {
        this.childTabsHeight = data.height;
      }).exec();
    },
    getUserInfo() {//从storage获取用户信息
      let prams = {}
      if (this.userId) {
        prams = { userId: this.userId }
      } else {
        this.userInfo = uni.getStorageSync('userInfo');
        prams = { userId: this.userInfo.id }
      }
      info(prams).then(res => {
        this.userInfo = res.result
        this.$refs.paging.reload()
      }).catch(err => {
        console.log(err)
      })
    },
    toUrl(url) {
      if (this.userId) {
        url = url + "?userId=" + this.userId
      }
      uni.navigateTo({
        url: url
      })
    },
    openJin: function () {
      this.$refs.jinPopup.open('bottom')
    },
    closeJin: function () {
      this.$refs.jinPopup.close()
    },
    //分享弹窗
    fenxiang: function () {
      this.$refs.jinPopup.close()
      this.$refs.share.open()
    },
    //关闭分享
    closefx: function () {
      this.$refs.share.close()
    },
    //第一层tab切换
    onClickItem(item) {
      this.type = item.type
      this.$refs.paging.reload()
    },
    //关注接口
    concern: function () {
      let token = uni.getStorageSync('token');
      if (!token) {
        uni.$emit('showPop', {
          refName: 'AlertMsg',
          data: {
            title: '提示',
            content: '您还没有登录账号，\n是否立即前往登录？'
          },
          confirm: () => {
            uni.navigateTo({
              url: "/pages/liuhe/login"
            })
          },
        })
        return false
      }
      let prams = { userId: this.userInfo.id }
      concern(prams).then(res => {
        pop(res.message, 2000)
        if (res.code == 200) {
          this.userInfo.concern = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //拉黑用户
    block: function () {
      if (!isLogin()) {
        uni.$emit('showPop', {
          refName: 'AlertMsg',
          data: {
            title: '提示',
            content: '您还没有登录账号，\n是否立即前往登录？'
          },
          confirm: () => {
            uni.navigateTo({
              url: "/pages/liuhe/login"
            })
          },
        })
        return false
      }
      let prams = { blockedUserId: this.userInfo.id }
      block(prams).then(res => {
        pop(res.message, 2000)
        if (res.code == 200) {
          this.$refs.jinPopup.close()
          this.userInfo.userBlock = 1
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //取消拉黑用户
    cancelBlock: function () {
      if (!isLogin()) {
        uni.$emit('showPop', {
          refName: 'AlertMsg',
          data: {
            title: '提示',
            content: '您还没有登录账号，\n是否立即前往登录？'
          },
          confirm: () => {
            uni.navigateTo({
              url: "/pages/liuhe/login"
            })
          },
        })
        return false
      }
      let prams = { blockedUserId: this.userInfo.id }
      cancelBlock(prams).then(res => {
        pop(res.message, 2000)
        if (res.code == 200) {
          this.$refs.jinPopup.close()
          this.userInfo.userBlock = 0
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //搜索
    search() {
      this.pageNum = 1
      this.$refs.paging.reload()
    },
    //清除数据
    clear() {
      this.searchValue = ''
      this.$refs.paging.reload()
    },
    // 类型点击事件
    handleType(item) {
      this.activeType = {
        lotteryType: item.lotteryType
      };
      if (item.lotteryType > 0) {
        this.activeType.label = "查找" + item.name + "下发布的帖子"
      } else {
        this.activeType.label = "查找" + item.name + "发布的帖子"
      }
      this.$refs.paging.reload()
    },
    //论坛数据获取
    async listLatest(pageNo, pageSize = 10) {
      console.log(this.userInfo)
      if (!this.userInfo.id) { return false }
      this.pageNum = pageNo
      let prams = {
        lotteryType: this.activeType.lotteryType,
        type: this.type,
        sort: 0,
        title: this.searchValue,
        toUserId: this.userInfo.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      await userPublish(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.header-row {
  position: fixed;
  width: 100%;
  max-width: 480px;
  z-index: 10;
}

.user-head {
  background: #07c160;

  .user-info-warp {
    position: relative;
    height: 128rpx;
    margin-bottom: 30rpx;
    padding: 0 30rpx;

    .user-avatar {
      width: 128rpx;
      height: 128rpx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .user-user-name {
      padding-top: 16rpx;
      padding-left: 14rpx;

      .name {
        font-weight: 500;
        color: #fff;
        font-size: 32rpx;
      }
    }

    .tool {
      position: absolute;
      right: 0rpx;
      top: 0;
      display: flex;

      .m-follow {
        display: inline-block;
        width: 132rpx;
        height: 68rpx;
        background: #fff;
        box-shadow: 0 8rpx 16rpx 0 #09a958;
        border-radius: 34rpx;
        text-align: center;
        line-height: 68rpx;
        font-weight: 500;
        color: #07c160;
        margin-left: 20rpx;
      }
    }

    .medal-list {
      padding-top: 20rpx;
      padding-left: 14rpx;

      .medal-img {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }
    }
  }

  .info-account {
    padding-bottom: 30rpx;

    .info-item {
      text-align: center;

      .info-text {
        font-size: 28rpx;
        color: #c5e0d3;
        padding: 4rpx 0 0 0;
      }

      .num {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
        padding-bottom: 16rpx;
      }
    }
  }
}

.tab-content {
  .m-tabs {
    height: 104rpx;
    color: #999;
    font-weight: 800;
    overflow: hidden;
    background: #f8f8f8;
    padding: 0px 13px;

    .m-tabs-item {
      float: left;
      line-height: 104rpx;
      /*      width: 19.33%;*/
      width: 24.33%;
      text-align: center;
      font-size: 32rpx;
      position: relative;
    }

    .m-tabs-item.act {
      border-radius: 40rpx;
      color: #07c160;
    }

    .m-tabs-item.act:after {
      content: "";
      position: absolute;
      width: 92rpx;
      height: 8rpx;
      background: #07c160;
      bottom: 0;
      left: 50%;
      margin-left: -46rpx;
    }
  }

  .child-tabs {
    width: 100%;
    /*position: absolute;*/
    display: flex;
    flex-direction: column;
    padding: 16rpx;
    box-sizing: border-box;

    &>.type {
      padding: 16rpx;
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
        line-height: 26px;
        height: 26px;
        background-color: #fff;

        &:not(:first-child) {
          border-left: none;
        }

        img {
          height: 100%;
        }
      }
    }

    .second-list {
      display: flex;
      justify-content: space-around;

      .second-type-item {
        padding: 12rpx 36rpx;
        border-spacing: 2px;
        color: #07c160;
        background: #fff;
        border-radius: 8rpx;
        font-size: 26rpx;
        border: 1px solid #07c160;

        image {
          height: 44rpx;
          vertical-align: middle;
        }

        text {
          vertical-align: middle;
        }
      }

      .second-type-item.act {
        background-color: #07c160;
        color: #fff;
      }
    }
  }

  .list-bd {
    padding: 0 26rpx;
  }
}

.action-button {
  font-size: 16px;
  background-color: #fff;
  display: block;
  width: 100%;
  color: #323233;
  height: 50px;
  line-height: 50px;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid #ebedf0;
}

.red {
  color: #d1827d;
}

.action-button:after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  border: 0px solid rgba(0, 0, 0, .2);
  -webkit-transform: scale(.5);
  transform: scale(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: 10px;
}

.van-action-sheet__gap {
  display: block;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100.1%;
  border: 0px solid rgba(0, 0, 0, 0.7);
}
</style>
