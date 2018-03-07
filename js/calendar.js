var DatePick = function() {
        this.init()
        this.render()
        this.appendDay()
        // this.bind()
        window.onclick = function(){hua.bind()}
}

DatePick.prototype.init = function() {
    this.date = new Date()
    this.today = this.date.getTime()
    // this.target = target
}

// 渲染模板
DatePick.prototype.render = function() {
    console.log(this.date)
    var year = this.date.getFullYear()
    var month = this.date.getMonth() + 1
    var css = `
        .calendar-container {
            background: #2c3440;
            width: 320px;
            margin: auto;
            font-family: San Francisco Bold, Pinfang, "Microsoft Yahei";
            position:absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            box-shadow:8px 8px 30px 0 rgba(0,0,0,.5);
        }

        .calendar-header {
                font-size: 20px;
        }

        .header-date-option {
            text-align: center;
            padding: 18px 0;
            padding-top: 35px;
        }

        .header-date-option span{
            color: #fcee6d;
        }

        .header-date-option i{
            color: #989ca2;
        }

        .calendar-content table {
            color: #FBFBFB;
            margin: 0 auto;
            font-family: San Francisco Medium;
        }

        .calendar-content table thead tr th {
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .calendar-content tbody tr th{
            padding: 10px 8px;
            font-weight: normal;
        }
        .calendar-content tbody tr:last-child th{
            padding-bottom: 50px;
        }


        .next-arrow,.pre-arrow {
            cursor: pointer;
        }
        .pre,.next {
            visibility: hidden;
        }
        .cur-date {
            background: #fcee6d;
            border-radius: 50%/50%;
            color: black;
        }
    `

    var t = `
        <div class='calendar-container'>
            <div class='calendar-header'>
                <div class='header-date-option'>
                    <i class='pre-arrow'><</i>
                    <span class='header-year'>${year}</span>
                    <span>年</span>
                    <span class='header-month'>${month}</span>
                    <span>月</span>
                    <i class='next-arrow'>></i>
                </div>
            </div>
            <div class='calendar-content'>
                <table>
                    <thead>
                        <tr>
                            <th>日</th>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                        </tr>
                    </thead>
                    <tbody class='calendar-content-days'>
                    </tbody>
                </table>
            </div>
        </div>
    `
    var mask = document.querySelector('.mask')
    mask.innerHTML = t
    var style = document.querySelector('style')
    style.innerHTML = css
}

// 编排一个月的日期到指定数组
DatePick.prototype.setData = function() {
    var firstDay = this.getFirstDay(this.date)
    var lastDay = this.getLastDay(this.date)
    var dateArr = []
    // 返回这个月第一天是星期几
    // console.log('firstDay', firstDay)
    var DayOfWeek = firstDay.getDay()
    var msecOfFirstDay = firstDay.getTime()
    console.log('lastDay.getDate()', lastDay, lastDay.getDate())
    console.log('lastDay.getDay()', lastDay.getDay())
    // 循环日历上这个月之前的几天（上个月的最后几天），求出毫秒并 Push 进数组
    for(var i = DayOfWeek; i > 0; i--) {
        // console.log('这个月之前的几天', i)
        var d = new Date(msecOfFirstDay - i * 1000 * 60 * 60 * 24).getDate()
        dateArr.push({type:'pre', date: d})
    }

    // // 返回这个月有多少天
    // var DaysOfMonth = lastDay.getDate() - firstDay.getDate() + 1
    // 循环这个月的每一天，求出毫秒并 Push 进数组
    for(var j = 0; j < lastDay.getDate(); j++) {
        // console.log('这个月', j)
        var dayTime = msecOfFirstDay + j * 1000 * 60 * 60 * 24
        var d = new Date(msecOfFirstDay + j * 1000 * 60 * 60 * 24).getDate()
        // 找出今天的日期, 添加 cur-date class
        if(dayTime == this.today) {
            dateArr.push({type:'cur cur-date', date: d})
        } else {
        dateArr.push({type:'cur', date: d})
        }
    }

    // 循环日历上这个月之后的几天（下个月的开始几天），求出毫秒并 Push 进数组
    for(var k = 1; k < 7 - lastDay.getDay(); k++) {
        // console.log('这个月之后的几天', k)
        var d = new Date(msecOfFirstDay + k * 1000 * 60 * 60 * 24).getDate()
        dateArr.push({type:'next', date: d})
    }
    return dateArr
}

