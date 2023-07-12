// -防抖
export function debounce(fn, wait) {
    let delay = wait || 500
    let timer
    return function() {
        let args = arguments;
        if (timer) {
            clearTimeout(timer)
            console.log('拦截')
        }
        let callNow = !timer
        timer = setTimeout(() => {
            console.log('发送')
            timer = null
        }, delay)
        if (callNow) fn.apply(this, args)
    }
}

// -节流
export function throttle(fn, wait) {
    let delay = wait || 500
    let timer = null
    return function() {
        if (timer) {
            /*console.log('拦截');*/
            return
        }
        timer = setTimeout(() => {
            /*console.log('发送');*/
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}
export function getTime(value,line='.' ,type = 1, dateType = 'date') {
    if(value == undefined){
        return;
    }
    // let date = new Date(value * 1000);
    let date = new Date(value);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if(type == 2){
        MM = MM < 10 ? ('0' + MM) : MM; //月补0
        d = d < 10 ? ('0' + d) : d; //天补0
        h = h < 10 ? ('0' + h) : h; //小时补0
        m = m < 10 ? ('0' + m) : m; //分钟补0
        s = s < 10 ? ('0' + s) : s; //秒补0
    }
    if(dateType == 'date'){
        return y + '.' + MM + '.' + d; //年月日时分秒
    }else{
        return y + '.' + MM + '.' + d + " " + h + ":" + m + ":" + s; //年月日时分秒
    }

}
export function getTimes(value,line='.' ,type = 1, dateType = 'date') {
    if(value == undefined){
        return;
    }
    // let date = new Date(value * 1000);
    let date = new Date(value);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if(type == 2){
        MM = MM < 10 ? ('0' + MM) : MM; //月补0
        d = d < 10 ? ('0' + d) : d; //天补0
        h = h < 10 ? ('0' + h) : h; //小时补0
        m = m < 10 ? ('0' + m) : m; //分钟补0
        s = s < 10 ? ('0' + s) : s; //秒补0
    }
    if(dateType == 'date'){
        return y + '-' + MM + '-' + d; //年月日时分秒
    }else if(dateType == 'hms'){
        return h + ":" + m + ":" + s;
    } else{
        return y + '.' + MM + '.' + d + " " + h + ":" + m + ":" + s; //年月日时分秒
    }

}
// 判断是否是当前日期前后7天的时间
export function isWithinSevenDays(date) {
  // 获取当前时间
  var currentDate = new Date();

  // 获取当前时间前后7天的时间范围
  var sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  var sevenDaysLater = new Date(currentDate);
  sevenDaysLater.setDate(currentDate.getDate() + 7);

  // 将输入的时间字符串转换为日期对象
  var inputDate = new Date(date);

  // 判断输入的时间是否在当前时间的前后7天范围内
  if (inputDate >= sevenDaysAgo && inputDate <= sevenDaysLater) {
    return true;
  } else {
    return false;
  }
}