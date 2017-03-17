import load from '../component/loading';
let loader = new load();
loader.active();

//通过ES6模块,引用dialog组件
import Dialog from '../component/dialog';
//实例化
let dialog = new Dialog({});

import Calendar from '../component/calendar';
let calendar = new Calendar({
    initDate: new Date(),
    count:4
});

import {getUrlParams,test} from '../component/util';
test();
$('.list-date-in').html(getUrlParams('dateLiveIn')).on('click',function () {
    let el = $(this);
    calendar.show(function (data) {
        el.html(data)
    })
});
$('.list-date-out').html(getUrlParams('dateLeave')).on('click',function () {
    let el = $(this);
    calendar.show(function (data) {
        el.html(data)
    })
});

//请求数据，渲染列表
$.ajax('../data/hotel.json')
    .done(data=>{
       let res = data.result.hotel_list;
       setTimeout(function () {
           $('.hotel-list').html(template(res));//调用渲染函数
           loader.stop();
       },1000);
    })
    .error(()=>{
        dialog.alert('网络错误，请重试',function () {
            window.location.reload();
        })
    });
//利用模板字符串定义渲染函数
const template = data =>{
    return `${
        data.map((value,index)=> {
            return `<dl class="hotel-item"
            price="${
                function(){
                    switch(true){
                        case (value.low_price<10000):return 100;    
                        case (value.low_price<20000):return 200;
                        case (value.low_price<30000):return 300;
                        case (value.low_price<40000):return 400;
                        case (value.low_price<50000):return 500;
                        default:return 1000;    
                    }
                }()}"
             stars="${
                function(){
                    switch (value.stars){
                        case '经济型': return 1;
                            break;
                        case '二星': return 2;
                            break;
                        case '三星': return 3;
                            break;
                        case '四星': return 4;
                            break;
                        case '五星': return 5;
                            break;
                    }
                }()}"
             brand="${value.name}"
             distance="${value.distance}"
             >
            <dt><img src="../${value.image}" alt=""></dt>
            <dd>
                <p class="hotel-title">${value.name}</p>
                <p class="hotel-score"><span>4.7分 <em>礼</em> </span><span class="hotel-price">￥${value.low_price/100}<sub>起</sub></span></p>
                <p class="hotel-grade"><span>${value.stars}</span></p>
                 <p class="hotel-location"><span>${value.addr}</span><span class="hotel-distance">${value.distance}km</span></p>
            </dd>
        </dl>`
        }).join('')//map返回一个数组，数组中的每一项是渲染好的list，利用join将所有的list拼接在一起
        }`.trim();//去掉模板字符串中的换行以及空格
};


let filterBox = $('.filter-items');
$('.filter-nav').on('click',"span",function () {
    if($(this).hasClass('active')){
        filterBox.css('display','none');
        $(this).removeClass('active');
        $('.mask-layer').css({'display':'none','opacity':'0'});
    }else{
        $('.mask-layer').css({'display':'block','opacity':'0.3'});
        $(this).addClass('active').siblings().removeClass('active');
        filterBox.css('display','block');
        filterBox.css('left',-$(this).index()*100+'%');
    }
});
filterBox.on('click','.check-box',function () {
    let el = $(this);
    let index = el.parent().index();
    let type = el.parent().parent().hasClass('distance')? 'distance':'';
    if(type != 'distance'){
        if(el.hasClass('checked')){
            el.removeClass('checked')
        }else{
            el.addClass('checked');

            if(index==0){
                el.parent().siblings().find('.check-box').removeClass('checked');
            }else{
                el.parents('.filter-box').children().eq(0).find('.check-box').removeClass('checked');
            }
        }
    }else{
        if(!el.hasClass('checked')){
            el.addClass('checked');
            el.parent().siblings().find('.check-box').removeClass('checked');
        }
    }

    screen();
});


function screen() {
    let filter_item_list = filterBox.find('.checked');
    let screen_items = {
        stars:[],
        price:[],
        brand:[],
        distance:[]
    };
    //收集所有的筛选信息
    filter_item_list.each(function (index, value) {
        let el = $(this);
        let flag = el.parents('.filter-box').attr('class').split(' ')[1];
        let filter = el.parent().attr(flag);
        if(filter) screen_items[flag].push(filter);
    });

    let wrap = $('.hotel-list');
    wrap.children().css('display','');//在隐藏那些不要的item之前先重置一下，防止叠加
    let filter_collector={};
    //把收集到的信息 转换成jq的属性选择器 的字符串
    for(let i in screen_items){
        filter_collector[i]='';
        if(screen_items[i].length>0){
            for(let j=0; j<screen_items[i].length; j++){
                filter_collector[i]+='['+i+'='+screen_items[i][j]+']'+',';
            }
            filter_collector[i] = filter_collector[i].substring(0,filter_collector[i].length-1);
        }
        if(i!='distance'){
            if(filter_collector[i]=='')continue;//此处不能用return，这样会终止for循环
            wrap.children().not(filter_collector[i]).css('display','none');
        }else{
            if(filter_collector['distance']=='')return;
            let arr = Array.from(wrap.children());
            if(filter_collector['distance'].indexOf('1')>-1){//由近到远
                arr = arr.sort(function (a,b) {
                    return a.getAttribute('distance') - b.getAttribute('distance')
                })
            }else{
                arr = arr.sort(function (a,b) {//由远到近
                    return b.getAttribute('distance') - a.getAttribute('distance')
                })
            }
            for(let i=0; i<arr.length; i++){
                wrap.append(arr[i])
            }
        }
    }
    console.log(filter_collector);
}






