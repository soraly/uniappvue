import Base64 from 'base-64';
import $store from "@/store/index.js"

let isSocketClose=false;    // 是否关闭socket
let reconnectCount=5;       // 重连次数
let heartbeatInterval="";   // 心跳定时器
let serverHeartbeatTimer="";// 监听服务端心跳包  心跳逻辑有问题 后续再调吧
let socketTask = null;      // websocket对象
let  againTimer = null;     //断线重连定时器
let url = null;
let onReFn = null;
let onSucFn = null;
let onErrFn = null;
const WebsocketStauts ={
    CLOSED:-1,
    CONNECTING:0,
    CONNETCTED:1,
}

/**
 * 将二进制数据流转为json
 * @param {Object} buffer
 */
export function buffer_to_json(buffer) {
    console.log(buffer)
    console.log(uni.arrayBufferToBase64(buffer))

    let str = Base64.decode(uni.arrayBufferToBase64(buffer))
    console.log(str);
    /*return JSON.parse();*/
}

/**
 * 将json转为二进制数据流
 * @param {Object} string
 */
export function json_to_buffer(obj) {
    return uni.base64ToArrayBuffer(Base64.encode(JSON.stringify(obj)));
}
/**
 * sockeUrl：websocet的地址
 * onReceive：消息监听的回调
 * onErrorEvent：抛出错误的回调，且弹窗连接失败的提示框
 * onErrorSucceed：抛出成功回调，主要用于隐藏连接失败的提示框
 * */
const sokcet= (sockeUrl,onReceive,onErrorEvent,onErrorSucceed)=> {
    url = sockeUrl;
    onReFn= onReceive;
    onErrFn= onErrorEvent;
    onSucFn= onErrorSucceed;
    isSocketClose=false;
    //判断是否有websocet对象，有的话清空
    if(socketTask){
        socketTask.close();
        socketTask = null;
        clearInterval(heartbeatInterval);
    }
    $store.commit("setWebsocketStatus",WebsocketStauts.CONNECTING);
    $store.commit("addOneWebsocketLog","开始链接webSocket");
    //WebSocket的地址
    // 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
    // let url = sockeUrl 谁写的BUG ！！！！！！！！！！！！！！！！！
    // 连接
    socketTask = uni.connectSocket({
        url: url,
        success(data) {
            console.log("websocket连接成功");
            $store.commit("addOneWebsocketLog","websocket连接成功");

            clearInterval(againTimer)//断线重连定时器


        },
        fail: (err) => {
            console.log("报错",err);
            $store.commit("addOneWebsocketLog","websocket链接出错:"+url);
            $store.commit("addOneWebsocketLog",JSON.stringify(err));
            $store.commit("setWebsocketStatus",WebsocketStauts.CLOSED);
        }
    });

    // 连接打开
    socketTask.onOpen((res)=>{
        $store.commit("setWebsocketStatus",WebsocketStauts.CONNETCTED);
        $store.commit("addOneWebsocketLog","websocket onopen 成功");
        clearInterval(againTimer)//断线重连定时器
        onErrorSucceed({isShow:false}) // 用于提示框的隐藏
        heartbeatInterval && clearInterval(heartbeatInterval);
        serverHeartbeatTimer && clearInterval(serverHeartbeatTimer);
        let sendFirstHeartBeat=false;
        // 10秒发送一次心跳
        heartbeatInterval = setInterval(() => {
            // sendMsg('心跳ing')
            // 放弃中文心跳形式 减少数据包体大小
            let lastGetHeartBeatTime=$store.state.websocketStore.lastBeatServerTime;
            let lastSendHeartBeatTime=$store.state.websocketStore.lastBeatClientTime;
            if(lastSendHeartBeatTime-lastGetHeartBeatTime>3000&&sendFirstHeartBeat){//大于三秒安全阈值 则表示心跳已断开
                $store.commit("addOneWebsocketLog","心跳超时 应该重连");
                reconnect(url,onErrFn);
                return;
            }
            $store.commit("addOneWebsocketLog","发送Beat");
            $store.commit("setLastBeatClientTime",Date.now());
            sendMsg('BEAT')
            sendFirstHeartBeat=true;
        }, 3000)
    })
    // 监听连接失败
    socketTask.onError((err)=>{
        //停止发送心跳
        $store.commit("addOneWebsocketLog","onError");
        $store.commit("addOneWebsocketLog",err.toString());
        clearInterval(heartbeatInterval)
        //如果不是人为关闭的话，进行重连
        if (!isSocketClose) {
            reconnect(url,onErrFn)
        }
    })

    // // 监听连接关闭 -
    socketTask.onClose((e) => {
        $store.commit("addOneWebsocketLog","onError");

        $store.commit("setWebsocketStatus",WebsocketStauts.CLOSED);
        clearInterval(heartbeatInterval)
        if (!isSocketClose) {
            reconnect(url,onErrFn)
        }
    })

    // 监听收到信息
    socketTask.onMessage((res) => {
        uni.hideLoading()
        /*let serverData = null
        let data = res.data.split("||")
        if(typeof data[1] === 'string'){
            serverData = eval("(" + data[1] + ")");
        }else{
            serverData = data[1];
        }*/
        let serverData = res.data
        /*console.log(serverData)*/
        /*res = buffer_to_json(res.data)
        console.log(res)*/
        //与后端规定好返回值分别代表什么，写业务逻辑
        serverData && onReceive(serverData);
    });
}

const reconnect = (url,onErrorEvent)=>{
    console.log('进入断线重连',isSocketClose);
    $store.commit("addOneWebsocketLog","进入断线重连");

    clearInterval(againTimer)//断线重连定时器
    clearInterval(heartbeatInterval);
    socketTask && socketTask.close(); // 确保已经关闭后再重新打开
    socketTask = null;
    onErrorEvent({isShow:true,messge:'扫描头服务正在连接...'})
    // 连接  重新调用创建websocet方法
    againTimer	= setInterval(()=>{
        sokcet(url,onReFn,onErrFn,onSucFn)
        console.log('在重新连接中...');
    },1000*5)
}
const sendMsg = (msg)=>{   //向后端发送命令
    msg = JSON.stringify(msg)
    try{
        //通过 WebSocket 连接发送数据
        socketTask.send({
            data: msg
        });
    }catch(e){
        console.warn("websocket send message faild");
        console.log(e);
        if(isSocketClose){
            return
        }else{
            reconnect(url,onErrFn)
        }
    }
}
// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】beforeDestroy() {websocetObj.stop();}
const stop = ()=>{
    isSocketClose = true
    clearInterval(heartbeatInterval);
    clearInterval(againTimer)//断线重连定时器
    socketTask&&socketTask.close(); // 确保已经关闭后再重新打开
    socketTask = null;
    console.log(socketTask)
}
export const websocetObj = {
    sokcet,
    stop,
    sendMsg,
    WebsocketStauts
};
