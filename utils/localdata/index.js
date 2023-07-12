import {config} from "@/config/config.js"
// localstore 读取器
import localStoreFactory from  './localstore/index.js'
//预留其它数据读取器

export default {
    //分割
    decollator:".",

    type:{
       //数据通过本地localstore存储
      localStore:1,
       //数据通过文件存储
      file:2,
        //数据通过api存储
      api:3
    },
    /**
     * 获取当前缓存方式
     * @returns {*}
     */
    dataChannel(){
        let channel=config.localDataChannel;
        if(!channel||!this.type[channel]){
            return this.type['localStore'];
        }
        return this.type[channel];
    },

    //读取器获取内容
    get(datakey){
        let dataFactory=this.getDataFactoryByChannelId();
        if(!dataFactory){
            console.log("datafactory undefined #0034");
            return null;
        }
        let keys=this.getScriptDir(datakey);
        return dataFactory.runGet(keys);
    },




    //使用读取器存储内容
    set(datakey,value,checkcb=null){
        let dataFactory=this.getDataFactoryByChannelId();
        let keys=this.getScriptDir(datakey);
        dataFactory.runSet(keys,value,checkcb);
    },
    /**
     * 预留后续网络读取异步阻塞
     * @param datakey
     * @param value
     * @returns {Promise<void>}
     */
    async getAsync(datakey){

    },
    /**
     * 预留后续网络写入异步阻塞
     * @param datakey
     * @param value
     * @returns {Promise<void>}
     */
    async setAsync(datakey,value){

    },

    /**
     * 切割指向符号
     * @param keyname
     * @returns {Array|*}
     */
    getScriptDir(keyname){
       let split=keyname.split(this.decollator);
       if(!split) return [];
       return  split;
    },

    getDataFactoryByChannelId(){
        let channel=this.dataChannel();
        let factory=null;
        switch (channel) {
            case this.type.localStore:
                factory=localStoreFactory;
                break;
            default:
                factory=localStoreFactory;
                break
        }
        if(!factory){
          console.log("localdata factory build error channel="+channel);
        }
        return factory;
    },


}