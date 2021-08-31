<template>
	<view class="container">
		<view class="topbox"></view>
		<u-gap height="100"></u-gap>
		<view class="qrcodebx">
			<image :src="url" mode="aspectFit"></image>
			<text></text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				url:""
			}
		},
		methods:{
			qrcode(){
				this.$api.http.userQrcode().then((res)=>{
					if(res.code == 200){
						this.url = res.data;
						uni.setStorage({key: 'qrcode',data: res.data});
					}
				})
			},
			saveImg() {
				let that = this;
				uni.saveImageToPhotosAlbum({
					filePath: that.url,
					success: function (res) {
						uni.showToast({
							title:"保存成功",
							icon:"none"
						})
					}
				});
			}
		},
		onShow(){
			let that = this;
			uni.getStorage({
			    key: 'qrcode',
			    success: function (res) {
			        that.url = res.data;
			    },
				fail: function (error) {
			        that.qrcode();
			    }
			});
		}
	}
</script>

<style lang="scss" scoped>
	.topbox{
		background: #ff9d00;
		width: 100%;
		height: 300rpx;
	}
	.qrcodebx{
		margin:0 80rpx;
		height: 600rpx;
		background: #ffffff;
		border-radius: 40rpx;
		margin-top:-300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 28rpx;
		color:#000000;
		image{
			width: 320rpx;
			height: 320rpx;
			margin-bottom: 40rpx;
		}
	}
	.btnbox{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		.btn_primary{
			margin:40rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			color: #ffffff;
			background: #FF9D00;
		}
	}
</style>
