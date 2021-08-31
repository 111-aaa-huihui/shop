<template>
	<view class="listwrap">
		<view class="proitem" v-for="(item, index) in plist" :key="index" @click="eventClick(item.id)">
			<view class="image-wrapper" v-for="(items,indexs) in item.pic_arr" :key="items.pic_id" v-if="indexs==0">
				<u-image width="100%" height="100%" :src="items.domain+items.path.substr(1)" mode="aspectFill">
					<u-loading slot="loading"></u-loading>
				</u-image>
			</view>
			<view class="title">{{item.title}}</view>
			<view class="price" v-for="(items,indexss) in item.sku_arr" :key="items.sku_id" v-if="indexss==0">￥{{items.price}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			plist: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		methods: {
			eventClick(id){
				this.$emit('eventClick',id);
			}
		}
	}
</script>

<style lang="scss">
	.listwrap {
		display: flex;
		flex-wrap: wrap;
		.proitem {
			display: flex;
			flex-shrink: 0;
			flex-direction: column;
			margin-bottom: 27rpx;
			width: 50%;
			.image-wrapper {
				width: 100%;
				height: 237rpx;
				overflow: hidden;
				margin-bottom: 22rpx;
				border-radius: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.title {
				font-size: 24rpx;
				color: #141313;
				margin-bottom: 5rpx;
				height: 58rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.price {
				font-size: 24rpx;
				color: #FF9D00;
			}
			&:nth-child(odd) {
				width: 46%;
				margin-right: 4%;
			}
		}
	}
</style>
