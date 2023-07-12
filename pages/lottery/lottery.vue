<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <template v-slot:right>
        <picker @change="bindPickerChange" :value="index" :range="array">
          <uni-icons v-show="active == 0" type="calendar" color="#07c160" size="16" />
        </picker>
      </template>
    </NavBar>
    <view style="height: 44px">
      <uni-row class="row-body" :style="{ marginTop: safeHeight }">
        <uni-col :span="12" class="col">
          <view :class="{ active: active == 0 }" @click="active = 0">
            开奖记录
          </view>
        </uni-col>
        <uni-col :span="12" class="col">
          <view :class="{ active: active == 1 }" @click="active = 1">
            开奖日期
          </view>
        </uni-col>
      </uni-row>
    </view>
    <view>
      <z-paging v-show="active == 0" class="paging" style="background: #fff;z-index: 1" :height="'87vh'" ref="paging"
        v-model="dataList" @query="search" :refresher-enabled="true" :hide-empty-view="false" :empty-view-center="true"
        :empty-view-text="'暂无数据'" :hide-no-more-inside="true" :loading-more-enabled="true"
        :to-bottom-loading-more-enabled="true" :empty-view-img="'/static/img/wu.png'" :fixed="false"
        :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
        :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
        <view class="head-find">
            <view class="title">
              {{ year + "年历史开奖记录" }}
            </view>
            <view class="right-sort">
              <view :span="4">
                <span class="sort" @click="setSort">{{ sort == 0 ? '降序' : '升序' }}</span>
              </view>
              <view :span="4">
                <span class="center" :class="{ act: wuxing }" @click="wuxing = !wuxing">五行</span>
              </view>
              <view :span="6">
                <rudon-rowMenuDotDotDot :localdata="options" @change="menuAction($event)">
                  <span class="border">{{ options[codeSort].text }}</span>
                </rudon-rowMenuDotDotDot>
              </view>
            </view>
        </view>
        <view class="body-list">
          <view class="body-list-item" v-for="(item, index) in dataList">
            <view class="hd-text">
              <uni-row class="van-row">
                <uni-col :span="16">
                  <span class="title">
                    {{ "第" + item.period + "期最新开奖结果" }}
                  </span>
                </uni-col>
                <uni-col :span="8">
                  <span>{{ item.lotteryTime }}</span>
                </uni-col>
              </uni-row>
            </view>
            <view class="border-box">
              <view class="border-box-body">
                <view class="border-box-body-bd">
                  <uni-row class="van-row">
                    <uni-col :span="3" v-for="(val, key) in item.numberList.slice(0, 6)">
                      <view class="icon-text">
                        <view>
                          <span :class="'slot-icon bg-amage-' + val.color">
                            <span>{{ val.number }}</span>
                          </span>
                        </view>
                        <view class="slot-text">
                          {{ val.shengXiao }}
                          <span v-show="wuxing">/{{ val.wuXing }}</span>
                        </view><!---->
                      </view>
                    </uni-col>
                    <uni-col :span="3">
                      <view class="icon-text">
                        <uni-icons type="plusempty" size="30" color="rgb(172, 172, 172)"></uni-icons>
                      </view>
                    </uni-col>
                    <uni-col :span="3">
                      <view class="icon-text">
                        <view>
                          <span :class="'slot-icon bg-amage-' + item.numberList[6].color">
                            <span>{{ item.numberList[6].number }}</span>
                          </span>
                        </view>
                        <view class="slot-text">
                          {{ item.numberList[6].shengXiao }}
                          <span v-show="wuxing">/{{ item.numberList[6].wuXing }}</span>
                        </view><!---->
                      </view>
                    </uni-col>
                  </uni-row>
                </view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
    <view v-show="active == 1" class="lottery-date" :style="'height: calc(var(--vh) - 50px - 60px - ' + safeHeight + ')'">
      <view class="jianjie">
        <view class="title">简介</view>
        <view class="text">{{ content }}</view>
      </view>
      <date-item :lottery-type="lotteryType"></date-item>
    </view>
    <!--#ifdef H5-->
    <down></down>
    <!--#endif-->
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import DateItem from "../../components/common/date/dateItem";
import Down from "../../components/common/down/down";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import { listYear } from '../../utils/live/index'
import { search } from '../../utils/lottery/index'
export default {
  name: "lottery",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Notice, DateItem, Down
  },
  data() {
    return {
      title: '历史开奖',
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      index: 0,
      active: 0,
      array: [],
      lotteryType: 0,
      year: 0,
      sort: 0,
      wuxing: true,
      codeSort: 0,
      pageNum: 1,
      options: [
        {
          value: 0,
          text: '默认'
        },
        {
          value: 1,
          text: '平码升序'
        },
        {
          value: 2,
          text: '平码降序'
        }
      ],
      dataList: [],
      content: '搅珠日期对照表，可查看当月及下一个月的搅珠开奖日期',
      styleContent: {
        'font-size': '24rpx',
        'line-height': '40rpx',
      },
    }
  },
  onLoad(option) {
    this.lotteryType = uni.getStorageSync('lotteryType') ? uni.getStorageSync('lotteryType') : 1
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.listYear()
  },
  methods: {
    bindPickerChange: function (e) {
      this.year = this.array[e.detail.value]
      this.$refs.paging.reload()
    },
    //设置排序
    setSort() {
      if (this.sort == 0) {
        this.sort = 1
      } else {
        this.sort = 0
      }
      this.$refs.paging.reload()
    },
    //设置code码排序
    setCodeSort() {
      var arr = []
      if (this.codeSort == 0) {
        this.$refs.paging.reload()
      } else if (this.codeSort == 1) {
        this.dataList.forEach((item, index) => {
          arr = item.numberList.slice(0, 6).sort(function (a, b) {
            if (parseInt(a.number) < parseInt(b.number)) {
              return -1;
            } else if (parseInt(a.number) == parseInt(b.number)) {
              return 0;
            } else {
              return 1;
            }
          })
          arr.push(item.numberList[6])
          item.numberList = arr
        })
      } else if (this.codeSort == 2) {
        this.dataList.forEach((item, index) => {
          arr = item.numberList.slice(0, 6).sort(function (a, b) {
            if (parseInt(a.number) > parseInt(b.number)) {
              return -1;
            } else if (parseInt(a.number) == parseInt(b.number)) {
              return 0;
            } else {
              return 1;
            }
          })
          arr.push(item.numberList[6])
          item.numberList = arr
        })
      }

    },
    /**
     * 不同行的不同菜单点击事件
     *
     * @param {Object} action 第一个参数必须传入“$event” | 点击了哪个按钮 | 传入options的value
     * @param {Number} rowId 第二个参数随意，可以是行ID等
     */
    menuAction(action) {
      // 忽略初始化时的传入的空操作
      if (action === '') {
        return
      }
      this.codeSort = action
      this.setCodeSort()
    },
    listYear() {
      let prams = { lotteryType: this.lotteryType }
      listYear(prams).then(res => {
        this.array = res.result
        this.year = this.array[this.index]
        this.$refs.paging.reload()
      }).catch(err => {
        console.log(err)
      })
    },
    search(pageNo, pageSize = 8) {
      this.pageNum = pageNo
      let prams = {
        lotteryType: this.lotteryType,
        pageNum: this.pageNum,
        sort: this.sort,
        year: this.year,
      }
      search(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
        if (this.codeSort > 0) {
          this.setCodeSort()
        }
      }).catch(err => {
        console.log(err)
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.row-body {
  margin-top: 1px;
  top: 46px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background: #fff;
  font-size: 14px;
  position: fixed;
  width: 100%;
  max-width: 480px;
  z-index: 2;

  .active {
    color: rgb(7, 193, 96);
  }

  &::after {
    display: none;
    content: "";
  }
}

.paging {
  height: calc(var(--vh) - 50px - 45px);
}

.head-find {
  background: #eee;
  padding: 24rpx 20rpx;
  font-size: 14px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
.right-sort{
  display: flex;
}
  span {
    box-sizing: border-box;
    background: #fff;
    display: inline-block;
    font-size: 24rpx;
    padding: 4rpx 16rpx 4rpx 16rpx;
    border-radius: 24rpx;
    line-height: 32rpx;
  }

  .sort {
    border: 0.02rem solid #ddd;
    float: right;
  }

  .center {
    margin-left: 20rpx;
  }

  .act {
    background: #07c160;
    color: #fff;
  }

  .border {
    // width: 66px;
    text-align: center;
    margin-right: 10px;
    float: left;
  }
}

.body-list {
  .body-list-item {
    padding: 30rpx 0 6rpx 0;
    border-top: 2rpx solid #ddd;
    background: #fff;

    .hd-text {
      padding: 0 20rpx;

      .van-row {
        span {
          display: block;
          text-align: right;
          color: #999;
          font-size: 24rpx;
        }

        .title {
          color: #333;
          font-size: 28rpx;
          text-align: left;
        }
      }
    }

    .border-box {
      .border-box-body {
        .icon-text {
          display: inline-block;
          text-align: center;
          position: relative;

          .slot-icon {
            span {
              padding-right: 6rpx;
            }
          }
        }
      }
    }
  }
}

.lottery-date {
  padding: 20rpx;
  background: #fff;

  .jianjie {
    background-color: #fbfbfb;
    background-image: url('../../static/img/toolbox/bac.png');
    background-size: 100% 100%;
    text-align: center;
    padding: 26rpx;

    .title {
      margin-bottom: 30rpx;
    }

    .text {
      font-size: 24rpx;
      line-height: 40rpx;
    }
  }
}
</style>