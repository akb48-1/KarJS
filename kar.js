
// var $ = window.ak = function (target) {
//  	if (!target) return;
//  	var type = target.substring(0,1),
//  		_target = target.substring(1),
//  		tempArr,
//  		allElement;

//  	if (type == '#') {
//  		return document.getElementById(_target);
//  	}else if (type == '.') {
//  		tempArr = [],
// 			allElement = document.body.childNodes;
// 		for (var i = 0; i < allElement.length; i++) {
// 			if (allElement[i].className == _target) {
// 				tempArr.push(allElement[i])
// 			};
// 		};
// 		return tempArr;
//  	}else if (type !== '<') {
//  		return document.getElementsByTagName(target);
//  	}else {
//  		return document.createTextNode(target);
//  	}
// };

var $ = function (argums) {
	return new kar(argums);
};

function kar(argums) {
	//创建一个存放元素的数组
	this.elements = [];
	if (typeof argums != 'string') return false;
	this.str = argums.charAt(0);
	switch (this.str) {
		case '#':
			this.getId(argums.substring(1));
			break;
		case '.':
			this.getClass(argums.substring(1));
			break;
		default:
			this.getTagName(argums);
			break;
	}
	return this;
};

//获取指定的Id元素
kar.prototype.getId = function (argums) {
	this.elements.push(document.getElementById(argums));
	return this;
};

//获取指定的TagName元素
kar.prototype.getTagName = function (argums) {

	var element = document.getElementsByTagName(argums);
	for (var i = 0; i < element.length; i++) {
		this.elements.push(element[i]);
	};
	return this;
};

//获取指定的Name元素
kar.prototype.getName = function (argums) {
	var element = document.getElementsByName(argums);
	for (var i = 0; i < element.length; i++) {
		this.elements.push(element[i]);
	};
	return this;
};

//获取指定的Class元素
kar.prototype.getClass = function (argums) {

	var element = document.body.childNodes;
	for (var i = 0; i < element.length; i++) {
		var className = element[i].className;
		if (className) {
			if (className.split(/\s+/).indexOf(argums) > -1) {
				this.elements.push(element[i]);
			};
		};

	};
	return this;
};


//添加或者修改样式
kar.prototype.css = function (key, value) {
	var len = arguments.length;

	if (len === 1 && kar.isString(arguments[0])) {
		var style = this.elements[0].currentStyle ? this.elements[0].currentStyle : document.defaultView.getComputedStyle(this.elements[0], null) //兼容IE(前) 与非IE;
		return style[key];
	};
	if (len === 2 && kar.isString(arguments[0]) && kar.isString(arguments[1])) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].style[key] = value;
		};
		return this;
	};
	if (len === 1 && kar.isObject(arguments[0])) {
		for (var i = 0; i < this.elements.length; i++) {
			for (var k in arguments[0]) {
				this.elements[i].style[k] = arguments[0][k];
			}
		};
		return this;
	};


};

//添加点击事件
kar.prototype.on = function (type) {
	var len = arguments.length, 	//实参的个数
		elements = this.elements,	//元素集合
		evt,						//事件名
		target,						//出发事件的元素
		arg1,						//第二个实参
		arg2,						//第三个实参
		eleType,					//选择器是否为class选择器，否则为元素选择器
		className,					//若实参数量大于2，className为第二个实参的class名
		classNameArr;				//触发事件的元素的class集合

	for (var i = 0, j = i; i < this.elements.length; i++) {

		if (len === 2) {
			arg1 = arguments[1];
			kar.addEvent(elements[i], type, arguments[1])
		};
		if (len > 2) {
			arg1 = arguments[1].toLowerCase();
			arg2 = arguments[2];
			eleType = arg1.charAt();
			className = arg1.substring(1, arg1.length);
			if (window.addEventListener) {
				elements[i].addEventListener(type, function () {
					evt = event || window.event;
					target = event.target.tagName.toLowerCase();
					classNameArr = event.target.className.split(/\s+/g);
					var ele, parentNode;
					if (eleType != '.') {  //第二个参数为选择器，并且是元素选择器
						ele = event.target,
							parentNode = ele.parentNode;
						while (parentNode != elements[j]) {
							ele = parentNode;
							parentNode = ele.parentNode;
						}
						if (parentNode == elements[j]) arg2.bind(event.target)();
					} else if (eleType == '.' && kar.searchArr(className, classNameArr)) {	//第二个参数为选择器，并且是class选择器
						arg2.bind(event.target)();
					};
				}, false);
			} else if (window.attachEvent) {
				elements[i].attachEvent('on' + type, function () {
					evt = event || window.event;
					target = event.target.tagName.toLowerCase();
					if (target == arg1) {
						arg2.bind(event.target)();
					};
				});
			};
		};
	};

	return this;
};

