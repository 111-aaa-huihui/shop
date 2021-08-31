<template>
	<view class="body">
		<view class="head">
			<view class="left">我的</view>
			<view class="center"></view>
			<view class="right">
				<view class="right_box" style="margin-right: 20rpx;" @click="navTo('/pages/notice/index',true)">
					<image src="/static/img/206.png" mode="aspectFit" style="width: 37rpx;height: 43rpx;"></image>
					<view class="right_size">通知</view>
				</view>
				<view class="right_box" @click="navTo('/pages/service/index',true)">
					<image src="/static/img/205.png" mode="aspectFit" style="width: 42rpx;height: 42rpx;"></image>
					<view class="right_size">客服</view>
				</view>
			</view>
		</view>
		<view class="head_body">
			<view class="left_tag">
				<u-avatar :src="avatar" size="large" class="img"></u-avatar>
			</view>
			<view class="center_body" v-if="hasLogin=='true'">
				<view class="number" v-if="userInfo.nickname">{{userInfo.nickname||"微信用户"}}</view>
				<view class="number" v-else>{{userInfo.mobile||"用户昵称"}}</view>
				<view class="yue">
					我的余额：<text class="yellowSize">{{userInfo.balance||"0.00"}}</text>
				</view>
			</view>
			<view class="center_body" @click="navTo('/pages/login/login')" v-else>
				<view class="number">登录/注册</view>
			</view>
		</view>
		<view class="address" @click="navTo('/pages/address/index',true)">
			<text>我的收货地址</text>
			<view class="right">
				<u-icon size="10" name="/static/img/202.png" class="footIcon"></u-icon>
			</view>
		</view>
		<view class="card">
			<view class="card_body">
				<view class="title">用户订单</view>
				<view class="card_view">
					<view class="card_item" @click="navTo('/pages/order/order?type=1', true)">
						<view class="icon">
							<image src="/static/img/207.png" mode="aspectFit" style="width: 54rpx;height: 54rpx;"></image>
						</view>
						<view class="right_size">待付款</view>
					</view>
					<view class="card_item" @click="navTo('/pages/order/order?type=2', true)">
						<view class="icon">
							<image src="/static/img/81.png" mode="aspectFit" style="width: 54rpx;height: 54rpx;"></image>
						</view>
						<view class="right_size">待发货</view>
					</view>
					<view class="card_item" @click="navTo('/pages/order/order?type=3', true)">
						<view class="icon">
							<image src="/static/img/82.png" mode="aspectFit" style="width: 58rpx;height: 54rpx;"></image>
						</view>
						<view class="right_size">待收货</view>
					</view>
					<view class="card_item" @click="navTo('/pages/order/order?type=4', true)">
						<view class="icon">
							<image src="/static/img/91.png" mode="aspectFit" style="width: 54rpx;height: 54rpx;"></image>
						</view>
						<view class="right_size">待评价</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card_body">
				<view class="title">合作商家</view>
				<view class="card_view">
					<view class="card_item" @click="navTo('/pages/AuthorizationLimit/AuthorizationLimit', true)">
						<view class="icon">
							<image src="/static/img/95.png" mode="aspectFit" style="width: 50rpx;height: 49rpx;"></image>
						</view>
						<view class="right_size">授权额度</view>
					</view>
					<!-- <view class="card_item" @click="navTo('/pages/order/shopOrder', true)">
						<view class="icon">
							<image src="/static/img/221.png" mode="aspectFit" style="width: 37rpx;height: 49rpx;"></image>
						</view>
						<view class="right_size">商家订单</view>
					</view> -->
					<view class="card_item" @click="navTo('/pages/Feedback/coupleback', true)">
						<view class="icon">
							<image src="/static/img/222.png" mode="aspectFit" style="width: 57rpx;height: 49rpx;"></image>
						</view>
						<view class="right_size">留言反馈</view>
					</view>
					<view class="card_item" @click="navTo('/pages/gift/gift', true)">
						<view class="icon">
							<image src="/static/img/96.png" mode="aspectFit" style="width: 49rpx;height: 49rpx;"></image>
						</view>
						<view class="right_size">礼品赠品</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card_body">
				<view class="title">邀请功能</view>
				<view class="card_view">
					<view class="card_item" @click="navTo('/pages/qrcode/qrcode', true)">
						<view class="icon">
							<image src="/static/img/101.png" mode="aspectFit" style="width: 46rpx;height: 45rpx;"></image>
						</view>
						<view class="right_size">邀请二维码</view>
					</view>
					<view class="card_item" @click="navTo('/pages/WechatInvitate/WechatInvitate', true)">
						<view class="icon">
							<image src="/static/img/238.png" mode="aspectFit" style="width: 55rpx;height: 45rpx;"></image>
						</view>
						<view class="right_size">微信邀请</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card_body">
				<view class="foot" @click="navTo('/pages/Feedback/Feedback', true)">
					<text class="text">意见反馈</text>
					<view class="right">
						<u-icon size="10" name="/static/img/202.png" class="footIcon"></u-icon>
					</view>
				</view>
				<view class="foot" @click="navTo('/pages/recharge/recharge', true)">
					<text class="text">话费充值</text>
					<view class="right">
						<u-icon size="10" name="/static/img/202.png" class="footIcon"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="loginOut" v-if="hasLogin=='true'">
			<u-button :custom-style="customStyle" :ripple="true" shape="circle" @click="loginOut()">退出登录</u-button>
		</view>
		<view class="place" v-else></view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				customStyle: {
					backgroundColor: '#FF9D00',
					border: '#FF9D00',
					color: '#FFFFFF'
				},
			}
		},
		computed: {
		    ...mapGetters(['hasLogin','userInfo','avatar'])
		},
		methods: {
			...mapMutations(['logout','storeUser']),
			//导航跳转
			navTo(url, loginCheck = false){
				if(loginCheck && this.hasLogin=="false"){
					uni.showToast({
						title: '您还未登录，请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url:"/pages/login/login"
					})
					return;
				}
				uni.navigateTo({ url })
			},
			getUserInfo(){
				this.$api.http.getUserInfo().then((res)=>{
					if(res.code == 200){
						this.storeUser(res.data);
					}
				})
			},
			//退出
			loginOut(){
				uni.showModal({
					title:"提示",
					content: '确定要退出登录吗？',
					confirmColor:"#FF9D00",
					success: (e)=>{
						if(e.confirm){
							setTimeout(()=>{
								this.logout();
								uni.navigateTo({
									url:"/pages/login/login"
								})
							}, 800)
						}
					}
				});
			}
		},
		onLoad(){
			let info = uni.getStorageSync("userinfo");
			this.getUserInfo();
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
			document.title = '批发商城';
			let info = uni.getStorageSync("userinfo");
			if(!info){
				this.getUserInfo();
			}
		}
	}