// 添加日期到日历
DatePick.prototype.appendDay = function() {
    var dateArr = this.setData()
    // console.log('dateArr', dateArr)
    var temArr = []
    var html = ''
    for(var i = 0; i < dateArr.length; i++) {
        temArr.push(dateArr[i])
        if(temArr.length == 7) {
            var tem = this.calendarTep(temArr)
            // console.log(tem)
            var html = html + tem
            var temArr = []
        }
    }
    var calendarDiv = document.querySelector('.calendar-content-days')
    calendarDiv.insertAdjacentHTML('beforeend', html)
}

// 日历的模板
DatePick.prototype.calendarTep = function(temArr) {
    var t = `
        <tr>
            <th class='${temArr[0].type}'>${temArr[0].date}</th>
            <th class='${temArr[1].type}'>${temArr[1].date}</th>
            <th class='${temArr[2].type}'>${temArr[2].date}</th>
            <th class='${temArr[3].type}'>${temArr[3].date}</th>
            <th class='${temArr[4].type}'>${temArr[4].date}</th>
            <th class='${temArr[5].type}'>${temArr[5].date}</th>
            <th class='${temArr[6].type}'>${temArr[6].date}</th>
        </tr>
    `
    return t
}

// 绑定事件
DatePick.prototype.bind = function() {
    // console.log('执行 bind')
    var self = this
    var preArrow = document.querySelector('.pre-arrow')
    preArrow.addEventListener('click', function(){
        console.log('preArrow 被点击')
        var year = self.date.getFullYear()
        var month = self.date.getMonth()
        var newMonth = month
        var newYear = year

        newMonth--
        if(newMonth < 0) {
            newMonth = 11
            newYear--
        }
        console.log('')
        self.date.setMonth(newMonth)
        self.date.setYear(newYear)
        console.log(self.date)
        self.render()
        self.appendDay()
    })

    var nextArrow = document.querySelector('.next-arrow')
    nextArrow.addEventListener('click', function(){
        console.log('nextArrow 被点击')
        var year = self.date.getFullYear()
        var month = self.date.getMonth()
        console.log(year, month)
        var newMonth = month + 1
        var newYear = year
        console.log(newMonth, newYear)
        if(newMonth > 11) {
            console.log('if启动')
            var newMonth = 0
            newYear++
        }
        console.log('')
        self.date.setMonth(newMonth)
        self.date.setYear(newYear)
        console.log(self.date)
        self.render()
        self.appendDay()
    })
}


// 本月的第一天
DatePick.prototype.getFirstDay = function(date) {
    // 把当前月份的日期设置为 1 号
    date.setDate(1)
    return date
}

// 本月的最后一天
DatePick.prototype.getLastDay = function(date) {
    var year = date.getFullYear()
    var month = date.getMonth()
    // 下个月和下一年
    var nextMonth = month + 1
    var newYear = year
    // 如果月份大于 12,则说明到了新的一年，故年数 + 1
    if(month > 11) {
        var nextMonth = 0
        newYear++
    }
    // 求出下个月的第一天
    var newDate = new Date(newYear, nextMonth, 1)
    // 利用下个月的第一天减去一天，得出这个月的最后一天
    var lastDay = new Date(newDate.getTime() - 1000 * 60 * 60 * 24)
    return lastDay
}

var hua = new DatePick()