//添加指定的className
kar.prototype.addClass = function (className) {
	var exp = new RegExp("\\b" + className + "\\b", "g");
	var newClasss = '';

	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].className.search(exp) === -1) {
			this.elements[i].className += ' ' + className;
			console.log(this.elements[i].className)
		} else return false;
	};
};

//移除指定的className
kar.prototype.removeClass = function (className) {

	for (var i = 0; i < this.elements.length; i++) {
		console.log(this.elements[i].className)
		var tempClasss = this.elements[i].className.split(/\s+/);
		console.log(tempClasss)
		var index = tempClasss.indexOf(className);
		console.log(index, tempClasss)
		if (index >= 0) {
			tempClasss.splice(index, 1)
		} 
		console.log(tempClasss)
		this.elements[i].className = tempClasss.join();
	};
};

//添加或者删除className，有则删除，没有则添加
kar.prototype.toggleClass = function (className) {
	var exp = new RegExp("\\b" + className + "\\b", "g");
	var newClasss = '';
	for (var i = 0; i < this.elements.length; i++) {
		var classArr = this.elements[i].className.split(/\s+/);
		if (this.elements[i].className.search(exp) !== -1) {
			newClasss = kar.del(className, classArr);
			this.elements[i].className = newClasss.join(' ');
		} else {
			this.elements[i].className += ' ' + className;
		};
	};
};

//ajax
$.ajax = function (params) {
	params = params || {};
	params.data = params.data || {};
	params.dataType = (params.dataType || 'JSON').toUpperCase();

	var start = params.dataType === 'JSONP' ? jsonp(params) : json(params);
	function json(params) {
		params.method = (params.method || 'GET').toUpperCase();
		params.async = params.async || true;
		var xhr,
			response = '';

		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		};

		if (params.method === 'GET') {
			xhr.open('GET', params.url + '?' + formatParams(params.data), params.async);
			xhr.send(null);
		} else if (params.method === 'POST') {
			xhr.open('POST', params.url + '?v=' + + random(), params.async);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(formatParams(params.data));
		};;

		xhr.onreadystatechange = function (event) {
			var status = xhr.status;
			if (xhr.readyState === 4) {
				if (status >= 200 && status < 300) {
					var type = xhr.getResponseHeader('Content-type');
					if (type.indexOf('xml') !== -1 && xhr.responseXML) {
						response = xhr.responseXML;
					} else if (type == 'application/json') {
						response = JSON.parse(response);
					} else {
						response = xhr.responseText;
					};

					if (params.success) params.success(response);
					//console.log('请求成功后的回调,readyState=' +xhr.readyState);
				} else {
					//请求失败后的回调
					params.error && params.error({
						'msg': '超时！！',
						'status': status
					});
				}
			};
		};

		xhr.onprogress = function () {	//请求处理前的回调 1
			//console.log('请求处理中的回调,readyState=' +xhr.readyState)
			if (params.before) params.before();
		};

		xhr.onloadend = function () {	//请求完成后的回调 3
			//console.log('加载完成后的回调,readyState=' +xhr.readyState);
			if (params.complete) params.complete();
		};

		xhr.onerror = function () {		//请求错误时的回调
			console.log('错误时的回调,readyState=' + xhr.readyState);
		};

	};

	$.ajax.jsonp = function (params) {
		var callbackName = params.callbackName || 'callback';
		params.data['callback'] = callbackName;
		var data = $.ajax.formatParams(params.data);
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		head.appendChild(script);

		//发送请求
		script.src = params.url + '?' + data;

		//创建jsonp回调函数  
		window[callbackName] = function (json) {
			head.removeChild(script);
			clearTimeout(script.timer);
			window[callbackName] = null;
			params.success && params.success(json);
		};


		//超时处理
		if (params.time) {
			script.timer = setTimeout(function () {
				window[callbackName] = null;
				head.removeChild(script);
				params.error && params.error({
					'msg': '超时'
				});
			}, params.time);
		};
	}



	$.ajax.formatParams = function (obj) {	//格式化data
		var arr = [],
			str = '';
		for (var key in obj) {
			arr.push(key + '=' + obj[key]);
		};
		arr.push('v=' + $.ajax.random());
		str = arr.join('&');
		return str;
	};

	$.ajax.random = function () {
		return Math.floor(Math.random() * 100000 + 666);
	}
};

//查找数组里是否有某个值
kar.searchArr = function (str, arr) {
	return arr.some(function (val, inx, obj) {
		return str == obj[inx]
	})
};

