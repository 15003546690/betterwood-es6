class Calendar{
    constructor(options){
        if(options){
            this.options = options;
        }else{
            this.options = {
                initDate:new Date(),
                count:3
            }
        }

        this.component = document.querySelector('.pick-date');
        this.render();
        this.bindEvent();
    }

    render(){
        let opt = this.options;
        const initYear = opt.initDate.getFullYear();
        const initMonth = opt.initDate.getMonth();

        if(opt.count){
            let str ='';
            for(let i=0; i<opt.count; i++){
                //由于月份在循环中会出现大于12的情况，此处利用日期对象的容错重新处理日期
                let resetMonth = new Date(initYear,initMonth+i).getMonth()+1;
                let resetYear = new Date(initYear,initMonth+i).getFullYear();
                str += this.renderOneMonth(resetYear,resetMonth)
            }

            this.component.innerHTML =  `<div class="date-component">
                    <header class="header">
                        <span class="left-arrow back"></span>
                        <h2>选择日期</h2>
                    </header>
                    <div class="calendar-days">
                        ${str}    
                    </div>
                </div>`;
        }
    }

    hide(){
        this.component.className = this.component.className.replace(/\s?plugin-active/, '');
    }

    show(callback) {
        this.component.className += ' plugin-active';
        this.callback = callback || function () {
            console.log('你没有写回调函数，请在show方法中添加')
        }
    }

    bindEvent(){
        let that = this;
        let wrap = this.component.querySelector('.calendar-days');
        wrap.addEventListener('click',function (e) {
            let day = 0;
            if(e.target.tagName.toUpperCase() == 'LI'){
                if(e.target.className.indexOf('to-gray')>-1) return;
                day = e.target.innerHTML;
                that.selectedDate = e.target.parentNode.getAttribute('date')+'-'+day;
                that.callback(that.selectedDate);
                that.hide()
            }
        })
    }

    renderOneMonth(year,month){//month{1,12}
        let bd = this.getWeekIndex(year,month);
        let d = this.getDays(year,month);
        let ad = 42-d-bd;

        let start = this.getBeforeDay(year,month);
        let str = '';
        for(let i=0; i<bd; i++){
            str+='<li class="day to-gray">'+(start+i)+'</li>'
        }
        for(let j=0;j<d;j++){
            str+='<li class="day">'+(1+j)+'</li>'
        }
        for(let k=0; k<ad; k++){
            str+='<li class="day to-gray">'+(1+k)+'</li>'
        }
        return `
        <div class="date-item">
            <p>${year}年${month}月</p>
            <p class="week">
                <span>日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
            </p>
            <ul date="${year}-${month}" class="m-date clearfix">${str}</ul>
        </div>`
    }

    getBeforeDay(year,month){
        let [beforeDays,leftDays] = [this.getDays(year,month-1),this.getWeekIndex(year,month)];
        return beforeDays - leftDays + 1;
    }

    getWeekIndex(year,month){
        return new Date(year,month-1,1).getDay();
    }

    getDays(year,month){
        if(month<1){
            year--;
            month = 12
        }
        let days = 0;
        let arr = [1,3,5,7,8,10,12],
            arr2 = [4,6,9,11];
        if(arr.indexOf(month)>-1){
            days=31;
        }else if(arr2.indexOf(month)>-1){
            days = 30
        }else{
            if(year%400==0 || year%100!=0&&year%4==0){
                days = 29
            }else{
                days = 28
            }
        }
        return days;
    }
}


export default Calendar;