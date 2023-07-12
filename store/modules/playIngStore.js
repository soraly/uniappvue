const playingStore = {
    state: {
        orderList: [], //
        onlineNum:0,
        inLotteryId:-1,
        gameHeaderInfo:null,
    },
    getters: {
        orderList: state => state.orderList,
        onlineNum: state => state.onlineNum,
        inLotteryId: state => state.inLotteryId,
        gameHeaderInfo:state => state.gameHeaderInfo,
    },
    mutations: {
        SET_ORDER_LIST: (state, obj) => state.orderList = obj,
        SET_TEMA_LIST: (state, obj) => state.orderList.tema = obj,
        SET_LIANMA_LIST: (state, obj) => state.orderList.lianma = obj,
        SET_ONLINE_NUM:(state, obj) => state.onlineNum = obj,
        SET_GAME_HEADERINFO:(state, headerInfo) => state.gameHeaderInfo = headerInfo,
        SET_GAME_INLOTTERYID:(state, lotteryId) => state.inLotteryId = lotteryId
    },
    actions: {
        setOrderList: ({commit}, obj) => commit('SET_ORDER_LIST', obj),
        setTemaList: ({commit}, obj) => commit('SET_TEMA_LIST', obj),
        setLianmaList: ({commit}, obj) => commit('SET_LIANMA_LIST', obj),
        setOnlineNum: ({commit}, obj) => commit('SET_ONLINE_NUM', obj)
    }
};

export default playingStore
