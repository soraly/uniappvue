<template>
    <Tabbar :current.sync="current" :barList="barList" activeColor="#1794FF" bgColor="rgba(23, 148, 255, 0.35)" />
</template>

<script>
import Tabbar from '@/components/Tabbar/PagesTabbar'
export default {
    components: {
        Tabbar,
    },
    props: {
        current: {
            type: Number | String,
            default: () => {
                return 0
            }
        },
    },
    data() {
        return {
            barList: [
                {
                    path: '/pages/pages-liuhe/index',
                    component: 'Home',
                    name: '首页',
                    img: '/static/imgs-liuhe/tabbar/Home.png',
                    selectedImg: '/static/imgs-liuhe/tabbar/selectedHome.png'
                },
                {
                    path: '/pages/pages-liuhe/game_hall',
                    component: 'GameHall',
                    name: '游戏大厅',
                    img: '/static/imgs-liuhe/tabbar/GameHall.png',
                    selectedImg: '/static/imgs-liuhe/tabbar/selectedGameHall.png'
                },
                {
                    path: '/pages/pages-liuhe/activity',
                    component: 'Activity',
                    name: '活动', img: '/static/imgs-liuhe/tabbar/Activity.png',
                    selectedImg: '/static/imgs-liuhe/tabbar/selectedActivity.png'
                },
                {
                    path: '/pages/pages-liuhe/my',
                    component: 'My', name: '我的',
                    img: '/static/imgs-liuhe/tabbar/My.png',
                    selectedImg: '/static/imgs-liuhe/tabbar/selectedMy.png',
                    login: true
                },
            ]
        }
    },
}
</script>
<style lang="scss" scoped></style>