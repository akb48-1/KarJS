(function (global) {
    'use strict'
    var Kar = (function () {

        // 定义基础类
        class Kar {
            constructor(name) {
                this.count = 1;
                this.name = name;
            }
            a() {
                console.log(this)
            }
        };

        // window.location
        Kar.host = {
            version: global.browser,
            host: global.location.host,
            hostname: global.location.hostname,
            href: global.location.href,
            origin: global.location.origin,
            pathname: global.location.pathname,
            hash: global.location.hash
        };
        //  正则
        Kar.regexp = {
            chinese: /^[\u4E00-\u9FA5]+$/,
            date: /^\d{4}-\d{2}-\d{2}$/,
            email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            hex: /^([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
            integer: /^\d+$/,
            phone: /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|147[0-9]{8}|17[0678][0-9]{8}|(0\d{2,3})?(\d{7,8}))$/,
            tel: /^(0\d{2,3})?(\d{7,8})$/,
            uname: /^[\u4E00-\u9FA5\a-zA-Z]{2,15}$/,
            year: /^\d{4}$/
        };

        //判断数据类型与是否是某种数据类型
        Kar.isArray = (obj) => { return Kar.isType(obj) == 'array'; }
        Kar.isString = (obj) => { return Kar.isType(obj) == 'string'; }
        Kar.isNumber = (obj) => { return Kar.isType(obj) == 'number'; }
        Kar.isObject = (obj) => { return Kar.isType(obj) == 'object'; }
        Kar.isFunction = (obj) => { return Kar.isType(obj) == 'function'; }
        Kar.isDate = (obj) => { return Kar.isType(obj) == 'date'; }
        //判断是否为某元素的后代元素
        Kar.isChildNode = (childNode, parentNode) => {
            var parent = childNode.parentNode;

            while (parent != null) {
                if (parent != parentNode) {
                    childNode = parent;
                    parent = childNode.parentNode;
                } else {
                    return true;
                };
            };
            return false;
        };
        //判断是是否为dom元素
        Kar.isDOM = (typeof HTMLElement === 'object') ?
            (obj) => obj instanceof HTMLElement :
            (obj) => obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';

        Kar.isType = (obj) => {
            if (Kar.isDOM(obj)) return 'DOM';
            return Object.prototype.toString.call(obj).toLocaleLowerCase().slice(8, -1);
        };

        //获取未来若干天数的时间对象
        Kar.afterTime = function (afterDays, startDay) {
            if (typeof Number(afterDays) != 'number') return false;
            var startDay = startDay || new Date();
            var timeNum = Number(afterDays) * 24 * 60 * 60 * 1000 + Date.parse(startDay);
            var nowDay = new Date(timeNum);
            return {
                year: nowDay.getFullYear(),
                month: nowDay.getMonth() + 1,
                date: nowDay.getDate(),
                day: nowDay.getDay(),
                hours: nowDay.getHours(),
                minutes: nowDay.getMinutes(),
                seconds: nowDay.getSeconds(),
                mill: nowDay.getMilliseconds(),
                time: nowDay.getTime()
            }
        };

        //设置cookie
        Kar.setCookie = function (name, value, maxAge) {		//maxAge为天数
            var cookie = name + '=' + encodeURIComponent(value);
            if (Kar.isNumber(maxAge)) {
                cookie += ';max-age=' + maxAge * 24 * 60 * 60 + ';path=/;';
            };
            document.cookie = cookie;
        }

        //_designMode
        const _designMode = {
            // 观察者模式
            observer: function () {
                var list = {},      // 订阅者列表
                    listen,         // 订阅
                    trigger,        // 发布
                    remove;         // 取消订阅
                listen = function (key, fn) {
                    if (!list[key]) {
                        list[key] = [];
                    }
                    list[key].push(fn);
                };
                trigger = function () {
                    var key = Array.prototype.shift.call(arguments),
                        fns = list[key];
                    if (!fns || fns.length === 0) {
                        return false;
                    }
                    for (var i = 0, fn; fn = fns[i++];) {
                        fn.apply(this, arguments);
                    }
                };
                remove = function (key, fn) {
                    var fns = list[key];
                    if (!fns) {
                        return false;
                    }
                    if (!fn) {
                        fns && (fns.length = 0);
                    } else {
                        for (var i = fns.length - 1; i >= 0; i--) {
                            var _fn = fns[i];
                            if (_fn === fn) {
                                fns.splice(i, 1);
                            }
                        }
                    }
                };
                return {
                    listen: listen,
                    trigger: trigger,
                    remove: remove
                }
            }
        };

        // _ext
        const _ext = {
            say: function (name) {
                console.log('my name is ' + name);
            },
            hello: function (name) {
                console.log('hello ' + name);
            },
            // 锚点到该区块
            toSection: function (param, option) {
                if (!Kar.isArray(param)) return false;
                var catalog = null;                 // 目录元素
                var chapter = null;                 // 章节元素
                var disparity = 0;                  // 调整差值
                var option = option || {};
                var speed = option.speed || 'slow';     // 默认速度
                var onClick = option.onClick || function () { };

                for (let obj of param) {

                    (function (obj, disparity) {

                        var catalog = obj['catalog'];
                        var chapter = obj['chapter'];
                        var disparity = parseInt(obj['disparity']) || disparity;

                        $(catalog).on('click', function () {
                            $('html').animate({
                                scrollTop: Kar.view.toDocumentTop(chapter) + disparity
                            }, speed, () => onClick(1121));
                        });
                    })(obj, disparity)
                }
            },
            // 切换显示目录章节
            toggleTab: function (catalogs, chapters, option) {
                console.log(catalogs, chapters, option);
                if (!$(catalogs).length) return;

                var maxLen = $(catalogs).length;
                var $catalogs = $(catalogs);
                var $chapters = $(chapters);
                var option = option || {};
                var event = option.event || 'click';
                var defaultClass = option.klass || 'current';
                var initialIndex = (option.initialIndex > 0) ? (option.initialIndex >= maxLen ? maxLen - 1 : option.initialIndex) : 0;
                var onChange = option.onChange || function () { };
                var prev = null;
                var next = null;
                var autoCutover = option.autoCutover || false;
                var timer;

                $catalogs.addClass('kar-ToggleTab-catalogs');
                $chapters.addClass('kar-ToggleTab-chapters');

                var changeShow = function (target, index) {
                    target.removeClass(defaultClass).eq(index).addClass(defaultClass);
                };
                changeShow($catalogs, initialIndex);
                changeShow($chapters, initialIndex);

                var $that;
                var changeEvent = function (evt) {
                    $that = $(this);
                    var currentIndex = $that.index();

                    changeShow($catalogs, currentIndex);
                    changeShow($chapters, currentIndex);
                    prev = $that.prev(catalogs).index();
                    next = $that.next(catalogs).index();

                    onChange(prev, currentIndex, next);
                };

                switch (event) {
                    case 'hover':
                        $catalogs.hover(function (evt) {
                            changeEvent.call(this, evt);
                            if (timer) clearInterval(timer);
                        }, function () { });
                        break;
                    default:
                        $catalogs.on('click', function (evt) {
                            changeEvent.call(this, evt);
                            if (timer) clearInterval(timer);
                        });
                };

                // 开启自动切换
                if (autoCutover) {
                    (function () {
                        var count = initialIndex;
                        timer = setInterval(() => {
                            count++;
                            if (count >= maxLen) count = 0;
                            changeShow($catalogs, count);
                            changeShow($chapters, count);
                            onChange($catalogs.eq(count).prev(catalogs).index(), count, $catalogs.eq(count).next(catalogs).index());
                        }, 3000);
                    })();
                }
            }

        };

        // _view
        const _view = {

            // 元素距离ducument顶部的距离
            toDocumentTop: function (target) {
                var offsetTop = 0;
                var target = Kar.isDOM(target) ? target : $(target)[0];
                var node = target;

                while (node) {
                    offsetTop += node.offsetTop;
                    node = node.offsetParent;
                };

                return offsetTop;
            },
            // 添加回到顶部按钮事件
            scroolTop: function (param) {
                if (!param) return false;

                var param = param;
                var $goTop = $(param.target);                   // 实例元素，必填
                var range = parseInt(param.range) || 100;       // 滚动条距离顶部range像素后才显示
                var speed = param.speed || 'slow';                 // 滚动条滚动速度
                var onReady = param.onReady || function () { };     // 实例初始化成功后的回调
                var onClick = param.onClick || function () { };    // 点击实例元素后的回调
                var that = $goTop[0];

                // 添加回到顶部事件
                $goTop.on('click', function () {
                    $('html').animate({
                        scrollTop: 0
                    }, speed, () => onClick(that));
                });

                // 显示、隐藏条件
                var showRule = function () {
                    setTimeout(function () {
                        var _top = $(global).scrollTop();
                        if (_top >= range) {
                            $goTop.fadeIn();
                        } else {
                            $goTop.fadeOut();
                        }
                    }, 100);
                };

                $(global).on('scroll', showRule);
                onReady(that);
            },
            lightPopup: function (param) {

            },
            //警示框
            warningPopup: function (param) {
                var param = param || {};
                var status = param.status || 'success';
                var node = param.node || '';
                var callback = param.callback || function() {};
                var $i;
                var $span = `<span>${node}</span>`
                switch (status) {
                    case 'success':
                        $i = '<i class="success-icon kar-warning-icon">success</i>';
                        break;
                    case 'failure':
                        $i = '<i class="failure-icon kar-warning-icon">failure</i>';
                        break;
                    case 'info':
                        $i = '<i class="info-icon kar-warning-icon">info</i>';
                        break;
                
                    default:
                        break;
                }
                var wrapperStyle = 'position: fixed;left: 0;top: 0;right: 0;bottom: 0;display:none';
                var maskStyle = 'display: block;width: 100%;height: 100%;background - color: #000;opacity: .3;position: absolute;left: 0;top: 0;background-color: #000;';
                var contentStyle = 'position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -100%);transform: translate(-50%, -100%);background-color: #fff;box-shadow: 0px 0px 1px #ccc;padding: 30px 35px;width:300px;border-radius: 6px;'
                var headerStyle = '';
                var bodyStyle = 'padding:15px 0;text-align: center;';
                var footerStyle = 'height:30px';
                var $popup = $(`<div class="kar-warning-wrapper" style="${wrapperStyle}">
                                <div class="kar-warning-mask" style="${maskStyle}"></div>
                                <div class="kar-warning-content" style="${contentStyle}">
                                    <div class="kar-warning-header" style="${headerStyle}">
                                        <p class="kar-warning-title">提示</p>
                                    </div>
                                    <div class="kar-warning-body" style="${bodyStyle}">
                                        ${$i} ${$span}
                                    </div>
                                    <div class="kar-warning-footer" style="${footerStyle}"></div>
                                </div>
                            </div>`)
                    $('body').append($($popup));
                    $($popup).fadeIn(800, function () {
                        $(this).fadeOut(2800, function () {
                            $(this).remove();
                            callback();
                        })
                    })
            }
        };

        Kar.ext = { ..._ext };
        Kar.view = { ..._view };
        Kar.designMode = { ..._designMode };

        return Kar;

    })();

    global.Kar = Kar;

})(window)