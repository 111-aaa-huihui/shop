<template>
	<view class="body">
		<view class="head_title">签约</view>
		<view class="nav">
			<view class="nav_head">
				<text class="title">长期合作商福利</text>
				<text class="subtit">好礼享不停</text>
			</view>
			<view class="btn">
				<view class="button">
					<u-button type="primary" disabled shape="circle" class="btn_disabled" v-if="signshow">已申请商家长期合作</u-button>
					<u-button :custom-style="customStyle" :ripple="true" shape="circle" @click="applyshop" v-else>申请商家长期合作</u-button>
				</view>
			</view>
		</view>
		<view class="foot">
			<view class="title">
				<view class="size">授权项</view>
				<!-- <view class="btn" v-if="zfshow">
					<button class="btn_disabled" type="default" disabled="true">
						<u-icon size="40" name="/static/img/alipay.png" class="fullicon"></u-icon>
						<text>支付宝已授权</text>
					</button>
				</view>
				<view class="btn" v-else>
					<button type="default" class="diybutton" @click="accredit"></button>
				</view> -->
				<view class="btn" v-if="yjshow">
					<button class="btn_disabled" type="default" disabled="true">
						<u-icon size="42" name="/static/img/yajin.png" class="fullicon"></u-icon>
						<text>押金已交纳</text>
					</button>
				</view>
				<view class="btn" v-else>
					<button :ripple="true" class="diybuttonYellow" type="default" @click="pay">
						<image src="/static/img/111.png" mode="aspectFit" style="width: 42upx;height: 44upx;margin-right: 20upx;"></image>
						<text>商家交纳押金</text>
					</button>
				</view>
				<view class="logo"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customStyle: {
					backgroundColor: '#C73232',
					border: '#C73232',
					color: '#FFFFFF'
				},
				show:false, //是否商家签约
				signshow:false, //是否商家签约
				zfshow:false, //是否支付宝授权
				yjshow:false //是否押金交纳
			}
		},
		methods: {
			getInfo(){
				this.$api.http.getVipinfo().then((res)=>{
					if(res.code == 200){
						this.signshow = res.data.is_sign == 1?true:false;
						this.show = res.data.is_vip == 1?true:false;
						this.zfshow = res.data.is_ali == 1?true:false;
						this.yjshow = res.data.is_deposit == 1?true:false;
					}else if(res.code==402){
						uni.setStorage({key:"loginOriginUrl",data:"/pages/SignContract/SignContract"});
						uni.navigateTo({
							url:"/pages/login/login"
						})
					}
				})
			},
			applyshop(){
				uni.navigateTo({
					url:"/pages/SignContract/detail"
				})
			},
			//支付宝授权
			accredit(){
				this.$api.http.getUserAli().then((res)=>{
					if(res.code == 200){
						// window.location.href = res.data;
					}
				})
			},
			//押金交纳
			pay(){
				uni.navigateTo({
					url: '/pages/SignContract/pay'
				})
			}
		},
		onShow(){
			document.title = '批发商城';
			this.getInfo();
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/micromessenger/i) == 'micromessenger') {
				this.$wxin({
					title: "批发商城",
					desc: '一起分享吧...',
					link: window.location.origin+"/#/pages/index/index",
					imgUrl:window.location.origin+"/static/img/shareimg.jpg"
				});
			}
		}
	}
</script>

<style lang="scss">
	page{background:#FFFFFF;}
</style>

<style lang="scss" scoped>
	.body {
		padding:0 50rpx 50rpx;
		/* #ifdef H5 */
		padding-top:50rpx;
		/* #endif */
		width: 100%;
		height: 100%;
		.head_title {
			font-size: 48rpx;
			font-weight: 550;
			letter-spacing: 3rpx;
		}

		.nav {
			// background-color: red;
			height: 30%;
			display: flex;
			flex: 1;
			border-bottom: #EEEEEE 2rpx solid;
			flex-direction: column;

			.nav_head {
				margin-top: 6%;
				height: 174rpx;
				background: url(../../static/img/172.png) no-repeat;
				background-size: 100% 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.title{
					font-size:36rpx;
					color:#FFFFFF;
					text-align: right;
					padding-right: 50rpx;
				}
				.subtit{
					font-size:24rpx;
					color:#FFFFFF;
					text-align: right;
					padding-right: 50rpx;
				}
			}

			.btn {
				// flex: 0.2;
				// background: blue;
				// margin: 0 auto;
				text-align: center;
				padding: 0 50px;
				
				.button {
					margin-top: 10%;
					margin-bottom: 10%;
					.btn_disabled{
						font-size:24rpx;
						color: #707070!important;
						border-color:#eeeeee!important;
						background:#eeeeee!important;
					}
				}
			}
		}

		.foot {
			// background: red;
			margin: 50rpx 0;

			.title {
				font-size: 30rpx;
				font-weight: 550;

				.size {
					display: inline-block;
					width: 100rpx;
					// background: blue;
					border-bottom: #FFCE7F 5rpx solid;
				}

				.btn {
					// background: red;
					margin-top: 28rpx;
					padding: 0 15%;

					.diybutton {
						width: 450upx;
						height: 86upx;
						// background-color: red;
						border-radius: 50upx;
						background: url(../../static/img/4073.png) no-repeat no-repeat center;
						box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

						&:active {
							opacity: 0.8; //这里重要，就是通过这个透明度来设置
						}
					}

					.diybuttonYellow {
						margin-top: 10%;
						width: 450upx;
						height: 86upx;
						line-height: 86upx;
						border-radius: 50upx;
						background-color: #FF9D00;
						background-position: 40%;
						color: #FFFFFF;
						font-size: 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						&:active {
							margin-top: 10%;
							width: 100%;
							color: white;
							border-radius: 50upx;
							background: #d47f00;
							opacity: 0.9; //这里重要，就是通过这个透明度来设置
						}
					}
					.btn_disabled{
						display: flex;
						align-items: center;
						justify-content: center;
						height: 86rpx;
						background: #f6f6f6;
						border-radius: 44rpx;
						font-size: 24rpx;
						color:#707070;
						font-weight: normal;
						box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
						.fullicon{
							margin-right:20rpx;
						}
					}
				}
				.logo{
					margin: 25% auto 0;
					width: 300rpx;
					height: 150rpx;
					background: yellow;
					background: url(../../static/img/152.png) no-repeat no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
</style>
