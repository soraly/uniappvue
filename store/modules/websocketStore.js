
const WebsocketStore = {
    state: {
        status: 0,
        ping: 0,
        last_server_time: 0,
        last_client_time: 0,
        timeInterval: 0,

        lastBeatServerTime: -1,
        lastBeatClientTime: -1,

        webSocketLogs: [],

    },
    getters: {
        websocketTimeInterval: state => state.timeInterval,
        debugWebsocketTimeInterval(state){
            return Math.abs(Math.ceil(state.timeInterval* (Math.random()*0.3+0.7))+(-50+(Math.ceil(50*Math.random()))));
        }
    },
    mutations: {
        setWebsocketStatus: (state, status) => state.status = status,
        setLastServerTime: (state, time) => state.last_server_time = time,
        setLastClientTime: (state, time) => state.last_client_time = time,
        setTimeInterval: (state, time) => state.timeInterval = time > 0 ? time : 0,
        setLastBeatServerTime: (state, time) => state.lastBeatServerTime = time,
        setLastBeatClientTime: (state, time) => state.lastBeatClientTime = time,
        addOneWebsocketLog: (state, logMsg) => {
            state.webSocketLogs.push({ time: Date.now(), msg: logMsg });
            if (state.webSocketLogs.length > 1000) {
                state.webSocketLogs.shift();
            }
        }
    },
    actions: {
        updateWebscoketPing: ({ commit }, serverTime) => {
            let clientTime = Date.now();
            commit("setLastServerTime", serverTime);
            commit("setLastClientTime", clientTime);
            commit("setTimeInterval", clientTime-serverTime);// serverTime - clientTime
        }
    }
};

export default WebsocketStore
