<template>
  <view class="mint-tab-container-item" @click="popHid" :style="{ marginTop: safeHeight }">
    <nav-bar :isBack="true" :title="title">
      <block slot="right">
        <view style="text-align: center;margin-right: 10rpx">
          <uni-icons custom-prefix="iconfont" type="xiugai" color="#07c160" size="18" />
          <view>发布</view>
        </view>
      </block>
    </nav-bar>
    <view class="m-column item-line fist">
      <uni-row>
        <uni-col :span="4">
          <view class="label-name">类型</view>
        </uni-col>
        <uni-col :span="20">
          <view class="m-column-middle" @click.stop="showType">
            <view class="van-ellipsis" :class="{ act: typeShow }">
              {{ typeName }}
              <uni-icons v-if="typeShow" style="margin-left: 10rpx;font-weight: 600" color='#07c160' type="top"
                size="9"></uni-icons>
              <uni-icons v-else style="margin-left: 10rpx;" color='#dcdee0' type="bottom" size="9"></uni-icons>
            </view>
          </view>
        </uni-col>
      </uni-row>
      <view v-show="typeShow" class="van-dropdown-item">
        <view class="pop-box">
          <view class="van-overlay"></view>
          <view class="dropdown-type-box">
            <uni-row class="van-row">
              <uni-col class="type-col" :span="6" v-for="(item, index) in guess">
                <view class="item" :class="{ act: item.name == typeName }" @click.stop="setType(item)">
                  {{ item.name }}
                </view>
              </uni-col>
            </uni-row>
          </view>
        </view>
      </view>
    </view>
    <view class="m-column item-line" v-show="locationList.length > 0">
      <uni-row>
        <uni-col :span="4">
          <view class="label-name">位置</view>
        </uni-col>
        <uni-col :span="20">
          <view class="m-column-middle" @click.stop="showPosition">
            <view class="van-ellipsis" :class="{ act: positionShow }">
              {{ locationName }}
              <uni-icons v-if="positionShow" style="margin-left: 10rpx;font-weight: 600" color='#07c160' type="top"
                size="9"></uni-icons>
              <uni-icons v-else style="margin-left: 10rpx;" color='#dcdee0' type="bottom" size="9"></uni-icons>
            </view>
          </view>
        </uni-col>
      </uni-row>
      <view v-show="positionShow" class="van-dropdown-item">
        <view class="pop-box">
          <view class="van-overlay"></view>
          <view class="dropdown-type-box">
            <uni-row class="van-row">
              <uni-col class="type-col" :span="6" v-for="(item, index) in locationList">
                <view class="item" :class="{ act: locationName == item }" @click.stop="setLocation(item, index)">
                  {{ item }}
                </view>
              </uni-col>
            </uni-row>
          </view>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="m-column item-line">
        <uni-row class="">
          <uni-col :span="6">
            <view class="m-column-left">推荐内容: </view>
          </uni-col>
          <uni-col :span="12">
            <view class="label-name"></view>
          </uni-col>
          <uni-col :span="6">
            <view class="right-text" @click.stop="clearNumber">清空内容</view>
          </uni-col>
        </uni-row>
      </view>
      <view class="bd-box">
        <uni-row>
          <uni-col :span="3" v-for="(item, index) in checkNumber">
            <span class="m-code">{{ item }}</span>
          </uni-col>
        </uni-row>
      </view>
    </view>
    <view class="content">
      <view class="m-column item-line">
        <uni-row class="">
          <uni-col :span="6">
            <view class="m-column-left">参考内容: </view>
          </uni-col>
        </uni-row>
      </view>
      <view class="reference-content">
        <uni-row>
          <uni-col :span="3" v-for="(item, index) in number" :key="index">
            <span class="m-code"
              :class="{ act: checkNumber.includes(item), 'bg-amage-1': item == '红', 'bg-amage-2': item == '蓝', 'bg-amage-3': item == '绿' }"
              @click.stop="setNumber(item)">{{ item }}</span>
          </uni-col>
        </uni-row>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { guessPlayingConfig } from '../../utils/picture/index'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "pictureFabu",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '参与竞猜',
      pictureId: 0,
      typeShow: false,
      typeName: '',
      locationList: [],
      locationName: '',
      numberIndex: 0,
      number: [],
      maxCount: 1,
      minCount: 1,
      checkNumber: [],
      positionShow: false,
      guess: [],
    }
  },
  onLoad(option) {
    this.pictureId = option.pictureId
    this.guessPlayingConfig()
  },
  methods: {
    popHid() {
      console.log(111)
      this.typeShow = false
      this.positionShow = false
    },
    showType() {
      console.log(222)
      this.positionShow = false
      this.typeShow = !this.typeShow
    },
    showPosition() {
      console.log(333)
      this.positionShow = !this.positionShow
      this.typeShow = false
    },
    //获取玩法
    guessPlayingConfig() {
      guessPlayingConfig().then(res => {
        this.guess = res.result
        this.typeName = this.guess[0].name
        this.number = this.guess[0].optionList
        this.maxCount = this.guess[0].maxCount
        this.minCount = this.guess[0].minCount
      }).catch(err => {
        console.log(err)
      })
    },
    //清空数据
    clearNumber() {
      this.checkNumber = []
    },
    //点击选中
    setNumber(item) {
      console.log(1554655)
      let index = this.checkNumber.indexOf(item)
      if (index > -1) {
        this.$delete(this.checkNumber, index)
      } else {
        if (this.checkNumber.length == this.maxCount) {
          pop("最多选择" + this.maxCount + "个,最少" + this.minCount + "个")
          return false
        }
        this.checkNumber.push(item)
      }
    },
    //设置选中的数据
    setType: function (item) {
      this.typeName = item.name
      this.number = item.optionList
      this.checkNumber = []
      if (item.locationList) {
        this.locationList = item.locationList
      } else {
        this.locationList = []
      }
      this.locationName = this.locationList[0]
      this.maxCount = item.maxCount
      this.minCount = item.minCount
      this.typeShow = false
    },
    //设置位置
    setLocation: function (item, index) {
      this.locationName = item
      this.numberIndex = index + 1
      this.positionShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  height: var(--vh);
  background: #fff;
}

.fist {
  border-top: 2rpx solid #f3f3f3;
}

.m-column {
  padding: 22rpx 30rpx;
  border-bottom: 2rpx solid #f3f3f3;
  background: #fff;
  position: relative;

  .label-name {
    color: #07c160;
    display: inline-block;
    padding-right: 30rpx;
    font-size: 32rpx;
    border-right: 2rpx solid #f3f3f3;
  }

  .m-column-middle {
    font-size: 32rpx;

    .act {
      color: #07c160 !important;
    }
  }

  .van-dropdown-item {
    width: 100%;
    position: absolute;
    left: 0;
    background: #fff;
    margin-top: 20rpx;

    .pop-box {
      position: relative;

      .van-overlay {
        z-index: 22;
        position: absolute;
        animation-duration: 0.2s;
        top: 0;
        left: 0;
        width: 100vw;
        max-width: 480px;
        height: calc(var(--vh) - 46px - 35px);
        background-color: rgba(0, 0, 0, .7);
      }

      .dropdown-type-box {
        position: absolute;
        z-index: 23;
        background: #fff;
        width: 100vw;
        max-width: 480px;

        .van-row {
          padding: 0 30rpx 20rpx;
        }

        .type-col:nth-child(2n+1) {
          padding-right: 15px !important;
        }

        .type-col:nth-child(2n) {
          padding-left: 5px !important;
          padding-right: 10px !important;
        }

        .type-col {
          .item {
            border: 2rpx solid #eee;
            padding: 20rpx 0;
            border-radius: 8rpx;
            text-align: center;
            margin-top: 20rpx;
          }

          .act {
            border-color: #07c160;
          }
        }
      }
    }

  }

  .m-column-left {
    font-size: 32rpx;
  }

  .right-text {
    font-size: 32rpx;
    text-decoration: underline;
    color: #07c160;
    text-align: right;
  }
}

.m-code {
  margin-bottom: 20rpx;
  width: 70rpx;
  height: 70rpx;
  line-height: 56rpx;
  border-radius: 50%;
  text-align: center;
  display: inline-block;
  background-image: url(../../static/img/picture/fabu/kl-iocn1.png);
  background-size: 100% 100%;
  font-size: 28rpx;
}

.bg-amage-1 {
  line-height: 70rpx;
  background-image: url(../../static/img/qiu/1.png);
}

.bg-amage-2 {
  line-height: 70rpx;
  background-image: url(../../static/img/qiu/2.png);
}

.bg-amage-3 {
  line-height: 70rpx;
  background-image: url(../../static/img/qiu/3.png);
}

.bd-box {
  padding: 60rpx 30rpx;
  min-height: 180rpx;
  background: #fff;
}

.reference-content {
  padding: 20rpx 30rpx;
  background: #fff;

  .act {
    filter: grayscale(100%);
  }
}
</style>