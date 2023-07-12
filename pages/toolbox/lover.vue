<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="lover-body">
      <notice :content="content"></notice>
      <view v-if="isGet" class="">
        <view class="result-box">
          <span v-for="(item, index) in lottery" :class="getClass(item.color)">{{ item.number }}</span>
        </view>
      </view>
      <view v-else>
        <view class="person-body">
          <image mode="widthFix" src="../../static/img/toolbox/nan.png" />
          <span>+</span>
          <image mode="widthFix" src="../../static/img/toolbox/nv.png" />
          <span>=</span>
          <image mode="widthFix" src="../../static/img/toolbox/wen.png" />
        </view>
        <view class="label-box">
          <view class="line-box">
            <span>选择性别：</span>
            <image mode="widthFix" @click="sex = 0"
              :src="sex == 0 ? '../../static/img/toolbox/man.png' : '../../static/img/toolbox/nan-back.png'" />
            <image mode="widthFix" @click="sex = 1"
              :src="sex == 1 ? '../../static/img/toolbox/nv-select.png' : '../../static/img/toolbox/woman.png'" />
          </view>
          <view class="line-box">
            <span>您的生日：</span>
            <picker mode="date" :value="formData.maleBirthDate" :start="startDate" :end="endDate"
              @change="bindDateChangeMan">
              <input type="text" v-model="formData.maleBirthDate" readonly="readonly" placeholder="选择生日"><!---->
            </picker>

          </view>
          <view class="line-box">
            <span>对象生日：</span>
            <picker mode="date" :value="formData.femaleBirthDate" :start="startDate" :end="endDate"
              @change="bindDateChangeWoman">
              <input type="text" v-model="formData.femaleBirthDate" readonly="readonly" placeholder="选择生日"><!---->
            </picker>
          </view>
        </view>
        <button type="primary" @click="pipei">匹配一下</button>
      </view><!---->

      <div class="footer-text">提示：每天只能进行一次匹配</div>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import { loversNumber } from '../../utils/toolbox/index';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "lover",
  components: {
    AlertInjectLayer,
    NavBar,
    Notice
  },
  data() {
    const currentDate = this.getDate({
      format: true
    })
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '恋人特码',
      content: '请输入您和她/他的生日，计算本期特码，赶紧来试试！',
      sex: 1,
      isGet: false,
      formData: {
        jpushId: 69250,
        isErrorMsg: false,
        maleBirthDate: '',
        femaleBirthDate: '',
      },
      lottery: {},
    }
  },
  computed: {
    startDate() {
      return this.getDate('start');
    },
    endDate() {
      return this.getDate('end');
    },
  },
  methods: {
    getClass(color) {
      if (color == 1) {
        return 'red'
      } else if (color == 2) {
        return 'blue'
      } else {
        return 'green'
      }
    },
    bindDateChangeMan(e) {
      this.formData.maleBirthDate = e.detail.value
    },
    bindDateChangeWoman(e) {
      this.formData.femaleBirthDate = e.detail.value
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 60;
      } else if (type === 'end') {
        year = year;
      }
      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      console.log(`${year}-${month}-${day}`)
      return `${year}-${month}-${day}`;
    },
    pipei() {
      let prams = this.formData
      loversNumber(prams).then(res => {
        this.lottery = res.data.numberList
        this.isGet = true
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  height: 94vh;
}

.lover-body {
  margin-top: 12rpx;
  position: relative;
  height: calc(100% - 12rpx);
  background: #fff;
  padding: 20rpx 24rpx;
  box-sizing: border-box;

  .person-body {
    text-align: center;
    height: 76rpx;
    line-height: 76rpx;
    margin: 58rpx 0 44rpx 0;

    image {
      width: 76rpx;
    }

    span {
      display: inline-block;
      font-size: 40rpx;
      margin: 0 24rpx;
      position: relative;
      top: -20rpx;
    }

  }

  .label-box {
    padding: 0 46rpx 0 80rpx;

    .line-box {
      line-height: 64rpx;
      height: 64rpx;
      margin-bottom: 24rpx;

      span {
        color: #333;
        font-size: 28rpx;
        margin-right: 6rpx;
      }

      image {
        display: inline-block;
        width: 52rpx;
        position: relative;
        top: 12rpx;
        margin-right: 58rpx;
      }

      image:nth-of-type(2) {
        width: 42rpx;
        height: 52rpx;
      }

      picker {
        display: inline-flex;
        line-height: 64rpx;
        height: 64rpx;
        box-sizing: border-box;
        text-align: center;
        border: none;
        background: #f1f1f1;
        width: calc(100% - 180rpx);
        outline: none;

        input {
          display: contents;
          line-height: 64rpx;
          height: 64rpx;
          box-sizing: border-box;
          text-align: center;
          border: none;
          background: #f1f1f1;
          width: calc(100% - 180rpx);
          outline: none;
        }
      }
    }
  }

  button {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    background: #07c160;
    font-size: 32rpx;
    margin-top: 24rpx;
  }

  .result-box {
    display: flex;
    justify-content: space-between;
    padding: 116rpx 40rpx 0;

    span {
      display: inline-block;
      height: 68rpx;
      width: 68rpx;
      font-size: 28rpx;
      color: #333;
      line-height: 72rpx;
      text-indent: 16rpx;
    }

    .red {
      background: url('../../static/img/qiu/1.png');
      background-size: contain;
    }

    .blue {
      background: url('../../static/img/qiu/2.png');
      background-size: contain;
    }

    .green {
      background: url('../../static/img/qiu/3.png');
      background-size: contain;
    }
  }

  .footer-text {
    position: absolute;
    width: 100%;
    color: #333;
    font-size: 24rpx;
    text-align: center;
    line-height: 34rpx;
    bottom: 34rpx;
  }
}</style>