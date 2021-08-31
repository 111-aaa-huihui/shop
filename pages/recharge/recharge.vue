<template>
	<view class="container">
		<topNav title="话费充值" @eventClick="goback" v-if="navshow"></topNav>
		<view class="btns">
			<button type="default" class="btn_primary">话费充值</button>
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
			goback() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btns{
		margin:120rpx 120rpx 0;
		.btn_primary{
			width:100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #ff9d00;
			border-radius: 40rpx;
			box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
			font-size: 28rpx;
			color:#ffffff;
		}
	}
</style>
