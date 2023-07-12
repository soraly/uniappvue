function getTime(value) {
    if(value == undefined){
        return;
    }
    // let date = new Date(value * 1000);
    let date = new Date(value);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM; //月补0
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d; //天补0
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h; //小时补0
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m; //分钟补0
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s; //秒补0
    return MM + '月' + d + '日'; //年月日时分秒
}
function getTime2(value) {
    if(value == undefined){
        return;
    }
    // let date = new Date(value * 1000);
    let date = new Date(value);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM; //月补0
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d; //天补0
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h; //小时补0
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m; //分钟补0
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s; //秒补0
    return MM + '-' + d; //年月日时分秒
}
function moneyFormat(arg) {
    if(!arg) return 0
    if (arg.toString().length >= 13) {
        // return arg/1000000000000+"万亿"
        const moneys = arg / 1000000000000
        const realVal = parseFloat(moneys).toFixed(1);
        return realVal + "万亿"
    } else if (arg.toString().length >= 9 && arg.toString().length < 13) {
        const moneys = arg / 100000000
        const realVal = parseFloat(moneys).toFixed(1);
        return realVal + "亿"
    } else if (arg.toString().length >= 4 && arg.toString().length < 9) {
        const moneys = arg / 10000
        const realVal = parseFloat(moneys).toFixed(1);
        return realVal + "万"
    }else{
        return arg
    }
}
export default {
    getTime,getTime2,moneyFormat
}