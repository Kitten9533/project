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
			this.getType();
			this.getData();
			this.initBanner();
			this.getRecommend();
		},
		bind: function() {
			$('.section-type').on('click', '.type-box', function() {
				var isOn = $(this).hasClass('on');
				var favoritesId = $(this).attr('favoritesid');
				var typename = $(this).attr('typename');
				home.favoritesId = favoritesId;
				window.location.href = 'activity.html?favoritesId=' + favoritesId + '&typeName=' + typename + '&adzoneId=' + home.adzoneId;
				if(isOn) {
					home.getRecommend();
				} else {
					$('.section-type .type-box').removeClass('on');
					$(this).addClass('on');
					home.getRecommend();
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
			$('.icon-search-box').on('click', function() {
				home.searchName = $('#search').val().trim();
				//				home.listPageNum = 1;
				//				home.getData();
				window.location.href = 'search.html?searchName=' + encodeURIComponent(home.searchName) + '&time=' + new Date().getTime();
			});
			$('.recommend-box').on('click', '.recommend-cell-box', function() {
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			//			$('.pro-list').on('click', '.pro-get', function(e) {
			//				e.stopPropagation();
			//				var toUrl = $(this).attr('tourl');
			//				if(!!toUrl) {
			//					window.location.href = toUrl;
			//				}
			//			});
			$('#search').bind('keydown', function(event) {
				if(event.keyCode == "13") {
					home.searchName = $('#search').val().trim();
					window.location.href = 'search.html?searchName=' + encodeURIComponent(home.searchName) + '&time=' + new Date().getTime();
					//					home.listPageNum = 1;
					//					home.getData();
				}
			});
			//			$('.section-search').on('click', function(){
			//				window.location.href = 'search.html?time=' + new Date().getTime();
			//			});
			$('#search').bind('focus', function() {
				$(this).attr('placeholder', null);
			});
			$('#search').bind('blur', function() {
				$(this).attr('placeholder', home.searchPlaceHolder);
			});
			$('.jzzbg').on('click', function() {
				$('.jzzbg').hide();
			});
			$('.pro-list').on('click', '.pro-cell', function() {
				var toUrl = $(this).attr('tourl');
				if(!!toUrl) {
					window.location.href = toUrl;
				}
			});
			$('.modal').on('click', function() {
				$('.modal').hide();
				$('.pop-up').hide();
			})
			$('.pop-up').on('click', '.pop-up-close', function() {
				$('.modal').hide();
				$('.pop-up').hide();
			})
			$('.pop-up').on('click', '.pop-up-btn', function() {
//				$('.modal').hide();
//				$('.pop-up').hide();
				window.location.href = 'https://s.click.taobao.com/9bY0KLw'
			})
			$('.banner-middle-img').on('click', function(){
				window.location.href = 'activityDoubleEleven.html?type=FA_BK&typeName=爆款专区&favoritesId=18710454&adzoneId=' + home.adzoneId;
			});
		},
		getType: function() {
			var data = {
				"items": [{
						"favoritesTitle": "全部",
						"favoritesId": "18539373",
						"type": "2"
					}, {
						"favoritesTitle": "女装",
						"favoritesId": "18536738",
						"type": "2"
					}, {
						"favoritesTitle": "男装",
						"favoritesId": "18536795",
						"type": "2"
					}, {
						"favoritesTitle": "内衣",
						"favoritesId": "18536800",
						"type": "2"
					}, {
						"favoritesTitle": "美妆个护",
						"favoritesId": "18536793",
						"type": "2"
					}, {
						"favoritesTitle": "鞋包配饰",
						"favoritesId": "18536789",
						"type": "2"
					}, {
						"favoritesTitle": "母婴",
						"favoritesId": "18536782",
						"type": "2"
					},
					//				{
					//					"favoritesTitle": "居家",
					//					"favoritesId": "18659696",
					//					"type": "2"
					//				}, 
					{
						"favoritesTitle": "家居家装",
						"favoritesId": "18536777",
						"type": "2"
					},
					{
						"favoritesTitle": "食品",
						"favoritesId": "18536787",
						"type": "2"
					},
					{
						"favoritesTitle": "数码家电",
						"favoritesId": "18536779",
						"type": "2"
					},
					{
						"favoritesTitle": "户外运动",
						"favoritesId": "18536802",
						"type": "2"
					},
				]
			};
			var list = data.items;
			if(list.length == 0) {
				$('.section-type').hide();
				return;
			}
			var str = '';
			for(var i = 0, len = list.length; i < len; i++) {
				var item = list[i];
				str += '<div class="type-box ' + (i == 0 ? "on" : "") + '" favoritesid="' + item.favoritesId + '" typename="' + item.favoritesTitle + '">' +
					'<div class="type-label">' + item.favoritesTitle + '</div>' +
					'</div>';
			}
			$('.section-type').html(str);
			if(list.length > 0 && !!list[0].favoritesId) {
				home.favoritesId = list[0].favoritesId;
			}
			return;
			// 以下原先调接口的，现在弃用
			util.request('business/TbkApiAction/qryFavorites', {
				pageNum: 1,
				pageRow: 10,
			}, function(data) {
				var list = data.items;
				if(list.length == 0) {
					$('.section-type').hide();
					return;
				}
				var str = '';
				for(var i = 0, len = list.length; i < len; i++) {
					var item = list[i];
					str += '<div class="type-box ' + (i == 0 ? "on" : "") + '" favoritesid="' + item.favoritesId + '" typename="' + item.favoritesTitle + '">' +
						'<div class="type-label">' + item.favoritesTitle + '</div>' +
						'</div>';
				}
				$('.section-type').html(str);
				if(list.length > 0 && !!list[0].favoritesId) {
					home.favoritesId = list[0].favoritesId;
				}
			})
		},
		getRecommend: function() {
			//			util.jzz(1);
			var postData = {
				pageNum: 1,
				pageRow: 12,
				adzoneId: !!home.adzoneId ? Number(home.adzoneId) : 0,
				type: 'FA_ZDM',
			}
			//			if(!!home.favoritesId) {
			//				postData.favoritesId = Number(home.favoritesId);
			//				postData.type = '';
			//			}
			util.request('business/TbkApiAction/qryFavoritesItem',
				postData,
				function(data) {
					util.jzz(0);
					home.renderCommend(data.items);
				},
				function(err) {
					util.jzz(0);
				})
		},
		renderCommend: function(list) {
			var _this = this;
			var str = '<div class="swiper-wrapper recommend-wrapper">';
			for(var i = 0, len = list.length; i < len; i++) {
				var item = list[i];
				if(i % 3 == 0) {
					str += '<div class="swiper-slide">';
					str += home.getRecommendStr(item);
				} else if(i % 3 == 1) {
					str += home.getRecommendStr(item);
				} else if(i % 3 == 2) {
					str += home.getRecommendStr(item);
					str += '</div>';
				}
			}
			str += '</div>';
			$('.recommend-box').html(str).append('<div class="swiper-pagination reccommend-swiper-pagination"></div>');
			var mySwiper = new Swiper('.recommend-box', {
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
				pagination: '.reccommend-swiper-pagination',
			});
		},
		getRecommendStr: function(item) {
			return '<div class="recommend-cell-box" tourl="' + item.couponClickUrl + '">' +
				'<div class="recommend-cell">' +
				'<img class="rec-logo" src="' + (item.picUrl || '') + '"/>' +
				'<div class="rec-title">' + (!!item.title ? item.title.trim() : "") + '</div>' +
				'<div class="rec-original-price ' + (!item.reservePrice ? 'hidden' : '') + '">原价：<span class="line-through">￥' +
				(item.reservePrice || '') + '</span></div>' +
				'<div class="rec-price clear">券后价：<span class="price-text">￥' + (item.zkFinalPrice || '') + '</span>' +
				(!!item.couponInfo ? '<div class="rec-coupon-info"><span class="rec-coupon-text">券 </span>' + item.couponInfo + '</div>' : '') +
				'</div>' +
				'</div>' +
				'</div>';
		},
		getData: function() {
			//			util.jzz(1);
			util.request('business/TbkApiAction/qryFavoritesItem', {
				pageNum: home.listPageNum,
				pageRow: home.listPageRow,
				searchName: home.searchName || '',
				adzoneId: !!home.adzoneId ? Number(home.adzoneId) : 0,
				type: 'FA_QB',
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
					'<div class="pro-original-price ' + (!item.reservePrice ? 'hidden' : '') + '">原价：<span class="line-through">￥' +
					item.reservePrice + '</span></div>' +
					'<div class="pro-price">券后价：<span class="price-text">￥' + item.zkFinalPrice + '</span></div>' +
					(!!item.volume ? '<div class="pro-count">销量：' + item.volume + '</div>' : '') +
					(!!item.couponClickUrl ? '<div class="pro-get" tourl="' + item.couponClickUrl + '"><div class="pro-coupon-info">' + (item.couponInfo || "0") + '</div></div>' : '') +
					'</div>' +
					'</div>';
			}
			if(home.listPageNum == 1) {
				$('.pro-list').html(str);
			} else {
				$('.pro-list').append(str);
			}
		},
		initBanner: function() {
			//			var banners = [{
			//					bannerImg: 'img/banner2.jpg',
			//					bannerUrl: '',
			//				}, {
			//					title: '淘宝特卖',
			//					bannerImg: 'img/banner_TBTM.png',
			//					bannerUrl: 'https://s.click.taobao.com/lYcrdLw',
			//				},
			//				//			{
			//				//				title: '爱淘宝',
			//				//				bannerImg: 'img/banner_ATB.png',
			//				//				bannerUrl: 'https://s.click.taobao.com/7Nxn1Mw',
			//				//			},
			//				{
			//					title: '天猫食品',
			//					bannerImg: 'img/banner_TMSP.png',
			//					bannerUrl: 'https://s.click.taobao.com/S6Bs1Mw',
			//				}, {
			//					title: '快抢-天猫超市百里挑一',
			//					bannerImg: 'img/banner_TMCSBLTY.png',
			//					bannerUrl: 'https://s.click.taobao.com/MVwr1Mw',
			//				}, {
			//					title: '超值9.9',
			//					bannerImg: 'img/banner1.jpg',
			//					bannerUrl: 'activity.html?type=FA_CZ&typeName=超值9.9&adzoneId=' + home.adzoneId,
			//				},
			//				// 缺少聚划算 banner
			//				{
			//					title: '淘抢购-天猫必抢',
			//					bannerImg: 'img/banner_TMBQ.png',
			//					bannerUrl: 'https://s.click.taobao.com/oCYs1Mw',
			//				}
			//			];
			var banners = [{
				title: '超级红包链接',
				bannerImg: 'img/banner_1019_1.jpg',
				bannerUrl: 'https://s.click.taobao.com/9bY0KLw',
			}, {
				title: '双十一要抢就彻底的活动',
				bannerImg: 'img/banner_1019_2.png',
				bannerUrl: 'doubleEleven.html?adzoneId=' + home.adzoneId,
			}, {
				title: '聚划算页面',
				bannerImg: 'img/banner_1019_3.jpg',
				bannerUrl: 'https://s.click.taobao.com/780ZGLw',
			}, {
				title: '超值9.9',
				bannerImg: 'img/banner1.jpg',
				bannerUrl: 'activity.html?type=FA_CZ&typeName=超值9.9&adzoneId=' + home.adzoneId,
			}, {
				title: '编号5',
				bannerImg: 'img/banner_1019_5.gif',
				bannerUrl: 'http://engine.gitpapa.com/index/activity?appKey=3Xfki5UgaPvRz343qxj3cZ9C9i8JUmzNkBMG7Qr&adslotId=28020',
			}];
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
	}

	home.init();
	home.bind();
	home.initScroll();
});