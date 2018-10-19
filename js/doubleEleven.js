require(['zepto', 'swiper', 'util'], function($, Swiper, util) {
	var home = {
		searchName: '', // 搜索框内容
		adzoneId: !!util.getRequest('adzoneId') ? Number(util.getRequest('adzoneId')) : 0,
		firstLoad: false,
		canScroll: true,
		listPageNum: 1,
		listPageRow: 10,
		favoritesId: '', //选品库ID，如果TYPE为空则按这个ID来
		searchPlaceHolder: '输入淘宝关键词查询',
		init: function() {
			home.getData();
		},
		bind: function() {
			$('.jzzbg').on('click', function() {
				$('.jzzbg').hide();
			});
			$('.pro-list').on('click', '.pro-cell', function() {
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			$('.tab-box').on('click', function() {
				var toUrl = $(this).attr('tourl');
				var needadzoneid = $(this).attr('needadzoneid');
				if(!!toUrl) {
					window.location.href = toUrl + (!!needadzoneid && !!util.getRequest('adzoneId') ? (toUrl.indexOf('?') > -1 ? '&' : '?') +
						'adzoneId=' + home.adzoneId : '');
				}
			});
			$('.rule-box-btn').on('click', function(){
				$('.modal').hide();
				$('.rule-box').hide();
			});
			$('.red-packet-rule').on('click', function(){
				$('.modal').show();
				$('.rule-box').show();
			})
			$('.modal').on('click', function(){
				$('.rule-box').hide();
				$('.code-box').hide();
				$('.modal').hide();
			});
			$('.red-packet-get').on('click', function(){
				$('.modal').show();
				$('.code-box').show();
			});
		},
		getData: function() {
//			util.jzz(1);
			util.request('business/TbkApiAction/qryFavoritesItem', {
				pageNum: home.listPageNum,
				pageRow: home.listPageRow,
				searchName: home.searchName || '',
				adzoneId: !!home.adzoneId ? Number(home.adzoneId) : 0,
				type: 'FA_1111',
			}, function(data) {
				home.firstLoad = true;
				util.jzz(0);
				if(data.hasOwnProperty('items')) {
					home.renderList(data.items);
					//					home.canScroll = data.items.length === home.listPageRow;
					//					if (data.items.length < home.listPageRow) {
					home.canScroll = data.hasMore;
					if(data.hasMore != 1) {
						// util.pop('没有更多了');
						$('.no-more').show();
					}
				} else {
					util.pop('没有更多了');
				}
			}, function(err) {
				util.jzz(0);
			});
		},
		renderList: function(list) {
			var str = '';
			for(var i = 0, len = list.length; i < len; i++) {
				var item = list[i];
				str += '<div class="pro-cell" tourl="' + (item.clickUrl || item.couponClickUrl || '') + '">' +
					'<img class="pro-logo" src="' + item.picUrl + '" />' +
					'<div class="pro-content">' +
					'<div class="pro-blank"></div>' +
					'<div class="pro-title">' + (!!item.title ? item.title.trim() : "") + '</div>' +
					(!!item.volume ? '<div class="pro-count">' + item.volume + '笔成交</div>' : '') +
					'<div class="pro-original-price ' + (!item.reservePrice ? 'hidden' : '') + '">原价：<span class="line-through">￥' +
					item.reservePrice + '</span></div>' +
					'<div class="pro-price">到手价：<span class="price-text">￥' + item.zkFinalPrice + '</span></div>' +
					(!!item.couponClickUrl ? '<div class="pro-get clearfix" tourl="' + item.couponClickUrl + '">' + 
					'<div class="pro-coupon-info">券 <span class="currency">￥</span>' + (item.couponInfo || "0") + '</div>' +
					'<div class="pro-get-btn"></div>' +
					'</div>' : '') +
					'</div>' +
					'</div>';
			}
			if(home.listPageNum == 1) {
				$('.pro-list').html(str);
			} else {
				$('.pro-list').append(str);
			}
		},
		initScroll: function() {
			$(window).scroll(function() {
				if($(document).height() - $(this).scrollTop() - $(this).height() < 60) {
					if(home.firstLoad == false) {
						return;
					}
					if(home.canScroll == true) {
						home.listPageNum++;
						home.canScroll = false;
						home.getData();
					}
				}
			})
		},
	};
	home.init();
	home.bind();
	home.initScroll();
});