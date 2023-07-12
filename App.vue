<script>


global.isLogin = function () {
    let token = uni.getStorageSync('token');
    if (!token) {
        return false
    } else {
        return true
    }
};
global.pop = function (msg, time = 1000) {
    uni.showToast({
        title: msg,
        duration: time,
        icon: 'none'

    })
}
global.backPage = function (backAll = false) {
    let canNavBack = getCurrentPages()
    if (canNavBack && canNavBack.length > 1) {
        uni.navigateBack({
            delta: backAll ? canNavBack.length : 1
        })
    } else {
        history.back();
    }
}
global.openUrl = function (info) {
    if (info.jumpStatus == 0) return false
    if (info.jumpType == 1) {
        uni.switchTab({
            url: info.jumpUrl
        })
        uni.navigateTo({
            url: info.jumpUrl,
            success: function (res) {
                res.eventChannel.emit('argParams', info)
            }
        })
    } else {
        //#ifdef H5
        window.open(info.jumpUrl)
        //#endif
        //#ifdef H5
        plus.runtime.openURL(info.jumpUrl);//成功跳转了
        //#endif
    }
}
import { configs, websiteConfig } from "./utils/common/index.js"
import { config } from './config/config.js'
import { websocetObj } from './utils/websocet/websocet.js';
import $store from './store/index.js'
import { detailInfo, } from "@/utils/lottery/mine";
import defaultTemplate from "./utils/defaultTemplate";

const windowResizeCallback = (res) => {
    //  console.log('变化后的窗口宽度=' + res.size.windowWidth)
    //    console.log('变化后的窗口高度=' + res.size.windowHeight);
    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');

    uni.$emit("onWindowResize", res);
}
uni.onWindowResize(windowResizeCallback)

