<template>
	<view class="alert-mask" :class="[show?'mask-show':'']">
	    <view class="con">
	        <view>
	            <image src="/static/img/point_bg.png" style="width: 100%;height:auto;" mode="widthFix" />
	        </view>
	        <view @click="close" style="text-align: center;">
	            <image src="/static/img/point_btn.png" style="width: 60%;height:auto;" mode="widthFix" />
	        </view>
	    </view>
	</view>
</template>

<script>
	export default{
		props: {
			show: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '100%'
			},
		},
		methods: {
			close() {
				this.$emit("close")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.alert-mask {
	    position: fixed;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    z-index: 1110;
	    opacity: 0;
	    outline: 0;
	    text-align: center;
	    -ms-transform: scale(1.185);
	    transform: scale(1.185);
	    backface-visibility: hidden;
	    perspective: 2000upx;
	    background: rgba(0, 0, 0, 0.6);
	    transition: all 0.3s ease-in-out 0s;
	    pointer-events: none;
		&.mask-show {
		    opacity: 1;
		    transition-duration: 0.3s;
		    -ms-transform: scale(1);
		    transform: scale(1);
		    overflow-x: hidden;
		    overflow-y: auto;
		    pointer-events: auto;
		}
		.con{
			position: absolute;
			top: 0;
			right: 0;
			width:100%;
		}
	}
</style>
