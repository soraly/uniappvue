import { config } from '@/config/config.js'
import {
    showUserBalance,
} from "@/utils/lottery/betting";
import defaultTemplate from '@/utils/defaultTemplate'


const AppInfoStore = {
    state: {
        configs: null,
        userInfo: null,
    },
    getters: {
        configs: state => state.configs,
        userInfo: state => state.userInfo,
        userHeadImageUrl: state => state.userInfo ? state.userInfo.headImgUrl : '/static/img/user/Frame21.png'
    },
    mutations: {
        SET_CONFIGS: (state, obj) => state.configs = obj,
        SET_USERINFO: (state, userInfo) => state.userInfo = userInfo,
        SET_USERINFO_NULL: (state) => state.userInfo = null,
        //更新用户某个属性
        SET_USERINFO_PROPERTY: (state, properties) => {
            if (state.userInfo) {
                let userInfoCopy = Object.assign(state.userInfo, {});
                for (let property in properties) {
                    userInfoCopy[property] = properties[property];
                }
                //使用备份重新赋值 避免Object形式更新扫描不到更新
                state.userInfo = userInfoCopy;
            }
        }
    },
    actions: {
        //调配到单个函数 在APP onLaunch 生命周期行数中调用 。
        async appInfoStoreInit({ commit, dispatch, state }) {
            dispatch("initConfig");
            dispatch("initUserInfo");
        },

        initConfig: ({ commit }, type) => {
            commit("SET_CONFIGS", config)
            return new Promise((resolve => {
                setTimeout(function () {
                    resolve(1);
                }, 10000)
            }))
        },
        /**
         * 用户退出登录调用
         * @param commit
         */
        userLoginOut: ({ commit, state }, from) => {
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            uni.$emit('loginUpdate', {})
            commit("SET_USERINFO_NULL");
        },

        initUserInfo: ({ commit, dispatch, state }) => {
            let localStoreUserInfo = uni.getStorageSync("userInfo");
            //本地检测到用户信息
            return new Promise((async resolve => {
                //使用阻塞形式 后续可以扩展检测token是否已经失效问题
                if (localStoreUserInfo) {
                    await dispatch("updateUserInfo", localStoreUserInfo);
                    await dispatch("updateUserBalanceFromServer");
                    return resolve(true);
                }
                resolve(false);
            }));
        },

        /**
         * 更新用户信息 后续可以新增检测本地存储userInfo Token是否失效
         * 避免用户调用功能接口才提示token失效 20230602
         * @param commit
         * @param userInfo
         */
        updateUserInfo({ commit }, userInfo) {
            if (!userInfo) {
                console.warn("appinfo store updateUserInfo input is null");
            }
            commit("SET_USERINFO", Object.assign(userInfo, { userBalance: 0 }));
        },


        /**
         * 更新用户结构内属性信息
         * @param commit
         * @param propertiesMap
         */
        updateUserInfoProperties({ commit }, propertiesMap) {
            if (!propertiesMap) {
                console.warn("appinfo store propertiesMap input is null");
                return;
            }
            commit("SET_USERINFO_PROPERTY", propertiesMap);
        },
        /**
         * 从接口更新用户剩余额度到内存中
         * @param commit
         * @param dispatch
         * @param state
         * @returns {Promise<any> | Promise}
         */
        updateUserBalanceFromServer({ commit, dispatch, state }) {
            return new Promise(async resolve => {
                let balanceResult = await showUserBalance();
                if (balanceResult.code == 200) {
                    const result = defaultTemplate({
                        id: "",
                        createBy: '',
                        createTime: "",
                        updateBy: '',
                        updateTime: '',
                        uid: "",
                        userBalance: 0,
                        yebBalance: 0,
                        yebProfit: 0,
                        gameLockBalance: 0,
                        yebAmount: 0
                    }, balanceResult.result)
                    commit("SET_USERINFO_PROPERTY", {
                        userBalance: result.userBalance,
                        gameLockBalance: result.gameLockBalance,
                        yebAmount: result.yebAmount,
                        yebBalance: result.yebBalance,
                        yebProfit: result.yebProfit,
                    })
                    return resolve(result);
                }
                resolve(null);
            })
        },
        /**
         *  单独更新UserInfo 中的Balance信息
         * @param commit
         * @param moneyNum
         */
        updateUserInfoBalance({ commit }, moneyNum) {
            let formartNum = parseFloat(moneyNum);
            if (!isNaN(formartNum)) {
                return console.warn("updateUserInfoBalance userMoeny is null");
            }

            commit("SET_USERINFO_PROPERTY", { userBalance: moneyNum });
        }
    }
};

export default AppInfoStore