export default {
    globalData: {
        lotteryType: uni.getStorageSync('lotteryType') || 1,
        websiteConfigData: {
            all_luntan_config: 1,
            all_liuhe_config: 1,
            luntan_config: 1,
            liuhe_config: 1
        }
    },
    data() {
        return {
            title: '',
            content: '',
            desc: '',
            socketShow: false,
            webtext: '',
        }
    },
    onLaunch: function (option) {
        const { inviteCode } = option.query
        if (inviteCode) {
            uni.setStorageSync('inviteCode', inviteCode)
        }
        uni.$on('loginUpdate', this.reloadWebsockcet)
        uni.getSystemInfo().then(res => {
            uni.$sys = res[1];
            uni.setStorageSync('systemInfo', res[1]);
        });
        config.updateDomain(null)
        configs().then(res => {
            uni.setStorageSync('config', res.result);
            //@mrz 给home index页面发送config加载完成通知
            uni.$emit("on-homepage-freshbyconfig");
        }).catch(err => {
            console.log(err)
        })
        this.startWebsokcet();
        // this.$store.dispatch("initConfig", 0).then(function () {
        //     console.log("延迟回调")
        // });
        // this.$store.dispatch("initUserInfo");
        this.$store.dispatch("appInfoStoreInit");


        //新增userInfo 写入读取器
        this.$localdb.set("userInfo.setDebugString", null, (v) => { return v != null });
        this.$localdb.set("userInfo.setDebugString", Date.now(), (v) => { return v != null });
        let demoString = this.$localdb.set("userInfo.getDebugString");

        this.$config.configLotties.printAllMiniPlaylist();

        this.getWebsiteConfig()

    },

    computed: {
        appWebsocketStatus() {
            return this.$store.state.websocketStore.status;
        },
        appInGameLotteryId() {
            return this.$store.state.playingStore.inLotteryId;
        },
    },
    watch: {
        appWebsocketStatus(val) {
            this.onInGameOrWebsocketStatutChange();
        },
        appInGameLotteryId(val) {
            this.onInGameOrWebsocketStatutChange();
        }
    },
    methods: {
        async getWebsiteConfig() {
            const res = await websiteConfig()
            this.globalData.websiteConfigData = res.result
        },
        startWebsokcet() {
            try {
                console.log("startWebsokcet");
                let userInfo = uni.getStorageSync('userInfo');
                let argumentUserId = !userInfo || !userInfo.id || userInfo.id.toString().trim() == "" ? "undefined" : userInfo.id;
                //一定不能出现 argumentUserId 为空字符串的事情出现。会导致websocket永远无法连接上
                var url = config.websocket_url.replace("https://", "wss://").replace("http://", "ws://") + "/websocket/" + argumentUserId;
                console.log(url)
                console.log(config.websocket_url);
                websocetObj.sokcet(url,
                    this.getWebsocetData,
                    this.getWebsocetError,
                    this.onErrorSucceed
                )
            } catch (e) {
                console.error(e);
            }
        },
        reloadWebsockcet() {
            websocetObj.stop()
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // 业务逻辑
                this.startWebsokcet()
                clearTimeout(this.timer);
            }, 200)
        },
        getWebsocetData(data) {
            // console.log(data);
            // val = String.fromCharCode.apply(null, new Uint8Array(val)).trim()  如果后端返回数据格式是其他的，可能需要转换一下，比如这个，应该是转Unicode编码
            let newData = data.split("||")
            let val = null
            this.$store.dispatch('setOnlineNum', newData[0])
            if (typeof newData[1] === 'string') {
                let piceOne = newData[1];
                if (piceOne.indexOf('\'') >= 0 || piceOne.indexOf('\"') >= 0) {
                    val = eval("(" + newData[1] + ")");
                } else {
                    val = piceOne;
                }
            } else {
                val = newData[1];
            }
            if (val == 'BEAT') {
                let serverTime = parseInt(newData.length >= 3 ? newData[2] : Date.now());
                this.$store.dispatch("updateWebscoketPing", serverTime);
                this.$store.commit("setLastBeatServerTime", Date.now());
                this.$store.commit("addOneWebsocketLog", "接收心跳");
                return
            }
            const cmdPopMap = {
                // 公司入款成功
                companySuccess: {
                    title: '充值成功',
                    refName: 'account',
                },
                // 线上入款成功消息
                onlineSuccess: {
                    title: '充值成功',
                    refName: 'account',
                },
                //提现处理中消息
                drawLock: {
                    title: '提现已受理',
                    refName: 'account',
                },
                // 提现成功消息
                drawSuccess: {
                    title: '提现成功',
                    refName: 'account',
                },
                // 提现失败消息
                drawFail: {
                    title: '提现失败',
                    refName: 'account',
                },
                // 中奖消息
                bettingWin: {
                    refName: 'betting',
                },
                // 掉线退出
                logout: {
                    refName: 'logout',
                },
                syncLogin: {
                    refName: 'logout',
                }
            }
            if (cmdPopMap[val.cmd]) {
                const { title, refName } = cmdPopMap[val.cmd]
                if (title) {
                    val.title = title
                }
                // 如果是掉线退出或者syncLogin
                if (['logout', 'syncLogin'].includes(val.cmd)) {
                    console.log("websocket clear userInfo")
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    this.reloadWebsockcet()
                }
                uni.$emit('showPop', {
                    refName: refName,
                    data: val,
                    callback: (e) => {
                        console.log(`${title}弹窗回调`, e);
                        // 如果是中奖消息 
                        if (val.cmd === 'bettingWin' && e.type === 'close') {
                            this.$store.dispatch("updateUserBalanceFromServer")
                            // 如果是试玩用户
                            if (this.$store.state.appInfoStore.userInfo.userType === 'demo') {
                                detailInfo().then(res => {
                                    const { lotteryWinTotalAmount } = res.result
                                    // 彩票总中奖金额大于1000 弹出提醒
                                    if (lotteryWinTotalAmount >= 1000) {
                                        uni.$emit('showPop', {
                                            refName: 'TryProfit',
                                            data: lotteryWinTotalAmount
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
            }
            if (val.cmd == 'lotteryResultSuccess') {
                uni.$emit('getLotteryMsg', { data: val })
            } else if (val.cmd == 'event_getGameInfo') {
                uni.$emit("onGetGameInfo", { data: val })
            }
        },
        //websocet函数抛错： 返回错误信息 用于用户提示
        getWebsocetError(err) {
            this.socketShow = err.isShow;
            this.webtext = err.messge;
            this.$store.commit("addOneWebsocketLog", "websocet函数抛错");

            console.log('websocet函数抛错', this.socketShow);
        },
        //websocet函数成功进入： 监听连接状态，在失败的时候弹窗提示，具体需求看自身情况
        onErrorSucceed(val) {
            this.socketShow = val.isShow;
            console.log('websocet函数成功进入', this.socketShow);
            this.$store.commit("addOneWebsocketLog", "websocet函数成功进入");

        },


        //如果inLotteryId 或者网络状态变化之后 都会执行此函数
        onInGameOrWebsocketStatutChange() {
            if (this.appWebsocketStatus == websocetObj.WebsocketStauts.CONNETCTED && this.appInGameLotteryId != -1) {
                let socketInitStruct = { event: "getGameInfo", lotteryId: this.appInGameLotteryId };
                websocetObj.sendMsg(socketInitStruct)
            }
        }

    }
};
</script>

<style>
@import "/static/iconfont.css";
@import '/static/css/public.css';

:root {
    --vh: 100vh
}

.u-drawer {
    max-width: 480px;
    margin: auto;
}

/*每个页面公共css */
::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
}

.label-qs .uni-checkbox-wrapper {
    width: 24px;
    height: 24px;
}

.label-qs .uni-checkbox-input {
    margin-right: 0px;
}

.label-qs uni-checkbox {
    width: 24px;
    height: 24px;
}

.label-qs .uni-label-pointer {
    font-size: 14px;
}

.label-qs .uni-checkbox-input-checked {
    background: #0075ff !important;
}

.login-box .uni-forms-item__content,
.form-box .uni-forms-item__content {
    border-bottom: 1px solid #e9e9e9;
}

.login-box uni-input,
.form-box uni-input {
    height: 35px;
}

.login-box .uni-input-placeholder,
.form-box .uni-input-placeholder {
    color: #bcbcbc;
}

.form-item uni-input {
    display: block;
    font-size: 16px;
    line-height: 1.4em;
    height: 2.2em;
    min-height: 1.4em;
    overflow: hidden;
}

.mint-tab-container-item .form-item .uni-forms-item__content {
    border-bottom: 1px solid #c8c9cc !important;
}

.jin-box .content-box {
    width: auto;
    left: 30 rpx !important;
    right: 30 rpx !important;
    border-radius: 16px 16px 0 0;
    max-width: 475px;
    margin: auto;
}

.jin-box .content-box .uni-popup__wrapper {
    border-radius: 16px 16px 0 0;
}

#ifreme-chat-room iframe {
    border: none;
}

.uni-async-loading {
    height: 100vh;
    background: #ffffff;
}

.uni-async-loading:before {
    content: url(/static/img/loading_action_01.gif);
    margin-top: calc(50vh - 40px - 50px);
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.uni-async-loading .ldimg {
    background: red;
    width: 100px;
    height: 100px;
}

.uni-async-loading i {
    display: none;
}

/*.uni-async-loading{*/
/*    background: red;*/
/*}*/
</style>
