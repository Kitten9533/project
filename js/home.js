require(['zepto', 'swiper', 'util'], function($, Swiper, util) {
	var home = {
		searchName: '', // 搜索框内容
		adzoneId: util.getRequest('adzoneId'),
		firstLoad: false,
		canScroll: true,
		listPageNum: 1,
		listPageRow: 30,
		init: function() {
			this.getData();
			this.initBanner();
			this.getRecommend();
		},
		bind: function() {
			$('.section-type').on('click', '.type-box', function() {
				var isOn = $(this).hasClass('on');
				if(isOn) {
					home.getData();
				} else {
					$('.section-type .type-box').removeClass('on');
					$(this).addClass('on');
					home.getData();
				}
			});
			$('.tab-box').on('click', function(){
				var toUrl = $(this).attr('tourl');
				if(!!toUrl){
					window.location.href = toUrl;
				}
			});
		},
		getRecommend: function() {
			util.request('business/TbkApiAction/qryFavoritesItem', {
				pageNum: 1,
				pageRow: 50,
				adzoneId: !!home.adzoneId ? Number(home.adzoneId) : 0,
				type: 'FA_ZDM',
			}, function(data) {
				home.renderCommend(data.items);
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
			$('.recommend-box').html(str);
			var mySwiper = new Swiper('.recommend-box', {
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
			});
		},
		getRecommendStr: function(item) {
			return '<div class="recommend-cell-box">' +
				'<div class="recommend-cell">' +
				'<img class="rec-logo" src="' + (item.picUrl || '') + '"/>' +
				'<div class="rec-title">' + (item.title || '') + '</div>' +
				'<div class="rec-original-price">原价：<span class="line-through">' + (item.reservePrice || '') + '</span></div>' +
				'<div class="rec-price">券后价：<span class="price-text">' + (item.zkFinalPrice || '') + '</span></div>' +
				'</div>' +
				'</div>';
		},
		getData: function() {
			util.request('business/TbkApiAction/qryAllCoupon', {
				pageNum: home.listPageNum,
				pageRow: home.listPageRow,
				searchName: home.searchName,
				adzoneId: !!home.adzoneId ? Number(home.adzoneId) : 0,
			}, function(data) {
				home.firstLoad = true;
				if(data.hasOwnProperty('items')) {
					home.renderList(data.items);
					home.canScroll = data.items.length === home.listPageRow;
					if(data.items.length < home.listPageRow){
						util.pop('没有更多了');
					}
				}else {
					util.pop('没有更多了');
				}
			});
		},
		renderList: function(list) {
			var str = '';
			for(var i = 0, len = list.length; i < len; i++) {
				var item = list[i];
				str += '<div class="pro-cell">' +
					'<img class="pro-logo" src="' + item.picUrl + '" />' +
					'<div class="pro-content">' +
					'<div class="pro-blank"></div>' +
					'<div class="pro-title">' + item.title + '</div>' +
					'<div class="pro-original-price">原价：<span class="line-through">' + item.reservePrice + '</span></div>' +
					'<div class="pro-price">券后价：<span class="price-text">' + item.zkFinalPrice + '</span></div>' +
					'<div class="pro-count">销量：' + item.volume +'</div>' +
					'</div>' +
					'</div>';
			}
			if(home.listPageNum == 1){
				$('.pro-list').html(str);
			}else {
				$('.pro-list').append(str);
			}
		},
		initBanner: function() {
			var banners = [{
				bannerImg: 'img/banner1.jpg',
				bannerUrl: '',
			}, {
				bannerImg: 'img/banner2.jpg',
				bannerUrl: '',
			}];
			var _this = this,
				str = '<div class="swiper-wrapper banner-wrapper">';
			for(var i = 0, len = banners.length; i < len; i++) {
				var item = banners[i];
				str += '<div class="swiper-slide" tourl="' + item.bannerUrl + '"><img src=' + item.bannerImg + '></div>';
			};
			str += '</div>';
			$('.section-banner').html(str);
			var mySwiper = new Swiper('.section-banner', {
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
				//				onInit: function(swiper) {
				//					_this.index = swiper.activeIndex;
				//				},
				//				onTap: function(swiper) {
				//					var index = swiper.activeIndex;
				//					MedtapCore.pushNewWindow(banners[index].bannerUrl);
				//				},
				//				onTransitionEnd: function(swiper) {
				//					_this.index = swiper.activeIndex; //切换结束时，告诉我现在是第几个slide
				//				}
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
						console.log(home.listPageNum);
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