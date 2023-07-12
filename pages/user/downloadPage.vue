<template>
  <view class="body_view">
    <view class="header_title clearfix">
      <text class="logo fl" href="javascript:void();">
        <image mode="widthFix" :src="detailLogo" />
      </text>
      <uni-link class="download" :href="downloadUrl" showUnderLine="false">
        <text class="download-icon"></text>
      </uni-link>
    </view>
    <view class="content_view">
      <view class="title_tips_text m_show">线路入口</view>
      <view class="xianlu">
        <view class="clearfix">
          <uni-link color="#07c160" class="xianlu_item j_xl_1 ml" :href="url1" text="线路入口一" showUnderLine="false">
            <view class="text">线路入口一</view>
            <view class="icon m_show"></view>
          </uni-link>
          <uni-link color="#07c160" class="xianlu_item j_xl_2" :href="url2" showUnderLine="false">
            <view class="text">线路入口二</view>
            <view class="icon m_show"></view>
          </uni-link>
          <uni-link color="#07c160" class="xianlu_item j_xl_3" :href="url3" showUnderLine="false">
            <view class="text">线路入口三</view>
            <view class="icon m_show"></view>
          </uni-link>
          <view class="fore-five">
            <uni-link class="az" target="_blank" :href="android" showUnderLine="false">
              <view class="down">
                <image src="https://www.49tk5.com/images/android.png" />
                <view>安卓版本</view>
                <view>6.0.6</view>
              </view>
            </uni-link>
            <uni-link class="ios" target="_blank" :href="ios" showUnderLine="false">
              <view class="down">
                <image src="https://www.49tk5.com/images/ios.png" />
                <view>苹果版本</view>
                <view>1.0.0</view>
              </view>
            </uni-link>
          </view>
        </view>
      </view>
      <view class="commonlyUsed_title clearfix m_show">
        <view :class="current === 0 ? 'used_title_item select' : 'used_title_item'" @click="onSelect(0)">常用网址</view>
        <view :class="current === 1 ? 'used_title_item select' : 'used_title_item'" @click="onSelect(1)">常用银行</view>
        <view :class="current === 2 ? 'used_title_item select' : 'used_title_item'" @click="onSelect(2)">常用购物</view>
        <view :class="current === 3 ? 'used_title_item select' : 'used_title_item'" style="border: none;"
          @click="onSelect(3)">常用资讯</view>
      </view>
      <view class="commonlyUsed" v-if="current === 0">
        <view class="box">
          <uni-grid class="used_item" :column="4" :showBorder="false" :square="false">
            <uni-grid-item class="address_item" v-for="(item, index) in webSites" :key="index">
              <image class="logo" :src="item.imgPath" mode="widthFix" />
              <uni-link :href="item.url" :text="item.name" showUnderLine="false"></uni-link>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
      <view class="commonlyUsed" v-if="current === 1">
        <view class="box">
          <uni-grid class="used_item" :column="4" :showBorder="false" :square="false">
            <uni-grid-item class="address_item" v-for="(item, index) in banks" :key="index">
              <image class="logo" :src="item.imgPath" mode="widthFix" />
              <uni-link :href="item.url" :text="item.name" showUnderLine="false"></uni-link>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
      <view class="commonlyUsed" v-if="current === 2">
        <view class="box">
          <uni-grid class="used_item" :column="4" :showBorder="false" :square="false">
            <uni-grid-item class="address_item" v-for="(item, index) in webs" :key="index">
              <image class="logo" :src="item.imgPath" mode="widthFix" />
              <uni-link :href="item.url" :text="item.name" showUnderLine="false"></uni-link>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
      <view class="commonlyUsed" v-if="current === 3">
        <view class="box">
          <uni-grid class="used_item" :column="4" :showBorder="false" :square="false">
            <uni-grid-item class="address_item" v-for="(item, index) in news" :key="index">
              <image class="logo" :src="item.imgPath" mode="widthFix" />
              <uni-link :href="item.url" :text="item.name" showUnderLine="false"></uni-link>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { aboutUs } from "../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "downloadPage",
  components: {
    AlertInjectLayer, UniCol, UniRow
  },
  data() {
    return {
      detailLogo: '../../static/img/user/Frame.png',
      current: 0,
      downloadUrl: "",
      url1: "",
      url2: "",
      url3: "",
      android: "",
      ios: "",
      webSites: [
        {
          imgPath: "https://www.49tk5.com/images/1.png",
          url: "https://www.baidu.com/",
          name: "百度"
        },
        {
          imgPath: "https://www.49tk5.com/images/2.png",
          url: "https://www.qq.com/",
          name: "腾讯"
        },
        {
          imgPath: "https://www.49tk5.com/images/3.png",
          url: "https://www.ifeng.com/",
          name: "凤凰网"
        },
        {
          imgPath: "https://www.49tk5.com/images/4.png",
          url: "https://www.sohu.com/",
          name: "搜狐"
        },
        {
          imgPath: "https://www.49tk5.com/images/5.png",
          url: "https://www.163.com/",
          name: "网易"
        },
        {
          imgPath: "https://www.49tk5.com/images/6.png",
          url: "https://www.youku.com/",
          name: "优酷"
        },
        {
          imgPath: "https://www.49tk5.com/images/7.png",
          url: "https://www.jd.com/",
          name: "京东商城"
        },
        {
          imgPath: "https://www.49tk5.com/images/8.png",
          url: "https://www.12306.cn/",
          name: "12306"
        },
        {
          imgPath: "https://www.49tk5.com/images/9.png",
          url: "https://gz.58.com/",
          name: "58同城"
        },
        {
          imgPath: "https://www.49tk5.com/images/10.png",
          url: "https://www.ctrip.com/",
          name: "携程网"
        }
      ],
      banks: [
        {
          imgPath: "https://www.49tk5.com/images/11.png",
          url: "http://www.icbc.com.cn/icbc/",
          name: "工商银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/12.png",
          url: "https://www.boc.cn/",
          name: "中国银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/13.png",
          url: "https://www.ccb.com/",
          name: "建设银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/14.png",
          url: "https://www.abchina.com/",
          name: "农业银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/15.png",
          url: "https://www.psbc.com/",
          name: "邮政储蓄"
        },
        {
          imgPath: "https://www.49tk5.com/images/16.png",
          url: "https://market.cmbchina.com/",
          name: "招商银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/17.png",
          url: "https://www.cebbank.com/",
          name: "光大银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/18.png",
          url: "https://www.cib.com.cn/",
          name: "兴业银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/19.png",
          url: "https://www.bankcomm.com/",
          name: "交通银行"
        },
        {
          imgPath: "https://www.49tk5.com/images/20.png",
          url: "https://www.cgbchina.com/",
          name: "广发银行"
        }
      ],
      webs: [
        {
          imgPath: "https://www.49tk5.com/images/21.png",
          url: "https://www.taobao.com/",
          name: "淘宝"
        },
        {
          imgPath: "https://www.49tk5.com/images/22.png",
          url: "https://www.jd.com/",
          name: "京东商城"
        },
        {
          imgPath: "https://www.49tk5.com/images/23.png",
          url: "https://www.tmall.com/",
          name: "天猫精选"
        },
        {
          imgPath: "https://www.49tk5.com/images/24.png",
          url: "https://www.suning.com/",
          name: "苏宁易购"
        },
        {
          imgPath: "https://www.49tk5.com/images/25.png",
          url: "https://www.gome.com.cn/",
          name: "国美在线"
        },
        {
          imgPath: "https://www.49tk5.com/images/26.png",
          url: "http://book.dangdang.com/",
          name: "当当"
        },
        {
          imgPath: "https://www.49tk5.com/images/27.png",
          url: "https://ju.taobao.com/",
          name: "聚划算"
        },
        {
          imgPath: "https://www.49tk5.com/images/28.png",
          url: "http://www.meilishuo.com/",
          name: "美丽说"
        },
        {
          imgPath: "https://www.49tk5.com/images/29.png",
          url: "https://www.mogu.com/",
          name: "蘑菇街"
        },
        {
          imgPath: "https://www.49tk5.com/images/30.png",
          url: "https://www.vip.com/",
          name: "唯品会"
        }
      ],
      news: [
        {
          imgPath: "https://www.49tk5.com/images/31.png",
          url: "https://news.sina.com.cn/",
          name: "新浪新闻"
        },
        {
          imgPath: "https://www.49tk5.com/images/32.png",
          url: "https://news.ifeng.com/",
          name: "凤凰资讯"
        },
        {
          imgPath: "https://www.49tk5.com/images/33.png",
          url: "http://www.uzaobao.com",
          name: "联合早报"
        },
        {
          imgPath: "https://www.49tk5.com/images/34.png",
          url: "http://www.people.com.cn/",
          name: "人民网"
        },
        {
          imgPath: "https://www.49tk5.com/images/35.png",
          url: "https://news.qq.com/",
          name: "腾讯新闻"
        },
        {
          imgPath: "https://www.49tk5.com/images/36.png",
          url: "http://news.sohu.com/",
          name: "搜狐新闻"
        },
        {
          imgPath: "https://www.49tk5.com/images/37.png",
          url: "https://www.huanqiu.com/",
          name: "环球时报"
        },
        {
          imgPath: "https://www.49tk5.com/images/38.png",
          url: "https://news.163.com/",
          name: "网易新闻"
        },
        {
          imgPath: "https://www.49tk5.com/images/39.png",
          url: "http://www.xinhuanet.com/",
          name: "新华网"
        },
        {
          imgPath: "https://www.49tk5.com/images/40.png",
          url: "https://news.baidu.com/",
          name: "百度新闻"
        }
      ]
    }
  },
  onLoad() {
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 26) {
          this.detailLogo = item.url
          throw Error();
        }
      })
    } catch (err) {
      console.log(err)
    }
    this.getConfigData()
  },
  methods: {
    getConfigData() {
      aboutUs().then(res => {
        console.log(res)
        aboutUs().then(res => {
          res.result.forEach(element => {
            switch (element.type) {
              case "1":
                break;
              case "2":
                break;
              case "3":
                this.qrcodeImg = element.url
              case "4":
              case "5":
              case "6":
                this.downloadUrl = element.url
              case "11":
                this.url1 = element.url
              case "12":
                this.url2 = element.url
              case "13":
                this.url3 = element.url
              case "14":
                this.android = element.url
              case "15":
                this.ios = element.url
                break;
            }
          });
        })
      })
    },
    onSelect(key) {
      this.current = key
    }
  }
}
</script>

