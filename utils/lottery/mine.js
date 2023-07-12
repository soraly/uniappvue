import { apiLoginRequest, apiRequest } from "../request";

//用户详情
export const detailInfo = (prams) => {
    return apiLoginRequest({
        url: '/api/user/detailInfo',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

//获取提现初始化数据
export const init = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/draw/init',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//最近在玩（样版2）
export const userNewlyPlay = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/shop/style2/userNewlyPlay',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//进入游戏
export const gamePlatformUpholdInfo = (prams) => {
    return apiRequest({
        url: '/api/lottery/shop/gamePlatformUpholdInfo',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//进入游戏
export const enter = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/enter',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//余额转入平台
export const rollIn = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/rollIn',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//替换从游戏返回大厅逻辑 20230622
export const exit = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/exit',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//余额转入游戏
export const rollOut = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/rollOut',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//提现
export const draw = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/draw',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//免提直充初始化数据
export const inits = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/init',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//免提直充
export const incomeDirect = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/incomeDirect',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取用户余额
export const getUserBalance = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/balance',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//充值类型分组列表
export const getRechargeGroup = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/getRechargeGroup',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//充值方式列表
export const getRechargeType = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/getRechargeType',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//线上入款
export const incomeOnline = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/incomeOnline',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}
//公司入款
export const incomeCompany = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/incomeCompany',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}
//USDT入款
export const incomeWallet = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/recharge/incomeWallet',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}
//我的银行卡
export const bankCardList = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/bankCardList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取真实姓名
export const getRealName = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/getRealName',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//解绑银行卡
export const unbindBank = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/unbindBank',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//银行列表
export const bankList = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/bankList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//添加银行卡
export const addBankCard = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/addBankCard',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//添加USDT地址
export const addUSDT = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/addUSDT',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//钱包列表
export const walletList = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/walletList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//添加钱包
export const addWallet = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/addWallet',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//收款码类别列表
export const qrcodeTypeList = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/qrcodeTypeList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//收款码类别列表
export const addQrcode = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/addQrcode',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//设置资金密码
export const revisePinCode = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/revisePinCode',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//设置资金密码
export const setPinCode = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/setPinCode',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//存取记录
export const accessRecord = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/accessRecord',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//存取记录明细
export const accessInfo = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/accessInfo',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//盈亏报表
export const winLoseRecord = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/winLoseRecord',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//游戏明细
export const record = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/record',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取帐变类型分组类型
export const getGroupType = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/getGroupType',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取帐变类型分组类型
export const balanceRecord = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/balanceRecord',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//转换记录
export const switchRecord = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/switchRecord',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取获取礼金类型
export const getGiftType = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/getGiftType',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取礼金记录
export const giftRecord = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/order/giftRecord',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//额度列表
export const initQuota = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/game/init',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
//获取安全中心初始化
export const mySecurityCenter = (prams) => {
    return apiLoginRequest({
        url: '/api/user/mySecurityCenter',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}