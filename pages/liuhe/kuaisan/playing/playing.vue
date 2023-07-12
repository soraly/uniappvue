<template>
  <scroll-view scroll-y="true" class="zheng-ma-one-six">
    <view v-if="playData.code === 'ksbth' || playData.code === 'ksbrx' || playData.code === 'ksbdt'">
      <view class="tab">
        <view :class="currentType == item.id ? 'tab-item active' : 'tab-item'" v-for="item in playData.children"
          @click="onSelectedType(item)" :key="item.id">
          {{ item.name }}
        </view>
      </view>
      <view class="balls" v-if="ballList.length">
        <view v-for="(item, index) in ballList" :key="item.id">
          <view v-if="item.showType == 4">
            <view class="type-name">
              {{ item.name }}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
            </view>
            <ball :missOrMatch="missOrMatch" ref="ball" :ball="item" :ball-children="item.children"
              @changeData="changeChildren" />
          </view>
          <view v-if="item.showType == 2">
            <view class="type-name">
              {{ item.name }}
              <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
            </view>
            <text-ball :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index"
              @changeData="changeChildren"></text-ball>
          </view>
        </view>
      </view>
    </view>
    <view class="content-list" v-else>
      <view class="tab-item" v-for="data in playData.children" :key="data.id">
        <view class="balls">
          <view v-for="(item, index) in data.children" :key="item.id">
            <view v-if="item.showType == 4">
              <view class="type-name">
                {{ item.name }}
                <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
              </view>
              <ball :missOrMatch="missOrMatch" ref="ball" :ball="item" :ball-children="item.children"
                @changeData="changeChildren" />
            </view>
            <view v-if="item.showType == 2">
              <view class="type-name">
                {{ item.name }}
                <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
              </view>
              <text-ball :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index"
                @changeData="changeChildren"></text-ball>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import Ball from "./ball";
