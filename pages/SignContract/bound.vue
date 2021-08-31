<template>
	<view class="container">
		<topNav title="授权绑定" @eventClick="gobacks" v-if="navshow"></topNav>
		<view class="info">
			<icon size="72" class="icon_suc" type="success" color="#ff9d00"></icon>
			<text class="title">用户绑定</text>
			<text class="subtit">你当前绑定的用户为：15055635251</text>
		</view>
		<view class="btn_actions">
			<button type="default" class="btn_primary btns">解除绑定</button>
			<button type="default" class="btn_back btns" @click="gobacks()">返回</button>
			<view class="hr"></view>
		</view>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	export default{
		components: {
			topNav
		},
		data(){
			return {
				navshow:false
			}
		},
		methods: {
			gobacks() {
				uni.switchTab({
					url: '/pages/SignContract/SignContract'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background:#FFFFFF;}
</style>
<style lang="scss" scoped>
	.info{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.icon_suc{
			margin-top:120rpx;
		}
		.title{
			font-size: 36rpx;
			color:#141313;
			margin-top:56rpx;
			margin-bottom:16rpx;
			font-weight: bold;
		}
		.subtit{
			font-size: 24rpx;
			color:#141313;
		}
	}
	.btn_actions{
		position: fixed;
		bottom:0;
		left:0;
		z-index: 50;
		width:100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		.btns{
			border:0;
			width: 480rpx;
			height: 80rpx;
			border-radius: 40rpx;
			box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
			font-size:28rpx;
		}
		.btn_primary{
			background: #ff9d00;
			color:#FFFFFF;
		}
		.btn_back{
			background: #f6f6f6;
			color:#707070;
			margin-top:24rpx;
		}
		.hr{
			height:140rpx;
		}
	}
</style>
