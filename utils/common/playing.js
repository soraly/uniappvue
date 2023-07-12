import ball1 from '../../static/img/liuhe/ball/1.png'
import ball2 from '../../static/img/liuhe/ball/2.png'
import ball3 from '../../static/img/liuhe/ball/3.png'

export default class Playing {
    constructor() {
        this.bgImg = {
            // 1: ball1,
            // 2: ball2,
            // 3: ball3

            1:'../../static/img/liuhe/ball/1.png',
            2:'../../static/img/liuhe/ball/2.png',
            3:'../../static/img/liuhe/ball/3.png'
        };
        this.unitPrice = 1;
    }
    setBallColorConfig(){
        return {
            1:"01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46,51,52,57,58,63,64,69,70,75,76",
            2:"03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48,53,54,59,60,65,66,71,72,77,78",
            3 : "05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49,50,55,56,61,62,67,68,73,74,79,80"
        }
    }
    setBg(color) {//设置球颜色
        return {
            backgroundImage: `url(${this.bgImg[color]})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }
    }

    setBallItemStyle(index, len) {//设置球布局
        if (index > len - 5) {
            return {
                width: "50%",
            }
        } else {
            return {
                width: "33.3%",
            }
        }
    }

    setCurrentHeight() {
        return {
            height: 'calc(var(--vh) - 214px)'
        }
    }

    setUnitPrice(price) {
        this.unitPrice = price;
    }

    setOrders(ball, selectedIds) {
        let orderList = [];
        if (ball.minNum === 1) {
            orderList = selectedIds.map(id => {
                return {
                    "content": "",
                    "methodName": ball.name,
                    "mode": 1,
                    "chaseNum": 3,
                    "chaseStop": 0,
                    "playId": id,
                    "rebatePoint": 0,
                    "stakeCount": 1,
                    "totalPrice": 0,
                    "unitPrice": 0,
                    "code": ball.code,
                }
            })
        } else {
            orderList.push({
                "content": selectedIds.join(','),
                "methodName": ball.name,
                "mode": 1,
                "chaseNum": 0,
                "chaseStop": 1,
                "playId": selectedIds[0],
                "rebatePoint": 0,
                "stakeCount": this.setNum(selectedIds.length, ball.minNum),
                "totalPrice": 0,
                "unitPrice": 0,
                "code": ball.code,
            })
        }
        return orderList;
    }

    setNum(n, m) {
        return this.factorial(n) / this.factorial(n - m) / this.factorial(m)
    }

    //常规玩法注数计算
    factorial(n) {//阶乘
        if(isNaN(n)) return 0;
        if (n < 0) {
            //console.log('负数没有阶乘');
            return 1
        }
        if (n === 1 || n === 0) {
            return 1;
        } else {
            return this.factorial(n - 1) * n;
        }
    }

    //设置浏览器存储
    setStorage(name, data) {
        uni.setStorageSync(name, data)
    }

    setLongStorage(name, data) {
        let JSONString = JSON.stringify(data);
       // console.log(JSONString);
    }

    //获取storage
    getStorage(name) {
        const data = uni.getStorageSync(name)
        if (['isWin', 'isShare'].includes(name)) {
            return data === false ? false : true
        }
        return data
    }

    //清除storage
    removeStorage(name) {
        uni.removeStorageSync(name)
    }

    //获取已选球（数组）并去重
    setSelectedArr(arr, item) {
        //console.log(item.id);
        arr.some(i => i === item.id)
            ?
            arr.forEach((i, index) => {
                i === item.id
                    ?
                    arr.splice(index, 1)
                    :
                    null
            })
            :
            arr.push(item.id)
        //console.log(arr);
        return arr
    }

    /**
     *
     * **/
    showMsg(obj) {
        uni.showToast(obj)
    }

    // 把多少秒 转化为 时分秒
    timestampToDate(ctime) {
        let returnStr = '';
        // 天数位
        // let day = Math.floor(ctime / 3600 / 24);
        // let dayStr = day.toString();
        // if (dayStr.length == 1) dayStr = '0' + dayStr;
        if (ctime > 3600) {
            // 小时位
            let hr = Math.floor(ctime / 3600);
            let hrStr = hr.toString();
            if (hrStr.length == 1) hrStr = '0' + hrStr;
            returnStr = hrStr + ":";
        }

        // 分钟位
        let min = Math.floor(ctime / 60 % 60);
        let minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        returnStr += minStr;
        // 秒位
        let sec = Math.floor(ctime % 60);
        let secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        returnStr += ':' + secStr;
        return returnStr;
    }

    //金额转换
    setAmount(number, decimals, dec_point, thousands_sep, roundtag) {
        /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        let n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {

                let k = Math.pow(10, prec);
                //console.log();

                return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        let re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    //数组对象去重
    setArrObj(arr) {
        let map = new Map();
        for (let item of arr) {
            map.set(item.id, item);
        }
        return [...map.values()];
    }
}
