require(['zepto', 'swiper', 'util'], function($, Swiper, util) {
	var activity = {
		listPageNum: 1,
		listPageRow: 10,
		searchName: '',
		adzoneId: !!util.getRequest('adzoneId') ? Number(util.getRequest('adzoneId')) : 0,
		firstLoad: false,
		canScroll: true,
		type: !!util.getRequest('type') ? util.getRequest('type') : '',
		init: function() {
			this.initBanner();
			this.getList();
		},
		bind: function() {
			$('.pro-list').on('click', '.pro-get', function(e) {
				e.stopPropagation();
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			$('.pro-list').on('click', '.pro-cell', function() {
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			$('.jzzbg').on('click', function() {
				$('.jzzbg').hide();
			});
		},
		initBanner: function() {
			var banners = [{
					bannerImg: 'img/banner2.jpg',
					bannerUrl: '',
				}, {
					title: '淘宝特卖',
					bannerImg: 'img/banner_TBTM.png',
					bannerUrl: 'https://s.click.taobao.com/ZqLr1Mw',
				},
				//			{
				//				title: '爱淘宝',
				//				bannerImg: 'img/banner_ATB.png',
				//				bannerUrl: 'https://s.click.taobao.com/7Nxn1Mw',
				//			},
				{
					title: '天猫食品',
					bannerImg: 'img/banner_TMSP.png',
					bannerUrl: 'https://s.click.taobao.com/S6Bs1Mw',
				}, {
					title: '快抢-天猫超市百里挑一',
					bannerImg: 'img/banner_TMCSBLTY.png',
					bannerUrl: 'https://s.click.taobao.com/MVwr1Mw',
				}, {
					title: '超值9.9',
					bannerImg: 'img/banner1.jpg',
					bannerUrl: 'activity.html?type=FA_CZ&adzoneId=' + activity.adzoneId,
				},
				// 缺少聚划算 banner
				{
					title: '淘抢购-天猫必抢',
					bannerImg: 'img/banner_TMBQ.png',
					bannerUrl: 'https://s.click.taobao.com/oCYs1Mw',
				}
			];
			var _this = this,
				str = '<div class="swiper-wrapper banner-wrapper">';
			for(var i = 0, len = banners.length; i < len; i++) {
				var item = banners[i];
				str += '<div class="swiper-slide" tourl="' + item.bannerUrl + '"><img src=' + item.bannerImg + '></div>';
			};
			str += '</div>';
			str += '<div class="swiper-pagination banner-swiper-pagination"></div>';
			$('.section-banner').html(str);
			var mySwiper = new Swiper('.section-banner', {
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
				pagination: '.banner-swiper-pagination',
			});
			$('.banner-wrapper').on('click', '.swiper-slide', function() {
				var tourl = $(this).attr('tourl');
				if(!!tourl) {
					window.location.href = tourl;
				}
			});
		},
		getList: function() {
			util.jzz(1);
			var postData = {
				pageNum: activity.listPageNum,
				pageRow: activity.listPageRow,
			};
			var postUrl = 'business/TbkApiAction/qryFavoritesItem';
			// 超值, 快抢
			if(activity.type == 'FA_CZ' || activity.type == 'FA_KQ') {
				postData.adzoneId = !!activity.adzoneId ? Number(activity.adzoneId) : 0;
				postData.type = activity.type;
			}
			if(activity.type == 'FA_TQG') {
				postUrl = 'business/TbkApiAction/qryJuTqg';
				postData.adzoneId = !!activity.adzoneId ? Number(activity.adzoneId) : 0;
			}
			if(activity.type == 'FA_JHS') {
				postUrl = 'business/TbkApiAction/qryJuItem';
			}
			util.request(postUrl, postData, function(data) {
				util.jzz(0);
				activity.firstLoad = true;
				if(data.hasOwnProperty('items')) {
					activity.renderList(data.items);
//					activity.canScroll = data.items.length === activity.listPageRow;
//					if(data.items.length < activity.listPageRow) {
					activity.canScroll = data.hasMore;
					if(data.hasMore != 1){
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
				str += '<div class="pro-cell" tourl="' + item.clickUrl + '">' +
					'<img class="pro-logo" src="' + item.picUrl + '" />' +
					'<div class="pro-content">' +
					'<div class="pro-blank"></div>' +
					'<div class="pro-title">' + (!!item.title ? item.title.trim() : "") + '</div>' +
					'<div class="pro-original-price ' + (!item.reservePrice ? 'hidden' : '') + '">原价：<span class="line-through">' +
					item.reservePrice + '</span></div>' +
					'<div class="pro-price">券后价：<span class="price-text">' + item.zkFinalPrice + '</span></div>' +
					(!!item.volume ? '<div class="pro-count">销量：' + item.volume + '</div>' : '' ) +
					(!!item.couponClickUrl ? '<div class="pro-get" tourl="' + item.couponClickUrl + '"><div class="pro-coupon-info">' + (item.couponInfo || "0") + '</div></div>' : '') +
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