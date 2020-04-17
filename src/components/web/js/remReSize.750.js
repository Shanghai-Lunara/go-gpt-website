(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var devicePixelRatio = win.devicePixelRatio;
    var dpr = 1; // 物理像素与逻辑像素的对应关系
    var scale = 1; // css像素缩放比率
    // 设置viewport
    function setViewport() {
        dpr = 1;
        win.devicePixelRatioValue = dpr;
        scale = 1 / dpr;
        var metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        }
        else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }
    setViewport();
    var newBase = 100;
    function setRem() {
        var visualView = Math.min(docEl.getBoundingClientRect().width, lib.maxWidth); // visual viewport
        newBase = 100 * visualView / lib.desinWidth;
        docEl.style.fontSize = newBase + 'px';
    }
    var tid;
    lib.desinWidth = 750;
    lib.maxWidth = 750;
    lib.init = function () {
        win.addEventListener('resize', function () {
            clearTimeout(tid);
            tid = setTimeout(setRem, 300);
        }, false);
        win.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(setRem, 300);
            }
        }, false);
        setRem();
        docEl.setAttribute('data-dpr', dpr);
    };
})(window, window['adaptive'] || (window['adaptive'] = {}));

window['adaptive'].desinWidth = 750;// 设计图宽度
window['adaptive'].maxWidth = 750;// 页面最大宽度
window['adaptive'].init();// 调用初始化方法