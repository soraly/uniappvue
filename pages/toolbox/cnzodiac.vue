<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="cnzodiac-body" style="">
      <notice :content="content" :styleContent="styleContent"></notice>
      <view class="card-box">
        <view class="line-card-box" v-for="(item, index) in card" :key="index">
          <view class="card-item" v-for="(val, key) in item" :key="key" @click="fanpai(val)">
            <image mode="widthFix" :src="val.show ? val.img : defaultImg"></image>
          </view>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import { animalCard } from '../../utils/toolbox/index';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "cnzodiac",
  components: {
    AlertInjectLayer,
    NavBar,
    Notice
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '生肖卡牌',
      content: '每期开奖前通过该工具可以快捷的查看三个隐藏在卡牌中的生肖，来试试你的财运!',
      styleContent: {
        'font-size': '24rpx',
        'margin-top': 0,
        'line-height': '28rpx',
        'text-align': 'left',
        'box-sizing': 'border-box',
        padding: '0 20rpx'
      },
      defaultImg: '../../static/img/toolbox/card.png',
      cardList: [
        {
          img: '../../static/img/toolbox/turntable/gou.png',
          show: 0,
          name: '狗'
        },
        {
          img: '../../static/img/toolbox/turntable/hou.png',
          show: 0,
          name: '猴'
        },
        {
          img: '../../static/img/toolbox/turntable/hu.png',
          show: 0,
          name: '虎'
        },
        {
          img: '../../static/img/toolbox/turntable/ji.png',
          show: 0,
          name: '鸡'
        },
        {
          img: '../../static/img/toolbox/turntable/long.png',
          show: 0,
          name: '龙'
        },
        {
          img: '../../static/img/toolbox/turntable/ma.png',
          show: 0,
          name: '马'
        },
        {
          img: '../../static/img/toolbox/turntable/niu.png',
          show: 0,
          name: '牛'
        },
        {
          img: '../../static/img/toolbox/turntable/she.png',
          show: 0,
          name: '蛇'
        },
        {
          img: '../../static/img/toolbox/turntable/shu.png',
          show: 0,
          name: '鼠'
        },
        {
          img: '../../static/img/toolbox/turntable/tu.png',
          show: 0,
          name: '兔'
        },
        {
          img: '../../static/img/toolbox/turntable/yang.png',
          show: 0,
          name: '羊'
        },
        {
          img: '../../static/img/toolbox/turntable/zhu.png',
          show: 0,
          name: '猪'
        },
      ],
      card: [],
      animals: [],
      isShow: false,
    }
  },
  onLoad() {
    this.setCard()
  },
  methods: {
    // 返回min和max之间的一个随机数，包括min和max
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min) // +1是保证可以取到上限值
    },
    // 洗牌函数
    shuffle() {
      let _arr = this.cardList.slice()   // 下面会讲到slice的特别之处
      for (let i = 0; i < _arr.length; i++) {
        let j = this.getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
      }
      return _arr
    },
    //打乱数组
    setCard() {
      this.cardList = this.shuffle()
      this.cardList.forEach((item, index) => {
        const page = Math.floor(index / 3)
        if (!this.card[page]) {
          this.card[page] = []
        }
        this.card[page].push(item)
      })
    },
    //翻牌
    fanpai(item) {
      if (this.animals.length == 3) {
        return false
      }
      item.show = true
      this.animals.push(item)
      if (this.animals.length == 3) {
        let prams = {
          jpushId: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
        }
        const animals = []
        this.animals.forEach((item, index) => {
          animals.push(item.name)
        })
        prams.animals = animals.join(",");
        animalCard(prams).then(res => {
          this.card = []
          this.card[0] = this.animals
          this.isShow = true
        }).catch(err => {

        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  .cnzodiac-body {
    margin-top: 12rpx;
    position: relative;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
    height: var(--vh);

    .card-box {
      .line-card-box {
        margin-top: 20rpx;
        display: flex;
        justify-content: space-between;

        .card-item {
          image {
            display: block;
            width: 190rpx;
          }
        }
      }
    }
  }
}
</style>