//添加事件绑定
kar.addEvent = function (obj, type, fn) {
	if (window.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if (window.attachEvent) {
		obj.attachEvent('on' + type, fn);
	};
};

//移除事件绑定
kar.removeEvent = function (obj, type, fn) {
	if (document.removeEventListener) {
		obj.removeEventListener(type, fn);
	} else {
		obj.detachEvent('on' + type, fn);
	}
};

//获取元素的top、bottom、left、right距离窗口边界的值
kar.getPosition = function (obj) {
	return obj.getBoundingClientRect();
};

//判断数据类型与是否是某种数据类型
kar.isType = (obj) => { return Object.prototype.toString.call(obj).toLocaleLowerCase().slice(8, -1); }
kar.isArray = (obj) => { return kar.isType(obj) == 'array'; }
kar.isString = (obj) => { return kar.isType(obj) == 'string'; }
kar.isNumber = (obj) => { return kar.isType(obj) == 'number'; }
kar.isObject = (obj) => { return kar.isType(obj) == 'object'; }
kar.isFunction = (obj) => { return kar.isType(obj) == 'function'; }
kar.isDate = (obj) => { return kar.isType(obj) == 'date'; }

/*兼容IE7不存在Array.infexOf。
kar.indexOf = function (value,array) {

	if (!isArray(array)) return false; 
	if (Array.prototype.indexof) {
		Array.prototype.indexof(value);
	}else {
		for (var i = 0; i < array.length; i++) {
			if (value == array[i]) return i;
		};
		return -1;
	}
};
*/


//获取未来若干天数的时间对象
kar.afterTime = function (afterDays, startDay) {
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

//判断是否为某元素的后代元素
kar.isChildNode = function (childNode, parentNode) {
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

kar.setCookie = function (name, value, maxAge) {		//maxAge为天数
	var cookie = name + '=' + encodeURIComponent(value);
	if (kar.isNumber(maxAge)) {
		var c = cookie += ';max-age=' + maxAge * 24 * 60 * 60 + ';path=/;domain=.163.com';
	};
	document.cookie = cookie;
}


kar.canView = function (element, option) {

	var option = option ? option : {};
	// var ON_SCREEN_HEIGHT = 0;
	var ON_SCREEN_HEIGHT = option.height ? option.height : 50;
	// var ON_SCREEN_HEIGHT = Infinity;
	// var ON_SCREEN_WIDTH = 0;
	var ON_SCREEN_WIDTH = option.width ? option.width : 50;
	// var ON_SCREEN_WIDTH = Infinity;

	var isOnScreen = (function () {

		var el = $(element).elements[0];
		console.log(el)
		var rect = el.getBoundingClientRect();
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;	//可视区域高度
		var windowWidth = window.innerWidth || document.documentElement.clientWidth;	//可视区域宽度

		var elementHeight = el.offsetHeight;	//元素高度
		var elementWidth = el.offsetWidth;	//元素宽度

		var onScreenHeight = ON_SCREEN_HEIGHT > elementHeight ? elementHeight : ON_SCREEN_HEIGHT; //元素完整显示在可视区域内
		var onScreenWidth = ON_SCREEN_WIDTH > elementWidth ? elementWidth : ON_SCREEN_WIDTH;	//元素完整显示在可视区域内

		// 元素在屏幕上方
		var elementBottomToWindowTop = rect.top + elementHeight;	//元素在顶部 屏幕还剩余未被占区域高度;
		var bottomBoundingOnScreen = elementBottomToWindowTop >= onScreenHeight; //剩余高度 >= 剩余高度么

		// 元素在屏幕下方
		var elementTopToWindowBottom = windowHeight - (rect.bottom - elementHeight);  //元素在底部 屏幕还剩余未被占区域高度;
		var topBoundingOnScreen = elementTopToWindowBottom >= onScreenHeight;		//剩余高度 >= 剩余高度么

		// 元素在屏幕左侧
		var elementRightToWindowLeft = rect.left + elementWidth;
		var rightBoundingOnScreen = elementRightToWindowLeft >= onScreenWidth;

		// 元素在屏幕右侧
		var elementLeftToWindowRight = windowWidth - (rect.right - elementWidth);
		var leftBoundingOnScreen = elementLeftToWindowRight >= onScreenWidth;

		return bottomBoundingOnScreen && topBoundingOnScreen && rightBoundingOnScreen && leftBoundingOnScreen;
	})();
	return isOnScreen;
};

kar.del = function (member ,array) {

	if (!kar.isArray(array)) return false;
	var index = array.indexOf(member);
	index >= 0 && array.splice(index, 1);
	return array;
};