//操作层 直接操作读写
export default {

    getUserInfo(){
        return uni.getStorageSync("userInfo");
    },

    setUserInfo(info){
        uni.setStorageSync("userInfo",info);
    },

    getDebugString(){
        return uni.getStorageSync("local-data-channel");
    },

    setDebugString(v){
        uni.setStorageSync("local-data-channel",v);
    }

}