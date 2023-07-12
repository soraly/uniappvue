<template>
  <view class="pact">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="title">平台游戏规则须知</view>
    <view class="content">
      <text>
        1.本平台所模拟的彩票游戏玩法来源，均为经国家财政部
        批准发行的彩票品种。本平台所显示的日期与时间均为北
        京时间，彩票游戏的投注时间以本平台服务系统的服务器
        为主。
        2.本平台的金币，为虚拟游戏币，获取方式以系统每天赠
        送为主。本平台金币不进行任何的充值、兑换、交易操
        作。
        3.根据国家规定，禁止未满20周岁（未成眠）者利用本平
        台进行彩票模拟游戏。同时，不提倡学生进行彩票模拟游
        戏，其中包括在校大学生。
        4.本平台不收取任何形式的服务费。
        5.本平台模拟的彩票游戏，每期彩票开奖完成后，将公布
        开奖号码情况。本平台不对开奖号码的准确性、完整性、
        及时性承担任何明示或默认的担保责任。
      </text>
    </view>
    <view class="title">有关责任和争端处理</view>
    <view class="desc">发生下列情况本平台不予承担任何法律责任</view>
    <view class="content">
      <text>
        1.由于用户将密码告知他人或与他人共享账号，由此导致
        的任何事件。
        2.由于本平台连接的其他网站所造成的个人资料泄露及由
        此导致的任何争议和后果。
        3.由于彩票中心在彩票销售过程中，临时更改玩法造成的
        模拟游戏投注失败的。
        4.本平台定期检查，或更新软硬件而造成服务器中断；突
        发性的软硬件设备与电子通信设备故障产生的纠纷。
        5.任何由于黑客攻击、计算机病毒侵入或发作、网络供应
        商原因、因国家管制而造成的暂时性关闭等影响网络正常
        运营之不可抗力而造成的个人资料或游戏模拟投注指令泄
        露、丢失、被盗用、被繤改或网络线路中断等，由此产生
        的纠纷。
        6.非本平台自身原因造成的，模拟彩票游戏未能成功投
        注、兑奖等，如国家法律规定、规章要求。
        7.本平台有权对本规则进行调整或补充，并不另行通知公
        告、若用户继续使用本平台服务，则视为已阅读并接受该
        等调整或补充，如不同意，则用户须主动终止使用本平台
        服务。
        8.本平台任何赠送金币，官方活动均与苹果公司无关。
      </text>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "pact",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "平台服务申请",
      headerStyle: {
        backgroundColor: "#03536E"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.pact {
  height: var(--vh);
  background: #ffffff;
  font-family: 'PingFang SC';

  .title {
    font-weight: 400;
    font-size: 32rpx;
    text-align: center;
    color: #222222;
    padding: 25rpx 0;
  }

  .desc {
    font-weight: 400;
    font-size: 26rpx;
    line-height: 36rpx;
    text-align: center;
    color: #CC3333;
    padding-bottom: 35rpx;
  }

  .content {
    font-family: PingFang SC;
    font-size: 26rpx;
    font-weight: 400;
    text-align: left;
    padding: 0 44rpx;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    background: #FFFFFF;
    font-weight: 400;
    font-size: 26rpx;
    line-height: 36rpx;
    color: #999999;
  }

  .content:last-child {
    padding-bottom: 100rpx;
  }
}
</style>