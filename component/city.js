class City {
    constructor(data) {
        //获取传递进来的参数（数据）
        this.data = data;
        //查找dom。并缓存以供后面使用
        this.component = document.querySelector('.pick-city');
        //初始化
        this.init();
    }

    init() {
        //根据数据来渲染，返回字符串，应用ES6的模板字符串
        this.render();
        //生成dom
        $(this.component).html(this.tpl);
        //获取每一个字母title的dom距离文档顶端的高度，得到一个对象{"A":189,"B":342}
        this.getPosition();
        //绑定事件
        this.bindEvent();
    }

    bindEvent() {
        let that = this;
        let scroller = this.component.querySelector('.city-content');
        //city 组件的隐藏 通过回退箭头来触发
        this.component.querySelector('.back').onclick = function () {
            this.hide();
        }.bind(this);
        //给侧边栏的字母表绑定事件，根据getPosition得到的对象数据改变scrollTop的值
        $(this.component).on('click','.target-alpha',function () {
            scroller.scrollTop=that.heights[$(this).html()]-45;
        });
        //给所有的城市绑定事件，获取顶级对象文本，传给回调函数
        $(this.component).on('click','[city]',function () {
            that.callback(this.getAttribute('city'));
            //调用hide函数，隐藏组件
            that.hide()
        })
    }

    getPosition(){
        let heights = {};
        $(this.component).find('[alpha]').each(function (index,value) {
            heights[$(this).attr('alpha')] = $(this).offset().top;
        });
        this.heights = heights;
    }

    show(callback) {
        this.component.className += ' plugin-active';
        this.callback = callback || function () {
            console.log('你没有写回调函数，请在show方法中添加')
        }
    }

    hide() {
        this.component.className = this.component.className.replace(/\s?plugin-active/, '');
    }

    render() {
        //获取有数据生成的字母表，渲染dom
        let alpha = this.getAlphabet();
        let str='',str2='',str3='';
        alpha.forEach((value,index)=>{
            str+=`<span class="target-alpha">${value}</span>`
        });
        this.alphalist = str;
        //获取hotlist数据，然后渲染
        let hotList = this.data.hotList;
        hotList.forEach((value,index)=>{
            str2+=`<span city="${value[0]}">${value[0]}</span>`
        });
        this.hotList = str2;
        //根据cityList渲染整个城市数据
        let cityList = this.classifyData;
        
        cityList.forEach((v,i)=>{
            str3+=`<div class="city-alpha-list">
                    <p class="city-title" alpha="${v.alpha}">${v.alpha}</p>
                    <ul class="city-area">
                        \{list\}
                    </ul>
                </div>`;
            let str4 ='';
            v['data'].forEach((val,idx)=>{
                str4+=`<li city="${val[0]}">${val[0]}</li>`
            });
            str3 = str3.replace('{list}',str4);
        });

        this.cityList = str3;
        this.tpl = `<div class="city-component">
        <header class="header">
            <span class="left-arrow back"></span>
            <h2>选择城市</h2>
        </header>
        <div class="city-content">
            <div class="city-wrap-hot">
                <div class="city-title">热门城市</div>
                <div class="city-area clearfix">
                    ${this.hotList}
                </div>
            </div>
            <div class="city-wrap">
                ${this.cityList}
            </div>
        </div>
        <div class="city-alphabet">
            ${this.alphalist}
        </div>
    </div>`;
    }

    getAlphabet(){
        let [data,alphabet,alphaobj] = [this.data.cityList,[],{}];
        data.forEach((v,i)=>{
            let upperAlpha = v[1].charAt(0).toUpperCase();
            if(alphabet.indexOf(upperAlpha)==-1){
                alphabet.push(upperAlpha);
                alphaobj[upperAlpha] = [];
            }
            alphaobj[upperAlpha].push(v);
        });
        let arr=[];
        for(let i in alphaobj){
            arr.push({
                alpha:i,
                data:alphaobj[i]
            })
        }
        this.classifyData = arr.sort(function(a,b){
            return a.alpha.charCodeAt(0) - b.alpha.charCodeAt(0)
        });

        return alphabet.sort();
    }
}


export default City;