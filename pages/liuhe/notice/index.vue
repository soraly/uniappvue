<template>
  <view class="notice-box" :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :title="title" :titleStyle="titleStyle" :isBack="true" :headerStyle="headerStyle"
      :leftWidth="90">
      <view slot="title" class="bar-tool">
        <view class="switch-btn">
          <view :class="current === 1 ? 'site-text act' : 'site-text'" @click="onSwitch(1)">公告</view>
          <view :class="current === 2 ? 'site-text act' : 'site-text'" @click="onSwitch(2)">站内消息</view>
        </view>
      </view>
      <block slot="right">
        <view v-if="current == 1" class="kefu">
          <image src="/static/img/liuhe/notice/user.png"></image>
          <text class="text">联系客服</text>
        </view>
        <view v-else class="edit-box">
          <text v-if="!isEdit" class="text" @click="isEdit = true">编辑</text>
          <text v-else class="text" @click="cancel">取消</text>
        </view>
      </block>
    </nav-bar>
    <z-paging ref="paging" v-model="noticeList" @query="getList" :lower-threshold="10" :refresher-enabled="true"
      :refresherAnimated="false" :show-refresher-update-time="true" :refresher-default-text="'松开刷新...'"
      :refresher-pulling-text="'松开刷新...'" :refresher-default-img="'/static/img/load.gif'"
      :refresher-pulling-img="'/static/img/load.gif'" :refresher-refreshing-img="'/static/img/load.gif'"
      :refresher-default-style="'#EEEEEE'" :refresher-background="'#EEEEEE'" :refresher-fixed-background="'#EEEEEE'"
      :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
      :refresher-refreshing-text="'正在加载更多数据...'"
      :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
      :loading-more-loading-icon-custom-image="'/static/img/load.gif'"
      :loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#EEEEEE' }"
      :loading-more-loading-animated="false" :loading-more-default-as-loading="true"
      :show-loading-more-no-more-view="true" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
      :empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
      :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
      :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }"
      class="list-box">
      <view class="list-row" :class="{ 'list-flex': current == 2 && isEdit }" v-for="(item, index) in noticeList">
        <view class="checkbox-item" v-show="current == 2 && isEdit">
          <view @click="choseInfo(item.id)" v-if="checkData.indexOf(item.id) !== -1">
            <image src="/static/img/liuhe/notice/check.png"></image>
          </view>
          <view @click="choseInfo(item.id)" v-else>
            <image src="/static/img/liuhe/notice/ncheck.png"></image>
          </view>
        </view>
        <view class="list-item" :class="{ 'list-item-rigth': current == 2 && isEdit }">
          <view class="title">
            <image v-if="current == 1" src="/static/img/liuhe/notice/laba.png"></image>
            <image v-else src="/static/img/liuhe/notice/msg.png"></image>
            <view class="title-text">
              {{ item.title }}
            </view>
            <view v-if="current == 1" class="top-lable">
              置顶
            </view>
            <view v-else :class="item.isRead ? 'red' : 'not-red'">
              {{ item.isRead ? "已读" : "未读" }}
            </view>
          </view>
          <view class="content-box" @click="detail(item)">
            <view class="left">
              <view class="content">{{ current == 1 ? item.noticeContent : item.content }}
              </view>
              <view class="time">{{ item.createTime }}
              </view>
            </view>
            <view class="right">
              <uni-icons class="right-icon" type="right"></uni-icons>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
    <view class="footer" v-show="current == 2 && isEdit">
      <view class="footer-box">
        <view class="all" @click="cancelAll" v-if="checkData.length == noticeList.length">
          取消
        </view>
        <view class="all" @click="choseAll" v-else>
          全选
        </view>
        <view class="all" @click="del">
          删除
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { listByPage, msgList, delMessage } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '公告',
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      current: 1,
      isEdit: false,
      noticeList: [],
      checkData: [],
    }
  },
  onLoad(option) {
  },
  methods: {
    onSwitch(curr) {
      this.current = curr
      this.$refs.paging.reload()
    },
    choseAll() {
      this.checkData = [];
      this.noticeList.forEach((item, index) => {
        this.checkData.push(item.id)
      })
    },
    choseInfo(id) {
      let removedIndex = this.checkData.indexOf(id);
      if (removedIndex !== -1) {
        this.checkData = this.checkData.splice(removedIndex, 1);
      } else {
        this.checkData.push(id)
      }
    },
    cancel() {
      this.checkData = [];
      this.isEdit = false
    },
    cancelAll() {
      this.checkData = [];
    },
    del() {
      let ids = this.checkData.join(",")
      let prams = {
        ids: ids
      }
      delMessage(prams).then(res => {
        if (res.code == 200) {
          this.$refs.paging.reload()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getList(pageNo) {
      if (this.current == 1) {
        this.getListByPage(pageNo)
      } else {
        this.getMessageList(pageNo)
      }
    },
    getListByPage(pageNo) {
      let prams = {
        pageNum: pageNo,
        pageSize: 10,
      }
      listByPage().then(res => {
        if (res.code === 200) {
          this.$refs.paging.complete(res.result.records);
        } else {
          this.$refs.paging.complete([]);
        }
      })
    },
    //加载站内信
    getMessageList(pageNo) {
      msgList({ pageNum: pageNo, projectType: 2 }).then(res => {
        if (res.code === 200) {
          this.$refs.paging.complete(res.result.records);
        } else {
          this.$refs.paging.complete([]);
        }
      })
    },
    //详情
    detail(item) {
      let url = ""
      if (this.current === 1) {
        url = "./detail?id=" + item.id
      } else {
        url = "./msg?id=" + item.id
      }
      uni.navigateTo({
        url: url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-box {
  font-family: 'PingFang SC';

  .bar-tool {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .switch-btn {
    height: 54rpx;
    width: 300rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .site-text {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 150rpx;
      height: 54rpx;
      background: #03536E;
      border: 1px solid #FFFFFF;
      font-weight: 500;
      font-size: 24rpx;

      &:first-child {
        border-radius: 50rpx 0px 0px 50rpx;
      }

      &:last-child {
        border-radius: 0px 50rpx 50rpx 0px;
      }
    }

    .act {
      background: #FFFFFF;
      color: #03536E;
    }
  }

  .kefu {
    display: flex;

    image {
      height: 40rpx;
      width: 40rpx;
    }

    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      margin-left: 5rpx;
    }
  }

  .edit-box {
    margin-right: 20rpx;

    .text {
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }

  .list-box {
    height: calc(var(--vh) - 96rpx);
    background: #EEEEEE;

    .list-flex {
      display: flex;
    }

    .list-row {
      .checkbox-item {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          height: 40rpx;
          width: 40rpx;
        }
      }

      .list-item-rigth {
        width: 80%;
      }

      .list-item {
        margin: 21rpx;
        background: #fff;

        .title {
          height: 75rpx;
          display: flex;
          align-items: center;
          position: relative;

          image {
            height: 40rpx;
            width: 40rpx;
            margin-left: 16rpx;
          }

          .title-text {
            margin-left: 14rpx;
            width: 448rpx;
            font-style: normal;
            font-weight: 400;
            font-size: 30rpx;
            color: #222222;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; // 默认不换行；
          }

          .top-lable {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 65rpx;
            height: 30rpx;
            background: #FCBF0A;
            border-radius: 10rpx;
            font-weight: 400;
            font-size: 22rpx;
            color: #FFFFFF;
            right: 22rpx;
          }

          .not-red {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 65rpx;
            height: 30rpx;
            background: #55D3A5;
            border-radius: 10rpx;
            font-weight: 400;
            font-size: 22rpx;
            color: #FFFFFF;
            right: 22rpx;
          }

          .red {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 65rpx;
            height: 30rpx;
            background: #C3C3C3;
            border-radius: 10rpx;
            font-weight: 400;
            font-size: 22rpx;
            color: #FFFFFF;
            right: 22rpx;
          }
        }

        .content-box {
          display: flex;
          align-items: center;
          border-top: 1px solid #EEEEEE;
          height: 127rpx;

          .left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 80%;
            padding-left: 20rpx;
            font-weight: 400;
            font-size: 24rpx;
            color: #666666;

            .content {
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; // 默认不换行；
            }
          }

          .right {
            position: absolute;
            right: 50rpx;

            .right-icon {
              font-size: 40rpx !important;
              color: #C7C7CC !important;
            }
          }
        }
      }
    }
  }

  .footer {
    .footer-box {
      height: 80rpx;
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px;
      background: #FFFFFF;
      z-index: 20;

      .all {
        font-weight: 400;
        font-size: 30rpx;
        /* identical to box height */
        color: #DF2939;
        margin: 20rpx;
      }

      .delete {}
    }
  }
}
</style>