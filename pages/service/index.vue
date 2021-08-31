<template>
	<view class="container">
		<view class="serlist">
			<view class="item">
				<view class="left">
					<u-icon name="/static/img/19.png" size="22" class="licon"></u-icon>
					<text class="bold">手机号</text>
				</view>
				<text class="desc">{{phone}}</text>
				<view class="vtel" @click="goCall">
					<u-icon name="phone-fill" size="22" color="#ffffff" class="icon"></u-icon>
					<text>拨号</text>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<u-icon name="/static/img/238.png" size="32" class="licon"></u-icon>
					<text class="bold">微信号</text>
				</view>
				<text class="desc">{{wxinNum}}</text>
				<view class="vcopy" @click="onCopy">
					<u-icon name="/static/img/icon_copy.png" size="26" class="icon"></u-icon>
					<text>复制</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				phone:"",
				wxinNum:""
			}
		},
		methods:{
			async loadData(){
				await this.$api.http.webconfig().then((res)=>{
					if(res.code==200){
						this.phone = res.data.web_mobile;
						this.wxinNum = res.data.wechat_account;
					}
				})
			},
			//复制
			onCopy(){
				uni.setClipboardData({
				    data: this.wxinNum,
				    success: function () {
				        console.log('success');
						uni.showModal({
						    title: '复制成功',
						    content: '内容已复制到粘贴板',
						    showCancel: false
						});
				    }
				});
			},
			//拨号
			goCall(){
				uni.makePhoneCall({
				    phoneNumber: this.phone
				});
			}
		},
		onLoad(){
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.serlist{
		margin:40rpx 28rpx;
		.item{
			display: flex;
			align-items: center;
			padding:0 54rpx 0 80rpx;
			height: 120rpx;
			margin-bottom:36rpx;
			font-size: 24rpx;
			color:#000000;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			.left{
				width: 200rpx;
				display: flex;
				align-items: center;
			}
			.licon{
				display: flex;
				margin-right: 40rpx;
			}
			.bold{
				font-weight: bold;
			}
			.vtel{
				width: 100rpx;
				height: 40rpx;
				background:#ff9d00;
				font-size: 20rpx;
				color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 40rpx;
			}
			.desc{
				flex:1;
				color:#b5b5b5;
			}
			.vcopy{
				display: flex;
				align-items: center;
				font-size: 18rpx;
				color:#c3c3c3;
				.icon{
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
