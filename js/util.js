define(['zepto'], function($) {
	// 获取链接参数
	//	var getRequest = function(strParame) {
	//		var args = new Object();
	//		var query = window.location.search.substring(1);
	//		var pairs = query.split("&");
	//		for(var i = 0; i < pairs.length; i++) {
	//			var pos = pairs[i].indexOf('=');
	//			if(pos == -1) continue;
	//			var argname = pairs[i].substring(0, pos);
	//			var value = pairs[i].substring(pos + 1);
	//			value = decodeURIComponent(value);
	//			args[argname] = value;
	//		}
	//		args[strParame] = args[strParame] || "";
	//		return args[strParame];
	//	};
	var getRequest = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = encodeURI(window.location.search).substr(1).match(reg);
		if(r != null) return decodeURI(unescape(r[2]));
		return null;
	}

	var request = function(url, params, success, error) {
		// jzz(1);
		$.ajax({ 
			url: 'http://wap.iwangzha.cn/tbkServer/' + url,
			data: JSON.stringify(params),
			type: 'post',
			dataType: 'json',
			contentType: "application/json",
			async: true,
			success: function(data) {
//				jzz(0);
				if(data.resultCode == 0) {
					success && success(data.data);
				} else {
					pop(data.resultMsg);
				}
			},
			error: function(err) {
				jzz(0);
//				error && error();
//				pop('获取信息失败，请重试。Error： ' + err);
			}
		});
	}

	//信息提示3秒消失，popupSuccessToast、popupErrorToast控件之后替代该效果。
	var pop = function(msg) {
		var b = $("body");
		b.append("<div class='winPop'>" + msg + "</div>");
		var a = setTimeout(function() {
			var a = $(".winPop");
			a.remove();
			clearTimeout(a);
		}, 3000);
	};

	var jzz = function(opt) { //用于显示加载中效果的方法，参数1代表显示效果，0代表隐藏效果
		var a = $(".jzzbg");
		if(a.attr("has")) {
			if(opt == 1) {
				a.show();
			}
			if(opt == 0) {
				a.hide();
			}
		} else {
			var html = '<div class="jzzbg" has="true"><div class="jzz"></div></div>';
			var b = $("body");
			b.append(html);
			var c = $(".jzzbg");
			if(opt == 1) {
				c.show();
			}
			if(opt == 0) {
				c.hide();
			}
		}
	}

	return {
		getRequest: getRequest,
		request: request,
		pop: pop,
		jzz: jzz,
	}
})