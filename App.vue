<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onLoad: function() {
			console.log('App Load');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	page{
		background: #F8F8F8;
		font-family: PingFang SC, PingFang SC-Regular;
	}
	uni-swiper{
		height: 100%;
	}
	uni-button,button {
		font-weight: normal;
		&.no-border::before,
		&::after,&.no-border::after {
			border: 0;
		}
	}
</style>
