function getTime(value ,type=1) {
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
    // return y + '-' + MM + '-' + d; //年月日
    if(type == 1){
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m+ ':' + s; //年月日时分秒
    }else if(type == 2){
        return y + '年' + MM + '月' + d + '日' + h + '时' + m+ '分' + s + "秒"; //年月日时分秒
    }else if(type == 3){
        return MM + '月' + d + '日'; //年月日时分秒
    }else if(type == 4){
        return MM + '-' + d
    }
}
function checkPhone(phone){
    let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (phone =='' || !reg.test(phone)) {
        pop("请检查手机格式",2000)
        return false
    }
    return true
}
function codeCheck(code){
    if (!code) {
        uni.showToast({
            title: '请输入验证码',
            duration:2000,
            icon: "none"
        })
        return false
    }
    return true
}
module.exports = {
    getTime : getTime,
    checkPhone : checkPhone,
    codeCheck:codeCheck
}
