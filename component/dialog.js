var Dialog= function (obj) {

    if(obj.parent == undefined){
        obj.parent = document.body
    }else{
        obj.parent = document.querySelector(obj.parent);
    }

    if(obj.feedback){
        this.feedback = obj.feedback;
    }

    if(!obj.parent.querySelector('.mask-layer')){
        var maskDom = document.createElement('div');
        maskDom.className = 'mask-layer';
        obj.parent.appendChild(maskDom);
        this.mask = maskDom;
    }else{
        this.mask = obj.parent.querySelector('.mask-layer');
    }

    if(!obj.parent.querySelector('.dialog')){
        var dom = document.createElement('div');
        dom.className = 'dialog';
        obj.parent.appendChild(dom);
        this.wrap = dom;
    }else{
        this.wrap = obj.parent.querySelector('.dialog');
    }
    this.title = obj.title || '提示信息';
    if(obj.tpl){
        this.rplDirect = true;
    }
    this.tpl = obj.tpl || '<div class="dialog-wrap"><div class="dialog-title">{{title}}</div><div class="dialog-content"><div class="dialog-info">{{information}}</div><div class="dialog-btns">{{btn}}</div></div></div>';

    this.init();
};
Dialog.prototype = {
    init:function(){
        this.tpl = this.tpl.replace('{{title}}',this.title);
    },
    alert:function(msg,callback){
        if(!this.rplDirect){
            this.tpl = this.tpl.replace('{{information}}',msg).replace("{{btn}}","<span class='dialog-btn ok'>确定</span>");
        }

        this.wrap.innerHTML = this.tpl;

        this.show();

        this.callback = !!callback ? callback:function(){};
        this.bindEvent();
    },
    confirm:function(msg,callback){
        if(!this.rplDirect){
            this.tpl = this.tpl.replace('{{information}}',msg).replace('{{btn}}','<span class="dialog-btn ok">确定</span><span class="dialog-btn cancel">取消</span>');
        }
        this.wrap.innerHTML = this.tpl;
        this.show();

        this.callback = !!callback ? callback:function(){};
        this.bindEvent();
    },
    bindEvent:function(){
        this.wrap.querySelector('.ok').addEventListener('click',function(){
            this.hide();
            this.callback();
        }.bind(this),false);
        if(this.wrap.querySelector('.cancel')){
            this.wrap.querySelector('.cancel').addEventListener('click',function(){
                this.hide()
            }.bind(this),false)
        }
    },
    show:function(){
        this.wrap.className = this.wrap.className+=' dialog-active';
        this.mask.className = this.mask.className+=' mask-show';
        setTimeout(function(){
            this.mask.style.opacity='0.7';
        }.bind(this),10);
        this.flag = false;
        this.feedback && this.feedback(this.wrap.querySelector('.dialog-wrap'));
    },
    _hide:function(){
        if(this.flag){
            this.wrap.className = this.wrap.classList[0];
            this.mask.className = this.mask.classList[0];
            this.destroy();
        }
    },
    hide:function(){
        this.mask.style.opacity = 0;
        this.mask.addEventListener('webkitTransitionEnd',this._hide.bind(this),false);
        this.flag = true;
    },
    destroy:function(){
        this.wrap.innerHTML='';
    }
};


export default Dialog;