<template>
	<view class="container">
		<view class="fncon">
			<view class="content">
				<u-parse :html="info" :lazy-load="true"></u-parse>
			</view>
			<view class="btnbox">
				<button type="default" class="btn_primary" @click="apply">申请签约</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				info:""
			}
		},
		methods:{
			loadData(){
				this.$api.http.contractDetail().then((res)=>{
					if(res.code == 200){
						if(res.data){
							this.info = res.data;
						}
					}
				})
			},
			apply(){
				this.$api.http.applySign().then((res)=>{
					if(res.code == 200){
						uni.showToast({
							title:"签约成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
						},1000)
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			}
		},
		onLoad(){
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.fncon{
		padding: 40rpx;
		.btnbox{
			position: fixed;
			bottom:0;
			left:0;
			width: 100%;
			z-index: 50;
			.btn_primary{
				margin:40rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background-color: #FF9D00;
				color: #FFFFFF;
				font-size: 28rpx;
			}
		}
	}
</style>
