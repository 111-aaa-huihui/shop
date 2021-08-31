<template>
	<view class="emptybox" :style="{height:height+'rpx'}">
		<u-empty mode="data"></u-empty>
	</view>
</template>

<script>
	export default{
		data(){
			return {}
		},
		props:{
			height:{
				type:String,
				default:"200"
			}
		}
	}
</script>

<style lang="scss">
	.emptybox{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
</style>
