require(['zepto', 'swiper', 'util'], function($, Swiper, util) {
	var activity = {
		listPageNum: 1,
		listPageRow: 10,
		searchName: '',
		adzoneId: !!util.getRequest('adzoneId') ? Number(util.getRequest('adzoneId')) : 0,
		firstLoad: false,
		canScroll: true,
		type: !!util.getRequest('type') ? util.getRequest('type') : '',
		searchType: 1, // 1：榜单热卖 2：正在抢购
		init: function() {
			this.setTitle();
			this.getList();
		},
		setTitle: function() {
			var title = !!util.getRequest('typeName') ? util.getRequest('typeName') : '活动';
			document.title = title;
			$('.header-content').text(title);
		},
		bind: function() {
			$('.icon-back').on('click', function() {
				history.back();
			})
			//			$('.pro-list').on('click', '.pro-get', function(e) {
			//				e.stopPropagation();
			//				var toUrl = $(this).attr('tourl');
			//				if(!!toUrl) {
			//					window.location.href = toUrl;
			//				}
			//			});
			$('.pro-list').on('click', '.pro-cell', function() {
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			$('.jzzbg').on('click', function() {
				$('.jzzbg').hide();
			});
			$('.type-box').on('click', function() {
				activity.listPageNum = 1;
				$('.type-box').removeClass('on');
				activity.searchType = $(this).attr('type');
				$(this).addClass('on');
				activity.getList();
			});
		},
		getList: function() {
			util.jzz(1);
			var postData = {
				pageNum: activity.listPageNum,
				pageRow: activity.listPageRow,
				type: activity.searchType,
			};
			var postUrl = 'business/TbkApiAction/qryFavoritesItem';
			// 超值, 快抢
			if(activity.type == 'FA_CZ' || activity.type == 'FA_KQ' || activity.type == 'FA_SQ') {
				postData.type = activity.type;
			}
			if(activity.type == 'FA_TQG') {
				postUrl = 'business/TbkApiAction/qryJuTqg';
			}
			if(activity.type == 'FA_JHS') {
				postUrl = 'business/TbkApiAction/qryJuItem';
			}
			if(!!util.getRequest('favoritesId')) {
				postData.favoritesId = util.getRequest('favoritesId') || '';
			}
			if(!!util.getRequest('adzoneId')) {
				postData.adzoneId = !!activity.adzoneId ? Number(activity.adzoneId) : 0;
			}
			util.request(postUrl, postData, function(data) {
				util.jzz(0);
				activity.firstLoad = true;
				if(data.hasOwnProperty('items')) {
					activity.renderList(data.items);
					//					activity.canScroll = data.items.length === activity.listPageRow;
					//					if(data.items.length < activity.listPageRow) {
					activity.canScroll = data.hasMore;
					if(data.hasMore != 1) {
						// util.pop('没有更多了');
						$('.no-more').show();
					}
				} else {
					util.pop('没有更多了');
					$('.no-more').show();
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
					'<div class="pro-original-price ' + (!item.reservePrice ? 'hidden' : '') + '">原价：<span class="line-through">￥' +
					item.reservePrice + '</span></div>' +
					'<div class="pro-price">券后价：<span class="price-text">￥' + item.zkFinalPrice + '</span></div>' +
					(!!item.volume ? '<div class="pro-count"><span class="pro-count-sold">已抢:' + item.soldNum + '</span><span>剩余:' + item.volume + '</span></div>' : '') +
					//					(!!item.couponClickUrl ? '<div class="pro-get" tourl="' + item.couponClickUrl + '"><div class="pro-coupon-info">' + (item.couponInfo || "0") + '</div></div>' : '') +
					'</div>' +
					'</div>';
			}
			if(activity.listPageNum == 1) {
				$('.pro-list').html(str);
			} else {
				$('.pro-list').append(str);
			}
		},
		initScroll: function() {
			$(window).scroll(function() {
				if($(document).height() - $(this).scrollTop() - $(this).height() < 60) {
					if(activity.firstLoad == false) {
						return;
					}
					if(activity.canScroll == true) {
						activity.listPageNum++;
						activity.canScroll = false;
						activity.getList();
					}
				}
			})
		},
	}

	activity.init();
	activity.bind();
	activity.initScroll();
});