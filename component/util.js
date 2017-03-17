
    function getUrlParams(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }

    function test() {
        console.log('this is function test, you can do something here...add your code...')
    }

    export {getUrlParams,test}