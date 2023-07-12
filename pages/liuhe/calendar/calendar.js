export default class {
    constructor() {
        this.calendar = {}
        //日期数据基础
        this.baseDate = new Date()
        this.init()
    }
    init(){
        this.year = this.baseDate.getFullYear()
        this.month = this.baseDate.getMonth()
    }
    //获取数据
    getData () {
        let data = []
        //起始值
        let date = new Date(this.year, this.month, 1)
        if (date.getDay() === 0) {
            date.setTime(date.getTime() - 86400000 * 6)
        } else {
            date.setTime(date.getTime() - 86400000 * (date.getDay() - 1))
        }
        do {
            for (let i = 0; i < 7; i++) {
                let obj = {}
                obj.isThisMonth = date.getMonth() == this.month ? true : false
                obj.isToday = date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear() ? true : false
                obj.isWeek = i == 0 || i == 6 ? true : false
                obj.date = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
                obj.month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
                obj.year = date.getFullYear()
                // obj.weekNum = this.setWeekNum(obj)
                data.push(obj)
                date.setTime(date.getTime() + 86400000)
            }
        } while (date.getMonth() == this.month || data.length < 42)

        return data
    }
    //设置周次
    setWeekNum(obj) {
        let study = new Date(studyWeek.year, studyWeek.month, studyWeek.date).getTime()
        let now = new Date(obj.year, obj.month, obj.date).getTime()
        let weekNum = Math.ceil((now - study) / (1000 * 60 * 60 * 24) / 7)
        return weekNum + 1
    }
    //上月
    preMonth() {
        this.month--
        this.baseDate.setMonth(this.month, 1)
        this.init()

        return this.getData()
    }
    //下月
    nextMonth () {
        this.month++
        this.baseDate.setMonth(this.month, 1)
        this.init()

        return this.getData()
    }
    //上一年
    preYear () {
        this.year -= 1
        this.baseDate.setFullYear(this.year)
        this.init()

        return this.getData()
    }
    //下一年
    nextYear () {
        this.year += 1
        this.baseDate.setFullYear(this.year)
        this.init()

        return this.getData()
    }
    //本月
    thisMonth () {
        this.baseDate = new Date()
        this.init()
        return this.getData()
    }
    //自定义年月
    customDate(year, month) {
        this.year = +year
        this.month = +month
        this.baseDate.setFullYear(this.year)
        this.baseDate.setMonth(this.month - 1, 1)
        this.init()
        return this.getData()
    }
}

