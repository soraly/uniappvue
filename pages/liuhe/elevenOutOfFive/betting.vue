<template>
  <view class="betting">
    <view class="left">
      <view class="left-nav">
        <scroll-view scroll-y="true" class="list" :style="setNavLeftStyle()">
          <view :class="item.isDefault === 1 ? 'list-item selected' : 'list-item'" v-for="(item, index) in playList"
            :key="item.id" @click="onSelected(item)">
            <view class="item-left">
              <text :class="item.isDefault === 1 ? 'dots active' : 'dots'"></text>
            </view>
            <view class="type-name">
              {{ item.name }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="right">
      <play ref="play" :missOrMatch="missOrMatch" :play-data="playData" @selectedBall="setOrders"
        @onSelectedType="onSelectedType" @open="showRule"></play>
    </view>
    <view class="miss-match-data-switch" @click="doCutAraeMissAndMatchType">{{ missOrMatch == 'miss' ? '遗漏' : '冷热' }}</view>
    <rules-dialog ref="rules" :exampleStr="desc.exampleStr" :helpStr="desc.helpStr" :tipsStr="desc.tipsStr"
      @open="showRule"></rules-dialog>
  </view>
</template>

<script>
import Play from "./playing/playing";
import RulesDialog from "../common/rulesDialog";
import Playing from "../../../utils/common/playing";
export default {
  name: "index",
  props: {
    playList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Play,
    RulesDialog
  },
  watch: {
    playList(newV, oldV) {
      newV.length && this.getPlayData(newV)
    }
  },
  data() {
    return {
      current: null,
      playData: {},
      playing: new Playing(),
      contentShow: false,
      modeClass: ['fade', 'slide-bottom'],
      desc: {
        exampleStr: '',
        helpStr: '',
        tipsStr: '',
      },
      // play: uni.getStorageSync('playList')
      missOrMatch: "miss"
    }
  },
  mounted() {
    this.playList && this.playList.length && this.getPlayData(this.playList)
  },
  methods: {
    showRule(item) {
      console.log("??????", item);
      this.desc = item;
      this.$refs.rules.open('center');
    },
    reset() {
      this.$refs.play.reset()
    },
    setNavLeftStyle() {
      // return this.playing.setCurrentHeight()
    },
    getPlayData(arr) {
      arr.forEach(item => {
        if (item.isDefault === 1) {
          this.onSelected(item)
        }
      })
      // this.play = uni.getStorageSync('playList')
    },
    onSelected(item) {
      this.playList.forEach(i => {
        if (item.code === i.code) {
          i.isDefault = 1
        } else {
          i.isDefault = 0
        }
      })
      console.log(item);
      this.current = item.id;
      this.playData = item;
      this.$emit('selected', item)
    },
    onSelectedType() {
      this.$emit('onSelectedType')
    },
    setOrders(data) {
      this.$emit("setOrders", data);
    },
    doCutAraeMissAndMatchType() {
      if (this.missOrMatch == "miss") {
        this.missOrMatch = "match";
      } else {
        this.missOrMatch = "miss";
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.betting {
  position: relative;
  height: 100%;

  .left {
    position: absolute;
    left: 0;
    width: 160rpx;
    height: 100%;

    .left-nav {
      width: 160rpx;
      position: relative;
      height: 100%;

      //height: calc(var(--vh) - 320rpx);
      .list {
        height: 100%;

        .list-item {
          display: flex;
          padding-left: 15rpx;

          .type-name {
            text-align: center;
            width: 120rpx;
            height: 100%;
            font-size: 30rpx;
            font-weight: 400;
          }

          .item-left {
            width: 16rpx;
            height: 100%;

            .dots {
              width: 16rpx;
              height: 16rpx;
              background: #81A9C1;
              box-shadow: inset 0px 4rpx 4rpx rgba(0, 0, 0, 0.25);
              border-radius: 100rpx;
              display: inline-block;
              transition: .3s;
              margin: 0 auto;
            }

            .dots.active {
              background: linear-gradient(180deg, #F8F9F9 0%, #FEFD04 100%);
              box-shadow: 0px 1rpx 5rpx rgba(0, 0, 0, 0.25), 0px 4rpx 4rpx rgba(0, 0, 0, 0.25), inset 0px -3rpx 4rpx rgba(0, 0, 0, 0.25);
              border-radius: 100rpx;
              transition: .3s;
            }
          }

          font-size: 30rpx;
          text-align: center;
          letter-spacing: -0.5px;
          color: #16607A;
          height: 104rpx;
          line-height: 104rpx;
          background: #CCDBEE;
          border: 1rpx solid #91B5CB;
          box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
        }

        .list-item.selected {
          background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
          box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
          border: 1rpx solid #91B5CB;
          color: #BAE8FA;
          transition: .3s;

          .type-name {
            font-size: 34rpx;
            transition: .5ms;
          }
        }
      }
    }

  }

  .right {
    position: absolute;
    width: calc(100% - 160rpx);
    height: 100%;
    right: 0;
  }

  .miss-match-data-switch {
    position: absolute;
    z-index: 2;
    width: 50px;
    height: 40px;
    line-height: 40px;
    right: 0px;
    top: -21px;
    text-align: center;
    padding: 2px;
    border-radius: 5px 0px 0px 5px;
    background: rgba(9, 121, 158, 0.59);
    opacity: 0.5;
    font-size: 18px;
    color: whitesmoke;
  }
}</style>
