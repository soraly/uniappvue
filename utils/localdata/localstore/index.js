import userInfo from "./userInfo/userInfo.js"

/**
 * 管理层 将切割字符串 指向对应注入脚本及调用方法
 * 并且拦截不合法写入值逻辑
 */
export default {

    userInfo:userInfo,

    //读取接口
    runGet(keys){
        let datakey=keys.join(".");
        if(!keys||keys.length<1){
            console.error("error: localdata reader key is faild #0035")
            return null;
        }
        let o=this;
        for (let index=0;index<keys.length;index++){
            let key=keys[index];
            if(index!=keys.length-1){
                if(!o[key]){
                    return  console.error("read data error ; ["+datakey+"] break #44 key="+key);
                }
                o=o[key];
            }else {
                let cb=o[key];
                if(cb instanceof Function){
                    return cb();
                }else {
                    console.error("read data error ; ["+datakey+"] break not function #52 key="+key);
                    return null;
                }
            }
        }
    },

    //写入接口
    runSet(keys,value,checkCb){
        let datakey=keys.join(".");
        if(!keys||keys.length<1){
            console.error("error: localdata reader key is faild #0066")
            return null;
        }
        let o=this;
        for (let index=0;index<keys.length;index++){
            let key=keys[index];
            if(index!=keys.length-1){
                if(!o[key]){
                    return  console.error("read data error ; ["+datakey+"] break #0074 key="+key);
                }
                o=o[key];
            }else {
                let cb=o[key];
                if(cb instanceof Function){
                    if(checkCb&&checkCb instanceof Function&&!checkCb(value)){
                        console.warn("set data error check faild :"+datakey)
                        return;
                    }
                    return cb(value);
                }else {
                    console.error("read data error ; ["+datakey+"] break not function #52 key="+key);
                    return null;
                }
            }
        }
    }
}