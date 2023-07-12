import { config } from '../config/config.js'
import CryptoJS from "@/utils/common/crypto-js";
import EncryptUtils from '@/utils/common/encryptUtils.js';

var l = 0;
var j = 1;
export const apiResquest = (prams) => { //prams 为我们需要调用的接口API的参数 下面会贴具体代码
    // 判断请求类型
    let headerData = {
        'content-type': 'application/json',
        'X-Access-Token': uni.getStorageSync('token'),
        'lotterytype': uni.getStorageSync('lotteryType') || 1,
        'Origin-Domain': location.hostname
    }
    let dataObj = null
    //因为我们的GET和POST请求结构不同这里我们做处理，大家根据自己后台接口所需结构灵活做调整吧
    headerData = Object.assign(headerData, prams.header);
    dataObj = prams.query
    j = 1;
    return resquest(prams, dataObj, headerData)
}

export const apiRequest = (prams) => {
    let token = uni.getStorageSync('token');
    let timeSend = Math.round(new Date().getTime());
    // 判断请求类型
    let headerData = {
        'content-type': 'application/json',
        'X-Access-Token': token,
        'salt': timeSend,
        'Origin-Domain': location.hostname
    }
    let dataObj = null
    let sortParam = paramKeySort(prams.query);
    let value = config.apiKey + sortParam + timeSend;
    headerData.secret = EncryptUtils.encryptMacToBase64(value, CryptoJS.MD5(CryptoJS.enc.Utf8.parse(config.apiKey)));
    headerData = Object.assign(headerData, prams.header);

    let encryptData = {};
    if (prams.query && Object.keys(prams.query).length > 0) {
        let data = EncryptUtils.encryptAES_StrToStr_test(JSON.stringify(prams.query), CryptoJS.MD5(CryptoJS.enc.Utf8.parse(config.apiKey)));
        encryptData = { encryptData: data };
    }
    dataObj = encryptData;

    //dataObj = prams.query
    j = 1;
    // console.log('prams',prams.query);
    return resquest(prams, dataObj, headerData)
}

export const apiLoginRequest = (prams) => {
    let token = uni.getStorageSync('token');
    let timeSend = Math.round(new Date().getTime());
    let userInfo = uni.getStorageSync('userInfo');
    // 判断请求类型recharge/incomeOnline
    let headerData = {
        'content-type': 'application/json',
        'X-Access-Token': token,
        salt: timeSend,
        'Origin-Domain': location.hostname
    }
    let dataObj = null
    let sortParam = paramKeySort(prams.query);
    let value = config.apiKey + userInfo.id + token + sortParam + timeSend;
    headerData.secret = EncryptUtils.encryptMacToBase64(value, CryptoJS.MD5(CryptoJS.enc.Utf8.parse(config.apiKey)));
    headerData = Object.assign(headerData, prams.header);

    let encryptData = {};
    if (prams.query && Object.keys(prams.query).length > 0) {
        let data = EncryptUtils.encryptAES_StrToStr_test(JSON.stringify(prams.query), CryptoJS.MD5(CryptoJS.enc.Utf8.parse(config.apiKey)));
        encryptData = { encryptData: data };
    }
    dataObj = encryptData;
    //dataObj = prams.query
    j = 1;
    // console.log('prams',prams.query);
    return resquest(prams, dataObj, headerData)
}


/**
 按参数名的ascii码从小到大排序
 如age在city前
 */
function paramKeySort(array) {
    //先用Object内置类的keys方法获取要排序对象的属性名数组，
    //再利用Array的sort方法进行排序
    let newKey = Object.keys(array).sort();
    //创建一个新的对象，用于存放排好序的键值对
    let newObj = '';
    for (let i = 0; i < newKey.length; i++) {
        if (isNil(array[newKey[i]] + '')) {
            continue
        }
        newObj += array[newKey[i]];
    }
    return newObj;
}

function isNil(s) {
    return undefined == s || "undefined" == s || null == s || s == "" || s == "null" || NaN == s;
}


function resquest(prams, dataObj, headerData, trytimes = 0) {
    return new Promise((resolve, reject) => {
        let url = '';
        if (l >= config.me_base_url.length) {
            if (j > 5) {
                resolve([])
            }
            j = j + 1;
            l = 0;
        }
        if (prams.baseUrl == 1) {
            url = config.me_base_url[l] + prams.url; //请求的网络地址和局地的api地址组合
        } else {
            url = config.base_url[l] + prams.url; //请求的网络地址和局地的api地址组合
        }
        /*uni.showLoading({
            title: '加载中',
            mask: true
        })*/
        return uni.request({
            url: url,
            data: dataObj,
            method: prams.method,
            header: headerData,
            timeout: 15000,
            success: (res) => {
                /*uni.hideLoading()*/
                //这里是成功的返回码，大家根据自己的实际情况调整
                if (res.data.code == 0) {
                    uni.showToast({
                        title: '获取数据失败:' + res.data.msg,
                        duration: 1000,
                        icon: "none"
                    })
                    resolve(res.data);
                } else if (res.data.code === 401) {
                    console.log("移除UserInfo #request.js 140")
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    uni.navigateTo({
                        url: "/pages/liuhe/login"
                    });
                }
                resolve(res.data);
            },
            fail: (err) => {
                resolve({ request: true });
            },
            complete: (complete) => {
                uni.hideLoading()
            }
        });
    }).then(res => {
        l = l + 1
        return res.request && trytimes > 0 ? resquest(prams, dataObj, headerData, trytimes - 1) : Promise.resolve(res)
    })
}