</script>

<style lang="scss">
	page{background: #FFFFFF;}
	.body {
		.head {
			display: flex;
			flex: 1;
			padding:0 43rpx 36rpx 50rpx;
			/* #ifdef H5 */
			padding-top:36rpx;
			/* #endif */

			.left {
				font-size: 48rpx;
				font-weight: 550;
			}

			.center {
				flex: 1
			}

			.right {
				display: flex;
				align-items: center;
				.right_box {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.right_size {
						font-size: 18rpx;
						// letter-spacing: 2rpx;
					}
				}
			}
		}

		.head_body {
			display: flex;
			align-items: center;
			flex: 1;
			padding: 0 50rpx;
			.left_tag {
				width:109rpx;
				height: 109rpx;
				flex-shrink: 0;
				margin-right: 30rpx;
				position: relative;
				.img {
					width:100%;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					line-height: 100%;
					vertical-align: center;
				}
			}

			.center_body {
				flex-direction: row-reverse;
				.number {
					font-size: 36rpx;
					font-weight: 550;
					letter-spacing: -2rpx;
					margin-bottom:11rpx;
				}

				.yue {
					font-weight: 550;
					.yellowSize {
						color: #FF9D00;
					}
				}
			}
		}

		.address {
			color: #000000;
			font-weight: 550;
			font-size: 24rpx;
			// box-shadow:4px 4px 2px #f5f5f5;
			padding: 36rpx 66rpx 29rpx 65rpx;
			display: flex;
			justify-content: space-between;

			.right {
				display: flex;
				color: #B1B1B1;
				font-size: 30rpx;
			}
		}

		.card {
			margin: 0 50rpx;
			box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.16);
			border-radius: 18rpx;
			background: #fff;
			margin-bottom: 10rpx;
			.card_body{
				padding:0 46rpx;
				.title {
					height: 84rpx;
					line-height: 84rpx;
					border-bottom: #EEEEEE 2rpx solid;
					color: #000000;
					font-size: 25rpx;
					font-weight: 400;
				}
				.card_view{
					padding:32rpx 0;
					display: flex;
					align-items: center;
					.card_item {
						width:25%;
						display: flex;
						align-items: center;
						flex-direction: column;
						.icon{
							width:56rpx;
							height: 56rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.right_size {
							margin-top: 15rpx;
							font-size: 20rpx;
							color: #141313;
						}
					}
				}
				.foot {
					padding:25rpx 0;
					border-bottom: #EEEEEE 2rpx solid;
					display: flex;
					justify-content: space-between;
					.text{
						flex:1;
					}
					.right {
						display: flex;
						color: #B1B1B1;
					}
					&:last-child{
						border-bottom: 0;
					}
				}
			}
		}

		.loginOut {
			margin: 60rpx 120rpx;
		}
		.place{
			/* #ifdef H5 */
			height:100rpx;
			/* #endif */
		}
	}
</style>
