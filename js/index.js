let swipe = require('../lib/swiper');
new swipe('.swiper-container',{
    autoplay: 3000,
    loop:true
});


//通过ES6模块,引用dialog组件
import Dialog from '../component/dialog';
//实例化
let dialog = new Dialog({});


//获取城市数据
let cities = require('../data/cityData');
//ES6原生模块
import City from '../component/city';
//将城市数据传给city module
let cityComponent = new City(cities);

$('.data-city').on('click',function () {
    let el = this;
    //city module callback
    cityComponent.show(function (data) {
        el.innerHTML = data;
    });
});

//引用calendar组件，通过ES6模块
import Calendar from '../component/calendar';
//实例化calendar组件
let cal = new Calendar({
    initDate: new Date(),
    count: 3
});
$('.data-live-in').on('click',function () {
    let el = $(this);
    cal.show(function (date) {
        el.html(date)
    })
});
$('.data-leave').on('click',function () {
    let el = $(this);
    cal.show(function (date) {
        el.html(date)
    })
});

$('.search').on('click',function () {
    let city = $('.data-city').html().trim(),
        liveIn = $('.data-live-in').html().trim(),
        leave = $('.data-leave').html().trim();
    if(city && liveIn && leave){
        location.href = encodeURI(`list.html?city=${city}&dateLiveIn=${liveIn}&dateLeave=${leave}`);
    }else{
        dialog.alert('请您选择完整信息',function () {
            
        })
    }
});


