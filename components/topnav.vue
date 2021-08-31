<template>
	<view class="tophead">
		<view class="nav" @click="eventClick">
			<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
		</view>
		<text class="title">{{title}}</text>
		<slot name="subtit"></slot>
	</view>
</template>

<script>
	export default{
		name:"topnav",
		data(){
			return {}
		},
		props: {
			title: {
				type: String,
				default: ""
			}
		},
		methods: {
			eventClick(){
				this.$emit('eventClick');
			}
		}
	}
</script>

<style lang="scss">
	.tophead{
		display: flex;
		align-items: center;
		background:#ffffff;
		padding:20rpx 40rpx;
		.nav{
			display: flex;
		}
		.title{
			margin-left:20rpx;
			font-size: 36rpx;
			color:#000000;
			flex:1;
		}
		.subtit{
			font-size:24rpx;
			color:#000000;
		}
	}
</style>
