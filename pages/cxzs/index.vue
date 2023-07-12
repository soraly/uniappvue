<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar>
      <!--        <block slot="left">-->
      <!--            <uni-icons @click="back" type="back" color="#666" size="18" style="font-weight: bold;margin-left: 10px"/>-->
      <!--        </block>-->
      <view class="input-view" slot="title">{{ title }}</view>
    </nav-bar>
    <!--条件栏-->
    <view style="height: 50px; display: block;">
      <view class="tab-wrap" :style="{ marginTop: safeHeight }">
        <picker class="tab-item" @change="bindPickerChange" :value="yearList.findIndex(item => item == years)"
          :range="yearList">
          查询年份
          <uni-icons custom-prefix="iconfont" type="jiantouxia" size="16"></uni-icons>
        </picker>
        <view class="tab-item" @click="isShow = true">查询条件
          <uni-icons custom-prefix="iconfont" type="jiantouxia" size="16"></uni-icons>
        </view>
      </view>
    </view>
    <!--筛选-->
    <view class="sel-type" style="height: var(--vh);" v-show="isShow">
      <view class="sel-type-body">
        <view class="left-type">
          <view v-for="(item, index) in leftType" :key="index" :class="isActive == item.queryType ? 'active' : ''"
            @click="selectType(item)">
            {{ item.name }}
            <uni-icons custom-prefix="iconfont" type="jiantouright" size="16"></uni-icons>
          </view>
        </view>
        <view class="right-sel">
          <view v-for="(item, index) in leftType[isActive - 1].list" :class="checkData.indexOf(item) >= 0 ? 'active' : ''"
            @click="selectValue(item)">
            {{ item }}
            <uni-icons v-if="checkData.indexOf(item) >= 0" type="checkmarkempty" size="15" color="#07c160"
              style="float: right;"></uni-icons>
          </view>
        </view>
      </view>
      <view class="btn-wrap">
        <view @click="cancel">取消</view>
        <view class="active" @click="confirm">确定</view>
      </view>
    </view>
    <!--多选框-->
    <view class="label-qs clearfix">
      <checkbox-group @change="checkBox" style="display: inline;">
        <label>
          <checkbox :checked="selfChecked" value="cb" color="#fff" style="color: #fff;" /> {{ " " + "仅显示出现的期数" }}
        </label>
      </checkbox-group>
      <span class="to-notice" @click="help">?</span>
    </view>
    <!--表格-->
    <view class="table-wrap">
      <table id="tableSvg">
        <tr style="line-height: 28px;">
          <th v-for="(item, index) in tabData.rows">{{ item.label }}</th>
        </tr>
        <tr v-for="(item, index) in tabData.rols">
          <td>
            <div>{{ item.yearAndTerm }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal1)">{{ item.normal1.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal2)">{{ item.normal2.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal3)">{{ item.normal3.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal4)">{{ item.normal4.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal5)">{{ item.normal5.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.normal6)">{{ item.normal6.value }}</div>
          </td>
          <td>
            <div :class="GetKey(item.special)">{{ item.special.value }}</div>
          </td>
        </tr>
      </table>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { doQuery, listYear } from "../../utils/common/index.js"
import { color } from "../../static/js/echarts.min";
import NavBar from "../../components/common/navBar/navBar.vue"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    const date = new Date();
    return {
      title: "查询助手",
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      years: date.getFullYear(),    //默认年份
      selfChecked: false,
      yearList: [],
      isActive: 1,
      isActiveNew: 1,
      isShow: false,
      checkData: [],
      checkDataNew: [],
      leftType: [
        {
          queryType: 1,
          name: '数字',
          selectNum: 3,
          list: ['01', '02', '03', "04", '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
        },
        {
          queryType: 2,
          name: '生肖',
          selectNum: 3,
          list: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
        },
        {
          queryType: 3,
          name: '五行',
          selectNum: 1,
          list: ['金', '木', '水', '火', '土']
        },
        {
          queryType: 4,
          name: '波色',
          selectNum: 1,
          list: ['红波', '蓝波', '绿波']
        },
        {
          queryType: 5,
          name: '家野',
          selectNum: 1,
          list: ['家禽', '野兽']
        },
        {
          queryType: 6,
          name: '尾数',
          selectNum: 1,
          list: ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾']
        }
      ],
      tabData: {},
      tabData2: {},
      colorList: ['redcolor', 'blue', 'green'],
    }
  },
  onLoad(option) {
    this.lotteryType = uni.getStorageSync('lotteryType')
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
    this.doQuery()
  },
  methods: {
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    help() {
      uni.navigateTo({
        url: "help"
      })
    },
    //获取年份列表
    listYear: function () {
      listYear().then(res => {
        this.yearList = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    bindPickerChange: function (e) {
      this.years = this.yearList[e.detail.value]
      this.doQuery()
    },
    //请求数据
    doQuery: function () {
      let value = '';
      console.log(this.isActive)
      if (this.isActive == 6) {
        value = "0" + this.leftType[5].list.indexOf(this.checkDataNew[0])
      } else {
        value = this.checkDataNew.join(",");
      }
      console.log(value)
      let prams = { year: this.years, queryType: this.isActive, value: value };
      doQuery(prams).then(res => {
        this.tabData = Object.assign(this.tabData, res.result)
        this.tabData2 = Object.assign(this.tabData2, res.result)
        this.fiterData()
      }).catch(err => {
        console.log(err)
      })
    },
    //取消
    cancel: function () {
      this.checkData = this.checkDataNew
      this.checkData = this.checkDataNew
      this.isShow = false
    },
    //确认
    confirm: function () {
      this.checkDataNew = this.checkData
      this.checkDataNew = this.checkData
      this.isShow = false
      this.doQuery()
    },
    //选择类型
    selectType: function (item) {
      this.checkData = []
      this.isActive = item.queryType
    },
    selectValue: function (item) {
      if (this.isActive < 3) {
        let key = this.checkData.indexOf(item)
        if (key >= 0) {
          console.log(key)
          this.checkData.splice(key, 1)
          console.log(this.checkData)
        } else {
          if (this.checkData.length >= 3) {
            uni.showToast({
              title: '最多选择三个选项',
              duration: 2000,
              icon: "none"
            })
            return false
          }
          this.checkData.push(item)
        }
      } else {
        this.checkData = []
        this.checkData.push(item)
      }
      console.log(this.checkData)
    },
    //获得类名
    GetKey: function (value) {
      if (value.right == 1) {
        let color = this.colorList[0];
        if (this.checkData.length > 0) {
          let key = this.checkData.indexOf(value.value)
          color = color + " " + this.colorList[key]
        }
        return color
      } else {
        return ''
      }
    },
    checkBox: function () {
      this.selfChecked = !this.selfChecked
      this.fiterData()
    },
    fiterData: function () {
      let tableData = []
      if (this.selfChecked == true) {
        this.tabData.rols.forEach((item, index) => {
          for (let key in item) {
            if (item[key].right == 1) {
              tableData.push(item)
              break
            }
          }
        })
        this.tabData.rols = tableData
      } else {
        console.log(1111)
        this.tabData = Object.assign({}, this.tabData2)
      }
      this.$nextTick(function () {
        this.fnLineChart()
      })
    },
    //画线函数
    fnLineChart: function () {
      console.log("test:", document);
      let linDots = document.querySelectorAll(".line");
      console.log("linDots:", linDots);
      linDots.forEach((ele, index) => {
        ele.remove(ele)
      })
      if (this.isActive == 1 && this.checkData.length <= 1) {
        let eleDots = document.querySelectorAll(".redcolor");
        //console.log(eleDots)
        eleDots.forEach((ele, index) => {
          let eleNext = eleDots[index - 1];
          if (!eleNext) {
            return;
          }
          var eleLine = ele.querySelector("i");
          if (!eleLine) {
            eleLine = document.createElement("i");
            eleLine.class = "line";
            eleLine.setAttribute("class", "line");
            ele.appendChild(eleLine);
          }
          // 记录坐标
          var boundThis = ele.getBoundingClientRect();
          // 下一个点的坐标
          var boundNext = eleNext.getBoundingClientRect();
          // 计算长度和旋转角度
          var x1 = boundThis.left,
            y1 = boundThis.top;
          var x2 = boundNext.left,
            y2 = boundNext.top;
          // 长度
          var distance = Math.sqrt(
            (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1),
          );
          // 弧度
          var radius = Math.atan2(y2 - y1, x2 - x1);
          //console.warn(radius, "角度");
          // 设置线条样式
          eleLine.style.width = distance + "px";
          eleLine.style.transform = `rotate(${radius}rad)`;
        });
      }
    }
  }
}
</script>

<style scoped>
.tab-wrap {
  display: flex;
  text-align: center;
  height: 50px;
  line-height: 50px;
  position: fixed;
  top: 45px;
  width: 100%;
  border-bottom: 1px solid #b8b8b8;
  z-index: 1;
  max-width: 480px;
  background: #fff;
}

.tab-wrap .tab-item {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.sel-type {
  position: fixed;
  background: rgba(0, 0, 0, .3);
  min-height: calc(var(--vh) - 1rem);
  width: 100%;
  max-width: 480px;
  z-index: 2;
}

.sel-type .sel-type-body {
  height: 235px;
  background: #fff;
}

.sel-type .sel-type-body>uni-view:first-of-type {
  padding-left: 46px;
}

.sel-type .sel-type-body>uni-view:nth-of-type(2) {
  padding-left: 32px;
  border-left: 1px solid #b8b8b8;
}

.sel-type .sel-type-body>uni-view {
  float: left;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 6px 15px 6px 0;
  line-height: 37px;
  overflow-y: auto;
  color: #333;
  font-size: 16px;
}

.sel-type .btn-wrap {
  display: flex;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #b8b8b8;
  z-index: 1;
  background: #fff;
}

.sel-type .btn-wrap>uni-view {
  flex: 1;
  font-size: 18px;
  color: #333;
}

.sel-type .active {
  color: #07c160 !important;
}

.label-qs {
  line-height: 30px;
  padding-top: 10px;
  padding: 10rpx 6px 3px;
  box-sizing: border-box;
  background: #fff;
}

.label-qs input {
  position: relative;
  float: left;
  height: 24px;
  width: 24px;
  margin: 0;
}

.label-qs .to-notice {
  float: right;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  border-radius: 50%;
  color: #333;
  border: 1px solid #333;
  margin-top: 3px;
}

table {
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  text-align: center;
}

table th {
  font-weight: 400;
  color: #fff;
  font-size: 12px;
  background: #a96223;
}

table tr:nth-of-type(2n) {
  background: #f8f8f8;
}

table tr {
  line-height: 31px;
}

table>tr {
  vertical-align: middle;
}

table tr td {
  border: 1px solid #e1e1e1;
}

table tr .redcolor {
  background: red;
  color: #fff;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  text-align: center;
  line-height: 22px;
  margin: 0 auto;
}

table tr .redcolor.green {
  background: green;
}

table tr .redcolor.blue {
  background: #00f;
}
</style>
