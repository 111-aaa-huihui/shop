<template>
	<view class="loadmore">
		<u-loadmore :status="status" :load-text="loadText" v-if="show" />
	</view>
</template>

<script>
	export default{
		data(){
			return {
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多数据'
				}
			}
		},
		props:{
			status:{
				type:String,
				default:"loading"
			},
			show:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loadmore{
		width: 100%;
		padding:20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
