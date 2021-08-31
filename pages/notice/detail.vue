<template>
	<view class="container">
		<view class="u-content">
			<u-parse :html="content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				content:""
			}
		},
		onLoad(){
			const value = uni.getStorageSync("notice");
			if(value){
				this.content = value;
			}
		},
		//监听返回
		onBackPress(e){
		  uni.navigateTo({
			  url:"/pages/notice/index"
		  });
		  uni.removeStorageSync("notice");
		  return true;
		}
	}
</script>
<style lang="scss">
	page{background: #ffffff;}
</style>
<style lang="scss" scoped>
	.u-content{
		padding:40rpx;
		font-size: 28rpx;
		line-height: 1.8;
		color:#000000;
		.title{
			font-size: 32rpx;
			margin-bottom:40rpx;
			text-align: center;
		}
	}
</style>
