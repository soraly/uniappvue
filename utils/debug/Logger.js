import {config} from "@/config/config.js"
import {getTime} from "@/utils/common.js"

var LogWatcher = function (logName) {
    this.seed=Date.now()+""+Math.ceil(Math.random()*99999);
    this.logName=logName;
    this.startTime=-1;
    this.endTime=-1;
    this.responseMaxSize=100;
    this.responseData="";
    this.timeOutTicker=-1;
    this.saved=false;
    this.start=function (timeOut=20000) {
        this.startTime=Date.now();
        let _this=this;
        this.timeOutTicker=setTimeout(function(){
            _this.save(-1,{},"请求超时")
        },timeOut)
        return this;
    }
    this.save=function (code,response,desc='') {
        clearTimeout(this.timeOutTicker);
        if(this.saved) return;
        this.saved=true;
        this.endTime=Date.now();
        let responseStr=JSON.stringify(response);
        let saveObject={
            code:code,
            desc:desc,
            response:responseStr.substring(0,this.responseMaxSize),
            seed:this.seed,
            logName:this.logName,
            useTime:this.endTime-this.startTime,
            begin:this.startTime,
            end:this.endTime,
            startDate:getTime(this.startTime)
        };
        let logger=config.loggerStoreName;
        let configMax=config.loggerMax;
        let logArray = uni.getStorageSync(logger);
        if(!logArray) logArray=[];
        if(logArray.length>configMax) logArray.pop();
        logArray.unshift(saveObject);
        uni.setStorageSync(logger,logArray);
    }
};

export default {

    createLogWatcher(apiName){
        return new LogWatcher(apiName)
    },

    getLoggers(){
        let logger=config.loggerStoreName;
        let logArray = uni.getStorageSync(logger);
        if(!logArray) logArray=[];
        return logArray;
    }



}