<style lang="scss" scoped>
.body_view {
  margin: 0 auto;

  .header_title {
    background-color: #f0fdf7;
    margin-bottom: 10px;
  }

  .header_title {
    width: 100%;
    position: relative;
    padding: 0 3%;
    box-sizing: border-box;

    .logo {
      display: block;
      width: 180px;
      float: initial;
      margin: 8px 0;
      padding: 0;

      image {
        width: 100%;
      }
    }

    .download {
      width: 215rpx;
      height: 70rpx;
      position: absolute;
      right: 22rpx;
      top: 16rpx;

      .download-icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(https://www.49tk5.com/images/download_button-icon.png);
        background-position: auto;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    .title_tips {
      box-sizing: border-box;
      position: absolute;
      right: 0;
      bottom: 18px;
      font-size: 16px;
      color: #667380;
      border: 1px dashed #667380;
      padding: 5px 10px;
      border-radius: 3px;
    }
  }

  .content_view {
    background-color: #fff;
    padding-bottom: 20rpx;

    .title_tips_text {
      padding: 30rpx;
      font-size: 36rpx;
      color: #242b33;
    }

    .m_show {
      display: block !important;
    }

    .title_tips_text {
      padding: 0 5% 30rppx;
      font-size: 36rpx;
      color: #242b33;
    }

    .xianlu {
      padding: 0 5%;
      width: 100%;
      box-sizing: border-box;

      .clearfix {
        padding: 40rpx 36rpx;
        border: 4rpx solid #07c160;
        border-style: dashed;
        border-radius: 10rpx;
      }

      .xianlu_item {
        float: left;
        display: block;
        margin-right: 40rpx;
        height: 280rpx;
        line-height: 280rpx;
        width: 20%;
        border: 1px solid #07c160;
        border-radius: 100rpx;
        box-sizing: border-box;
        text-align: center;
        font-size: 48rpx;
        color: #07c160;
        position: relative;
      }

      .xianlu_item {
        width: 100%;
        border-radius: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 40rpx;
        float: initial;
        text-align: left;
        padding: 0 40rpx;
        margin-bottom: 40rpx;

        .text {
          padding-left: 48rpx;
          background-size: 40rpx 40rpx;
          display: inline-block;
          background-image: url("");
          background-repeat: no-repeat;
          background-position: center left;
          font-size: 40rpx;
        }

        .icon {
          position: absolute;
          right: 40rpx;
          top: 50%;
          margin-top: -20rpx;
          width: 40rpx;
          height: 40rpx;
          background-image: url("https://www.49tk5.com/images/right_icon.png");
          background-repeat: no-repeat;
          background-position: center left;
          background-size: 100% 100%;
        }
      }

      .fore-five {
        display: flex;

        text {
          display: flex;
          justify-content: center;
          width: calc(50% - 20rpx);
          padding: 24rpx 0 16rpx 0;
          text-align: center;
          font-size: 40rpx;
          color: #07c160;
          border: solid 2rpx #07c160;
          box-sizing: border-box;
          border-radius: 32rpx;

          image {
            display: block;
            width: 36px;
            height: 36px;
            margin: 0 auto 4px auto;
          }
        }

        text.az {
          margin-right: 40rpx;
        }
      }
    }

    .commonlyUsed_title {
      width: 100%;
      padding: 40rpx 40rpx;
      box-sizing: border-box;
      display: flex !important;
      justify-content: space-between;

      .used_title_item {
        border-right: 1px solid #919599;
        padding-right: 40rpx;
        font-size: 28rpx;
        color: #a9abad;
        text-align: center;
        cursor: pointer;
      }

      .used_title_item:last-child {
        padding-right: 0;
      }

      .used_title_item.select {
        color: #81878d;
      }
    }

    .commonlyUsed {
      padding: 0 5%;

      .box {
        padding: 40rpx 40rpx !important;
        border: 4rpx solid #07c160 !important;
        border-style: dashed !important;
        border-radius: 10rpx !important;
        background: none !important;

        .used_item {
          .address_item {
            text-align: center;
            margin-bottom: 40rpx;

            .logo {
              width: 56rpx !important;
              margin: 0 auto;
            }
          }
        }
      }

    }
  }
}</style>
