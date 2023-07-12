<template>
  <view class="ball-list">
    <view v-for="(item, index) in ballChildren" :class="item.isSelected === true ? 'ball-item selected' : 'ball-item'"
      :key="item.id" @click="onClickItem(item, index)">
      <view class="box">
        <view class="left">
          <view :class="setArr(item.name).length === 3 ? 'small-num' : 'num'" v-for="(i, key) in setArr(item.name)"
            :key="key" :style="setBallStyle(i)">
            <!-- <text>{{item.name}}</text> -->
          </view>
        </view>
        <view class="right">
          <view class="num" v-if="ball">
            {{ item.odds }}
          </view>
        </view>
      </view>
      <view class="mark">{{ missOrMatchText(item) }}</view>
    </view>
  </view>
</template>
<script>
import UniRow from "../../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../../uni_modules/uni-row/components/uni-col/uni-col";
import Playing from "../../../../utils/common/playing";
import { mapGetters } from "vuex";

export default {
  name: "index",
  props: {
    ballChildren: {
      type: Array,
      default: [],
    },
    ball: {},
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  data() {
    return {
      current: null,
      playing: new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      bgImg: {
        'bg_1': require('../../../../static/img/liuhe/ball/1.png'),
        'bg_2': require('../../../../static/img/liuhe/ball/1.png'),
        'bg_3': require('../../../../static/img/liuhe/ball/1.png')
      },
    }
  },
  components: { UniCol, UniRow },
  watch: {
    orderList() {
      this.setDefaultSelected()
    }
  },
  mounted() {
    // console.log("aaaa", this.ballChildren)
    this.setDefaultSelected()
  },
  methods: {
    setArr(str) {
      let arr = str.split('');
      return arr
    },
    setBallStyle(num) {
      if (num === "*") {
        num = "star"
      }
      return {
        backgroundImage: `url(./../../static/img/liuhe/kuaisan/${num}.png)`,
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
      }
    },
    setDefaultSelected() {
      console.log("ball vue setDefaultSelected orderList:", this.orderList, this.ballChildren, this.ball);
      let selectedIds = [];
      let _this=this;
      if (this.orderList.length) {
        //我觉得selected id 可以参考六合 直接从外部传入 避免这样重复去计算
        this.orderList.forEach(order=>{
          if (order.content === ""||!order.content) {
            selectedIds.push(order.playId);
          } else {
            _this.orderList[0].content.split(',').forEach(i => {
              if(i!==''){
                selectedIds.push(parseInt(i));
              }
            })
          }
        })

      }

      if (selectedIds.length === 0) {
        this.currentArr = [];
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        // return;
      }
      this.ballChildren.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
      })
      this.$forceUpdate()
    },
    setItemStyle(index, len) {
      return this.playing.setBallItemStyle(index, len)
    },
    onClickItem(item, index) {
      item.dataIndex = index;
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      this.ballChildren.forEach(i => {
        i.isSelected = this.currentArr.includes(i.id)
      })
      this.$forceUpdate()
      this.$emit('changeData', { ballChildren: this.ballChildren, dataIndex: this.dataIndex, selectedIds: this.currentArr, ball: this.ball, ballItem: item })
    }
    ,
    missOrMatchText(item) {
      let attrKey = this.missOrMatch;
      return item[attrKey] || item[attrKey] === 0 ? item[attrKey] : "";
    },
  }
}
</script>

<style lang="scss" scoped>
.ball-list {
  display: flex;
  flex-wrap: wrap;

  .ball-item {
    position: relative;
    box-sizing: border-box;
    background: #DEEAFA;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
      //  width: 153rpx;
      display: flex;

      .left {
        position: relative;
        //  width: 98.5rpx;
        height: 110rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .num {
          width: 66.13rpx;
          height: 67rpx;
        }

        .small-num {
          width: 54.29rpx;
          height: 54.29rpx;
        }
      }

      .right {
        position: relative;
        width: 98.5rpx;
        height: 110rpx;

        .num {
          line-height: 110rpx;
          text-align: center;
          color: #8CB2C9;
          font-size: 28rpx;
        }

      }
    }

    .mark {
      position: absolute;
      right: 8rpx;
      top: 8rpx;
      font-size: 20rpx;
      color: #8CB2C9;
    }
  }

  .ball-item.selected {
    background: #0099CC;
    box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);

    .right {
      .num {
        color: #DEEAFA;
      }
    }

    .mark {
      color: #DEEAFA;
    }
  }
}</style>
