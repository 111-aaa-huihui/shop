<template>
	<view class="head">
		<view class="headNav">
			<view class="search_input">
				<u-search placeholder="搜索您想要的产品" :clearabled="false" :show-action="false" border-color="#ffffff"
					search-icon-color="#FFFFFF" bg-color="#FFC15C" input-align="center" placeholder-color="#FFFFFF"
					color="#ffffff" v-model="keywords" @search="goSearch">
				</u-search>
				<view class="swiper">
					<u-swiper :list="swiperList" :effect3d="true" border-radius="30" bg-color="transparent"></u-swiper>
				</view>
				<view class="body">
					<view class="body_box_left" @click="navTo('pages/HotShopto/HotShopto')">
						<view class="navgation">活动商品批发</view>
						<view class="GGfoot">惊喜连连</view>
					</view>
					<view class="body_box_right">
						<view class="right_box" @click="navTo('pages/DailyWholesale/DailyWholesale')">
							<view class="navgation">日常商品批发</view>
							<view class="GGfoot">优惠不断</view>
						</view>
						<view class="right_box1" @click="navTo('pages/SignShopList/SignShopList')">
							<view class="navgation">签约商家商品列表</view>
							<view class="GGfoot">好礼享不停</view>
						</view>
					</view>
				</view>
				<view class="foot">
					<view class="foot_img">
						<view class="foot_bg"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [],
				keywords:""
			}
		},
		methods: {
			loadData(){
				this.$api.http.banner().then(res => {
					let list = res.data;
					let nlist = list.map((item) => {
						return {
							image:item.domain+item.path.substr(1)
						};
					 });
					this.swiperList = nlist;
				});
			},
			//导航跳转
			navTo(url){
				this.$u.route({
					url: url
				})
			},
			goSearch(){
				uni.navigateTo({
					url:"/pages/goods/index?key="+this.keywords
				})
			}
		},
		onLoad(e){
			this.loadData();
			if(e.pid && e.way){
				uni.setStorage({key:"upid",data:e.pid});
				uni.setStorage({key:"way",data:"1"});
			}
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/micromessenger/i) == 'micromessenger') {
				this.$wxin({
					title: "批发商城",
					desc: '一起分享吧...',
					link: window.location.origin+"/#/pages/index/index",
					imgUrl:window.location.origin+"/static/img/shareimg.jpg"
				});
			}
		},
		onShow(){
			this.keywords = "";
			setTimeout(()=> {
				this.loadData();
			}, 2000);
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style lang="scss">
	page{background: #FFFFFF;}
	.head {
		.headNav {
			height: 200rpx;
			flex: 1;
			background: url(../../static/img/indexbg.png) no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-direction: column;

			.search_input {
				flex: 1;
				padding: 20rpx 50rpx;

				.swiper {
					margin-top: 5%;
					height: 275rpx;
				}

				.body {
					margin-top: 5%;
					display: flex;
					justify-content: center;
					// background-color: red;
					height: 550rpx;
					flex-direction: row;

					// flex-flow: column;
					.body_box_left {
						// flex: 0.44;
						width: 272rpx;
						height: 466rpx;
						background: url(../../static/img/168.png) no-repeat;
						background-size: 100% 100%;
						position: relative;
						margin-right: 18rpx;
						.navgation {
							color: #FFFFFF;
							font-size: 30rpx;
							font-weight: 700;
							// margin-top: 15%;
							margin-top:36rpx;
							margin-left:38rpx;
						}

						.GGfoot {
							font-weight: 600;
							font-size: 24rpx;
							color: #FFFFFF;
							// position: absolute;
							// left: 19%;
							margin-left:38rpx;
						}
					}

					.body_box_right {
						// margin-left: 3%;
						// flex: 0.56;
						display: flex;
						// background-color: yellow;
						flex-direction: row-reverse;
						flex-flow: column;
						height: 100%;

						.right_box {
							// width: 100%;
							// height: 47%;
							// margin-bottom: 5%;
							// border-radius: 20rpx;
							width: 371rpx;
							height: 219rpx;
							margin-bottom: 27rpx;
							background: url(../../static/img/169.png) no-repeat;
							background-size: 100% 100%;
							position: relative;
							text-align: right;
							.navgation {
								// position: absolute;
								// right: 13%;
								// margin-top: 15%;
								color: #FFFFFF;
								font-size: 30rpx;
								font-weight: 700;
								margin-top:36rpx;
								margin-right: 40rpx;
							}

							.GGfoot {
								// position: absolute;
								// right: 13%;
								// margin-top: 28%;
								color: #FFFFFF;
								font-size: 24rpx;
								margin-right: 40rpx;
							}
						}

						.right_box1 {
							// width: 100%;
							// height: 47%;
							// margin-top: 5%;
							// border-radius: 20rpx;
							width: 371rpx;
							height: 219rpx;
							background: url(../../static/img/170.png) no-repeat;
							background-size: 100% 100%;
							position: relative;
							text-align: right;
							.navgation {
								// position: absolute;
								// right: 13%;
								// margin-top: 15%;
								color: #FFFFFF;
								font-size: 30rpx;
								font-weight: 700;
								margin-top:36rpx;
								margin-right: 45rpx;
							}

							.GGfoot {
								// position: absolute;
								// right: 13%;
								// margin-top: 28%;
								color: #FFFFFF;
								font-size: 24rpx;
								margin-right: 45rpx;
							}
						}
					}
				}

				.foot {
					margin-top: 10%;
					display: flex;
					flex: 1;
					// background-color: red;
					height: 200rpx;
					justify-content: center;
					align-items: center;

					.foot_bg {
						width: 300rpx;
						height: 150rpx;
						background: yellow;
						background: url(../../static/img/152.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
		}
	}
</style>