import TextBall from "./text-ball";
import _default, { mapGetters } from 'vuex';
import Playing from "../../../../utils/common/playing";
export default {
  name: "index",
  props: {
    playData: {
      default: {},
      type: Object
    },
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  components: {
    Ball,
    TextBall
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  data() {
    return {
      currentType: 2,
      currentName: "",
      zodiac: null,
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types: [],
      playing: new Playing(),
      ballList: [],
      helpStr: "",
      tipsStr: "",
      exampleStr: "",
      ballSelects: [],//选择后球的id集合
      currentBallChildren: [],//合并1-6的每种球
      currentBall: [],//单选点击每种球详情的集合
      ball: {},
      mapBallIDToInfo: {},//梳理出来的{ "id":{xxx} }
      gameSelectedTypeMap: {},//当前已选号码类型编码 例：二同号 同号选中1个 复选选中2个 {ksbthethdxth:1,ksbthethfx:2} 方便后续下注栏显示逻辑调整
      gameTypeCodeTongHaoErTong: "ksbthethdxth",//二同号 同号
      gameTypeCodeTongHaoErButong: "ksbthethdxbth",//二同号 不同号
      gameTypeCodeTongHaoErFuxuan: "ksbthethfx",//二同号 复选
      gameTypeCodeTongHaoEr: `ksbthethdxth,ksbthethdxbth,ksbthethfx`,//二同号集合
      gameTypeCodeTongHaoSAN: "ksbthsthdx",//三同号

      gameTypeCodeDanTuoDMSBT: "ksbdtsbthdm",
      gameTypeCodeDanTuoTMSBT: "ksbdtsbthtm",

      currentDanArr: [],//已选胆码集合，length不大于2
      currentTuoArr: [],//已选拖码集合，length不大于5

      currentDanIds: [],//已选胆码ids
      currentTuoIds: [],//已选拖码ids

      currentOtherBallSelects: [],//除特殊选择外的球选择
    }
  },
  watch: {
    playData(oldV, newV) {
      if (this.playData.code === 'ksbth' || this.playData.code === 'ksbrx' || this.playData.code === 'ksbdt') {
        this.onSelectedType(this.playData.children[0])
      }
    },
    orderList() {
      if (this.orderList.length === 0) {
        this.reset()
      }
    }
  },
  mounted() {
    // console.log(">>>>>>>>>>>>>>",this.playData)
    if (this.playData.code === 'ksbth' || this.playData.code === 'ksbrx' || this.playData.code === 'ksbdt') {
      this.onSelectedType(this.playData.children[0])
    }
  },
  methods: {
    onSelectedType(item) {
      console.log(item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.helpStr = item.children[0].helpStr;
      this.tipsStr = item.children[0].tipsStr;
      this.exampleStr = item.children[0].exampleStr;
      this.ball = item.children[0];
      this.ballList = item.children;
      this.$store.dispatch('setOrderList', [])
      this.ballSelects = [];//选择后球的id集合
      this.currentBallChildren = [];//合并当前页面做所有球的集合
      this.currentOtherBallSelects = [];
      this.currentBall = [];
      this.currentDanArr = [],//已选胆码集合，length不大于2
        this.currentTuoArr = [],//已选拖码集合，length不大于5

        this.currentDanIds = [],//已选胆码ids
        this.currentTuoIds = [],//已选拖码ids
        this.resetDataType();
      this.$emit('onSelectedType');
      this.freshChildMap();
    },

    freshChildMap() {
      let _this = this;
      this.mapBallIDToInfo = {};
      console.log("freshChildMap", this.ballList)
      for (let cindex in this.ballList) {
        let gameTypeCode = this.ballList[cindex].code;
        // 将玩法对象拷贝到child里面去 ，要用拷贝 哪里有程序使用了深度检测状态更新 20230621 新增
        // 复制并且移除children 才能避免过多循环影响效率
        let playInfo=Object.assign({},this.ballList[cindex]);
        delete playInfo.children;
        this.ballList[cindex].children.forEach((item) => {
          item.groupIndex = cindex;
          item.gameTypeCode = gameTypeCode;
          item.playInfo=playInfo;
          _this.mapBallIDToInfo[item.id] = item;
        })
      }
    },

    resetDataType() {
      if (this.ballList.length === 2) {
        this.setIndexToItem(this.ballList[0].children, 0);
        this.setIndexToItem(this.ballList[1].children, 1);
      } else if (this.ballList.length === 3) {
        this.setIndexToItem(this.ballList[0].children, 0);
        this.setIndexToItem(this.ballList[1].children, 1);
        this.setIndexToItem(this.ballList[2].children, 2);
      }
      console.log("ballList:::", this.ballList)
    },
    setIndexToItem(arr, key) {
      arr.forEach(item => {
        item.dataType = key;
      })
    },
    reset() {
      this.currentOtherBallSelects = [];
      this.ballSelects = [],//选择后球的id集合
        this.currentBallChildren = [],//合并1-6的每种球
        this.currentBall = [],
        this.currentDanArr = [],//已选胆码集合，length不大于2
        this.currentTuoArr = [],//已选拖码集合，length不大于5

        this.currentDanIds = [],//已选胆码ids
        this.currentTuoIds = []//已选拖码ids
    },
    setColorToNum(list, colorList) {
      let newList = list.filter(item =>
        colorList.some(i => item.name == i.number)
      )
    },
    selectZodiacList(item) {
      this.zodiac = item.name;
    },
    showTabRule() {
      this.$emit('open', {
        exampleStr: this.exampleStr,
        helpStr: this.helpStr,
        tipsStr: this.tipsStr,
      })
    },
    showRule(item) {
      this.$emit('open', item)
    },
    onSeletedOne(num) {
      this.$refs.ball[num].onClickItem(num)
    },

    //将currentBall中选择的球区分，用于计算注数
    splitArrayByDataIndex(arr) {
      const result = [[], [], []];
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (obj.dataType === 0) {
          result[0].push(obj);
        } else if (obj.dataType === 1) {
          result[1].push(obj);
        } else if (obj.dataType === 2) {
          result[2].push(obj);
        }
      }
      return result;
    },
    changeChildren(dataObj) {
      console.log("changeChildren", dataObj);
      console.log(this.playData.code);
      if (this.playData.code === 'ksbth') {//当类型为同号
        this.changeChildrenOfTonHao(dataObj);
      } else if (this.playData.code === 'ksbdt') {//胆拖
        this.changeChildrenOfDantuo(dataObj)
      }
      else if (this.playData.code === 'ksbrx') {//任选类型
        let { ballChildren, dataIndex, selectedIds, ball } = dataObj;
        let orderList = this.playing.setOrders(ball, selectedIds);
        this.$store.dispatch('setOrderList', orderList).then(() => {
        })
      } else {
        this.changeChildrenOfOther(dataObj);
      }
      this.caculationTypeSelectCount();
      if (!this.checkShowBuyBoxBySelectMap()) {
        this.showCantDoOrderMessage();
      }

      this.$emit("selectedBall", dataObj)
    },

    /**
     * 动态生成此统计对象
     * gameSelectedTypeMap:{},//当前已选号码类型编码 例：二同号 同号选中1个 复选选中2个 {ksbthethdxth:1,ksbthethfx:2} 方便后续下注栏显示逻辑调整
     **/
    caculationTypeSelectCount() {
      let _this = this;
      this.gameSelectedTypeMap = {};
      this.ballSelects.forEach((ballId) => {
        let ballInfo = _this.mapBallIDToInfo[ballId];
        if (ballInfo) {
          let ballGameTypeCode = ballInfo.gameTypeCode;
          if (!_this.gameSelectedTypeMap[ballGameTypeCode]) _this.gameSelectedTypeMap[ballGameTypeCode] = 0;
          _this.gameSelectedTypeMap[ballGameTypeCode] += 1;
        }
      })
    },

    /**
     *  检测是否显示界面下方订菜单
     * */
    checkShowBuyBoxBySelectMap() {
      //TODO 此处补充显示菜单逻辑 显示返回true 不显示返回false


    },
    /**
     * 补充不同条件下无法出现下单菜单的原因提示
     * */
    showCantDoOrderMessage() {

    },

    /**
     * 处理二同号
     * @param {*} dataObj 
     */
    setTwoNum(dataObj){
      let _this=this;
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      this.currentBall = this.removeSelectSameCodeOfTonHao(this.currentBall, ballItem);
      let ids = [];
      this.currentBall.forEach(item => {
        let itemId = item.id;
        if (ids.indexOf(itemId) == -1) ids.push(itemId);
      });
      console.log("ids", this.ball, ids,this.currentBall);
      //let typeArr = this.splitArrayByDataIndex(this.currentBall);
      let selectedTonghao=[];//单选同号
      let selectedButonghao=[];//单选不同号
      let selectedFuxuan=[];//复选
      let tonghaoSelected = {
        tonghao:[],
        butonghao:[],
        fuxuan:[]
      }
      this.currentBall.forEach(ballInfo=>{
        if(ballInfo.gameTypeCode==_this.gameTypeCodeTongHaoErTong){
          selectedTonghao.push(ballInfo.id);
          tonghaoSelected.tonghao.push(ballInfo);
        }else if(ballInfo.gameTypeCode==_this.gameTypeCodeTongHaoErButong){
          selectedButonghao.push(ballInfo.id);
          tonghaoSelected.butonghao.push(ballInfo);
        }else if(ballInfo.gameTypeCode==_this.gameTypeCodeTongHaoErFuxuan){
          selectedFuxuan.push(ballInfo.id);
          tonghaoSelected.fuxuan.push(ballInfo);
        }
      })

      let orders = [];
      //  这里是同号和不同号组合订单
      let tongHaoMergeButong=selectedTonghao.concat(selectedButonghao);

      // 这里应该有判断逻辑 如果只选中某一个类型 胆选拖未选的情况是否不计入订单
      if(tongHaoMergeButong.length>0){
        let names=[];
        tongHaoMergeButong.forEach((id)=>{
          let ballInfo=_this.mapBallIDToInfo[id];
          //去重 可以自行选择 或者判断其它名称
          if(names.indexOf(ballInfo.playInfo.name)==-1)
           names.push(ballInfo.playInfo.name);
        })

        orders.push({
          "content": tongHaoMergeButong.join(","),
          //多条件下使用ball是错的 ball只是最后一次点击的类型
          "methodName": names.join("|"),
          "mode": 1,
          "chaseNum": 0,
          "chaseStop": 1,
          "playId": tongHaoMergeButong[0],
          "rebatePoint": 0,
          "stakeCount": selectedTonghao.length * selectedButonghao.length,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": ball.code,
          "tonghaoSelected": tonghaoSelected
        })
      }
      if(selectedFuxuan.length>0){
        selectedFuxuan.forEach(fxId=>{
          let fuxuanBall=this.mapBallIDToInfo[fxId];
          orders.push({
            "methodName":fuxuanBall.playInfo.name,
            "content":"",
            "mode": 1,
            "chaseNum": 0,
            "chaseStop": 1,
            "playId": fxId, //selectedIds[0],//我不确定这个是啥意思
            "rebatePoint": 0,
            "stakeCount": 1,
            "totalPrice": 0,
            "unitPrice": 0,
            "code": fuxuanBall.code //ball.code,
          })
        })
      }

      let orderList = orders;
      this.$store.dispatch('setOrderList', orderList).then(() => {
        // console.log(orderList, this.orderList)
      })
    },
    
    /**
     * 处理同号选择
     * "ksbthsthdx"三同号
     * "ksbthethdxth"二同号
     * @param dataObj
     */
    changeChildrenOfTonHao(dataObj) {
      if(this.ball.code === "ksbthethdxth"){
        this.setTwoNum(dataObj);
      }else{
        this.changeChildrenOfOther(dataObj);
      }
    },

    /**
     * 处理胆拖选择
     * @param dataObj
     */
    changeChildrenOfDantuo(dataObj) {
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      let clickBallCode = ballItem.code;
      let _this = this;
      //TODO 建议此部分单独封装 freshDanTuoArrays(); 刷新胆拖各自array逻辑块
      if (ballItem.dataType === 0) {
        this.currentDanIds = selectedIds;
        if (this.currentDanArr.indexOf(ballItem) == -1) {
          this.currentDanArr = this.pushObject(this.currentDanArr, ballItem, ballItem.gameTypeCode == this.gameTypeCodeDanTuoDMSBT ? 2 : 1);
        } else {
          this.currentDanArr.splice(this.currentDanArr.indexOf(ballItem), 1);
        }
      } else {
        this.currentTuoIds = selectedIds;
        if (this.currentTuoArr.indexOf(ballItem) == -1) {
          this.currentTuoArr = this.pushObject(this.currentTuoArr, ballItem, 5);
        } else {
          this.currentTuoArr.splice(this.currentTuoArr.indexOf(ballItem), 1);
        }
      }


      let ids = [];//TODO 建议此部分单独封装 ids= this.caculationSelectIdsByDanTuoArrays();
      let danIds = [];
      let tuoIds = [];
      // 起始区域 构建selectedids
      this.currentDanArr.forEach(item => {
        let itemId = item.id;
        if (ids.indexOf(itemId) == -1) ids.push(itemId);
        if (danIds.indexOf(itemId) == -1) danIds.push(itemId);
      });
      this.currentTuoArr.forEach(item => {
        let itemId = item.id;
        if (ids.indexOf(itemId) == -1) ids.push(itemId);
        if (tuoIds.indexOf(itemId) == -1) tuoIds.push(itemId);
      });
      console.log("dantuo:", this.currentDanArr,this.currentTuoArr)
      //移除重复code  以及对应currentTuoArr currentTuoArr 中对象，不然会有BUG
      ids.forEach((selectedId) => {
        let selectedBallInfo = _this.mapBallIDToInfo[selectedId];
        if (selectedBallInfo.code == clickBallCode && selectedId != ballItem.id) {//需要移除 同CODE 不同id的选中元素
          ids.splice(ids.indexOf(selectedId), 1);
          //移除 currentDanArr 中所有已不再ids中的元素
          _this.currentDanArr = _this.currentDanArr.filter((fb01) => {
            return ids.indexOf(fb01.id) != -1;
          })
          //移除 currentTuoArr 中所有已不再ids中的元素
          _this.currentTuoArr = _this.currentTuoArr.filter((fb02) => {
            return ids.indexOf(fb02.id) != -1;
          })
        }
      });
      let stakeCount = 0;

      if (this.ball.code === "ksbdtsbthdm") {
        if (this.currentDanArr.length === 1 && this.currentTuoArr.length > 1) {
          stakeCount = this.playing.setNum(this.currentTuoArr.length, 2);
        } else if (this.currentDanArr.length === 2 && this.currentTuoArr.length > 0) {
          stakeCount = this.playing.setNum(this.currentTuoArr.length, 1);
        }
      } else {
        if (this.currentDanArr.length === 1 && this.currentTuoArr.length > 0) {
          stakeCount = this.playing.setNum(this.currentTuoArr.length, 1);
        } else {
          stakeCount = 0;
        }
      }

      console.log("stakeCount", stakeCount)
      // 结束
      console.log("ids", this.currentDanIds)
      let typeArr = this.splitArrayByDataIndex(this.currentBall);
      let orders = [];
      orders.push({
        "content": ids.join(','),
        "dantuo":{
          dan:this.currentDanArr,
          tuo:this.currentTuoArr,
        },
        "methodName": this.currentName,
        "mode": 1,
        "chaseNum": 0,
        "chaseStop": 1,
        "playId": ids[0],
        "rebatePoint": 0,
        "stakeCount": stakeCount,
        "totalPrice": 0,
        "unitPrice": 0,
        "code": ball.code,
      })
      let orderList = orders;
      this.$store.dispatch('setOrderList', orderList).then(() => {
        // console.log(orderList, this.orderList)
      })
    },

    /**
     * 控制胆码每次最多选中2个
     * 拖码每次最多5个
     * @param {*} array 
     * @param {*} obj 
     */
    pushObject(array, obj, len) {
      // 如果数组长度小于2，则直接将对象添加到数组末尾
      if (array.length < len) {
        array.push(obj);
      }
      // 否则替换数组中的第一个对象
      else {
        array[0] = obj;
      }
      /**
        * 移除重复
        */
      array = array.filter((ballInfoItem) => {
        return array.indexOf(ballInfoItem.id) == -1;
      })
      return array;
    },

    //处理二同号玩法逻辑
    removeSelectSameCodeOfTonHao(arr, newObj) {
      console.log("removeSelectSameCodeOfTonHao-----------")
      if (this.gameTypeCodeTongHaoEr.indexOf(newObj.gameTypeCode) != -1) {
        let newBallInfoCode = newObj.code;
        let ballFirstCode = newBallInfoCode[0];
        let removeIds = [];
        console.log(newBallInfoCode);
        /**
         * 如果新选中的对象 不是star
         * 则进入移除同号段判断
         */
        if (newBallInfoCode.indexOf("*") == -1 && newBallInfoCode.indexOf('\u002A') == -1) {
          arr.forEach((arrBallInfo) => {
            let checkCode = arrBallInfo.code;
            //使用转移 避免IOS 部分设备星号出问题
            if (newBallInfoCode == checkCode) return;
            if (checkCode.indexOf("*") != -1 || checkCode.indexOf('\u002A') != -1) return;
            if (checkCode.indexOf(ballFirstCode) != -1) {
              removeIds.push(arrBallInfo.id)
            }
          });
        }
        /**
         * 移除重复
         */
        arr = arr.filter((ballInfoItem) => {
          return removeIds.indexOf(ballInfoItem.id) == -1;
        })
      }
      if (arr.indexOf(newObj) == -1) arr.push(newObj);
      else arr.splice(arr.indexOf(newObj), 1);
      return arr;
    },

    /**
     * 处理其它号码选择
     * @param dataObj
     */
    changeChildrenOfOther(dataObj) {
      /**
      * ball是2级，是ballItem的上一级
      * ballItem是3级，就是每个球的Item。
      */
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      ballItem.parentsName = ball.name;
      this.currentOtherBallSelects = this.pushObjectToArray(this.currentOtherBallSelects, ballItem);
      // console.log("currentOtherBallSelects", ball, this.currentOtherBallSelects)
      let orderList = [];
      this.currentOtherBallSelects.forEach(item => {
        let obj = {
          "content": "",
          "methodName": item.parentsName,
          "name": item.name,
          "mode": 1,
          "chaseNum": 3,
          "chaseStop": 0,
          "playId": item.id,
          "rebatePoint": 0,
          "stakeCount": 1,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": item.code,
        }
        orderList.push(obj)
      })
      this.$store.dispatch('setOrderList', orderList).then(() => {
        console.log("已经存入store")
      })
    },
    //讲对象push到数组
    pushObjectToArray(array, object) {
      if (array.length === 0) {
        array.push(object);
      } else {
        // 检查是否存在相同 id 的对象
        const existingObjectIndex = array.findIndex((item) => item.id === object.id);

        if (existingObjectIndex !== -1) {
          // 如果存在相同 id 的对象，从数组中删除它
          array.splice(existingObjectIndex, 1);
        } else {
          // 将新对象添加到数组
          array.push(object);
        }
      }
      return array;
    },
  },
}
</script>

<style lang="scss" scoped>
.zheng-ma-one-six {
  height: 100%;

  .tab {
    display: flex;
    white-space: nowrap;
    width: 100%;

    .tab-item {
      width: 50%;
      text-align: center;
      height: 56rpx;
      display: inline-block;
      line-height: 56rpx;
      background: #CCDBEE;
      border-width: 0px 1rpx 2rpx 1rpx;
      border-style: solid;
      border-color: #B5D4E6;
      /*box-shadow: inset 0px 4rpx 4rpx #FFFFFF;*/
      color: #458198;
      font-size: 30rpx;
    }

    .tab-item.active {
      background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
      color: #BAE8FA;
      border-width: 0 0 2rpx 2rpx;
      border-style: solid;
      border-color: #B5D4E6;
      box-shadow: inset 0 3rpx 2rpx rgba(0, 0, 0, 0.5);
    }
  }

  .type-name {
    height: 70rpx;
    line-height: 70rpx;
    color: #8CB2C9;
    font-size: 34rpx;
    text-align: center;
    background: #CCDBEE;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 2rpx 2rpx #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 34rpx;
      height: 34rpx;
      margin-left: 22rpx;
    }
  }

  .content-list {
    .tab-item {
      .balls {
        .type-name {
          height: 70rpx;
          line-height: 70rpx;
          color: #8CB2C9;
          font-size: 34rpx;
          text-align: center;
          background: #CCDBEE;
          border: 1rpx solid #B5D4E6;
          box-shadow: inset 0px 2rpx 2rpx #CCCCCC;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 34rpx;
            height: 34rpx;
            margin-left: 22rpx;
          }
        }
      }
    }
  }



}
</style>
