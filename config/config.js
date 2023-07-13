import configGameRouter from './models/configGameRouter.js'
import configEnums from './models/configEnum.js'
import configLotties from './models/configLotteries'

var isDebug = true;
//是否为开发环境
var isDev = true;
//当前站点对应环境
var station = configEnums.STATION.ALL;//ALL LIUHE LUNTAN


// #ifdef H5
//在H5环境 index.html中引入JS中定义的全局变量 重写配置信息。这样打包发布环境就直接处理
if (window && window.hasOwnProperty("Configuration")) {
    console.log("configuration")
    console.log(Configuration);
    if (Configuration) {
        isDebug = !!Configuration.isDebug,
            isDev = !!Configuration.isDev
        if (Configuration.station && [configEnums.STATION.ALL, configEnums.STATION.LIUHE, configEnums.STATION.LUNTAN].indexOf(Configuration.station.toString().toUpperCase()) != -1) {
            station = Configuration.station.toString().toUpperCase();
        } else {
            console.warn("station can't rewrite");
        }
    }
} else {
    console.warn("configuration undefined")
}
// #endif


/**
 * 配置文件选择使用的服务器域名
 * @type {string}
 */
var apiDomainPool = isDebug ? [""] : [""];
var apiDomain = apiDomainPool[0];



//设置页面显示版本号 生产环境鉴别版本使用
var versionPro = "v2.3.012_04";
//个人中心页面显示版本号 测试环境显示生产不显示 用于测试高频发布鉴别版本使用
var versionDev = "v2.3.012_2023071103";

/**
 * websocket 连接池配置 方便后期扩张检测链接最快速度
 */
var websocketWsUrls = isDebug ? (isDev ? ["http://devh5.558888666.com"] : ["https://66136.cc"]) : [""]
var websocketWsUrl = websocketWsUrls[0];
//#ifdef H5
if (websocketWsUrl == "") {
    websocketWsUrl = location.protocol + "//" + location.host;
}



//#endif
const config = {
    station,
    isDebug: isDebug,
    apiKey: 123,
    base_url: [apiDomain + '/out'],
    me_base_url: [apiDomain + '/interface'],
    websocket_url_pool: websocketWsUrls,
    websocket_url: websocketWsUrl,

    version_pro: versionPro,
    version_dev: versionDev,

    loggerMax: 100,
    loggerStoreName: "mem:debug:logs",

    localDataChannel: 'localStore',

    //游戏枚举类
    enumMgr: configEnums,

    // 游戏路由管理器
    gameRouterMgr: configGameRouter,

    //彩票信息管理
    configLotties: configLotties,

    // update api domain
    updateDomain(apiDomain = null) {//可以传入url 或者info信息
        console.log("updateDomain", apiDomain);
        if (apiDomain === null) {
            //从localStore读取内容
            apiDomain = uni.getStorageSync('apiDomain');
        } else {
            //写入localStore
            uni.setStorageSync('apiDomain', apiDomain);
        }
        //将url写入
        const url = apiDomain ? apiDomain.url.slice(0, -1) : null;
        this.base_url = url ? [url + '/out'] : this.base_url;
        this.me_base_url = url ? [url + '/interface'] : this.me_base_url;
        // 引起H5生产报错
        // this.websocket_url = url || websocketWsUrls[0];
        this.websocket_url = url || this.websocket_url;

    },

}

export { config }
