import httpRequest from '../utils/http'

module.exports = {
	//用户手机号注册
	register: function(params) {
		return httpRequest.post('/auth/register', params, false)
	},
	//手机号码登陆
	htmlLogin: function(params) {
		return httpRequest.post('/auth/login', params, false)
	},
	//发送验证码
	smsSend: function(mobile, event) {
		return httpRequest.get('/auth/sms_send', {mobile: mobile,event: event}, false)
	},
	//忘记密码
	forgetPwd: function(params) {
		return httpRequest.post('/auth/forget_password', params, false)
	},
	//用户信息
	getUserInfo: function() {
		return httpRequest.get('/user/info')
	},
	//邀请列表
	getinvitelog: function(page,limit) {
		return httpRequest.get('/balance/invite_log',{page:page,limit:limit})
	},
	//首页轮播图
	banner: function() {
		return httpRequest.get('/index/banner', {}, false)
	},
	//收货地址列表
	addresslist: function() {
		return httpRequest.get('/address/index')
	},
	//添加收货地址
	addressAdd: function(params) {
		return httpRequest.post('/address/add', params)
	},
	//修改收货地址
	addressEdit: function(params) {
		return httpRequest.post('/address/edit', params)
	},
	//意见反馈
	suggestion: function(params) {
		return httpRequest.post('/user/add_suggestion', params)
	},
	//意见反馈列表
	suggestlist: function(page,limit,way) {
		return httpRequest.get('/user/suggestion_list', {page: page,limit: limit,way:way})
	},
	//分类
	getCategory: function() {
		return httpRequest.get('/index/category')
	},
	getTopcategory: function() {
		return httpRequest.get('/index/top_category')
	},
	//商品列表
	getProductlist: function(protype, page, limit, keyword, pid) {
		let params = {
			product_type: protype,
			page: page,
			limit: limit
		};
		if (pid) {
			params.pid = pid
		}
		if (keyword) {
			params.keyword = keyword
		}
		return httpRequest.get('/index/product_list', params)
	},
	//商品详情页
	getProDetail: function(product_id) {
		return httpRequest.get('/index/product_detail', {product_id: product_id})
	},
	//购物车列表
	cartList: function() {
		return httpRequest.get('/cart/index')
	},
	//添加到购物车
	addCart: function(proid, skuid, stock) {
		return httpRequest.post('/cart/add2cart', {product_id: proid,sku_id: skuid,stock: stock})
	},
	//修改购物车数量
	changeCartnum: function(cart_id, number, symbol) {
		return httpRequest.post('/cart/change_cart_num', {cart_id: cart_id,number: number,symbol: symbol})
	},
	//删除购物车商品
	delCart: function(cart_id) {
		return httpRequest.post('/cart/del_cart_product', {cart_id: cart_id})
	},
	//订单确认页面
	orderDetail: function(order_id) {
		return httpRequest.get('/order/order_detail', {order_id: order_id})
	},
	//提交订单
	postOrder: function(pay_cart_arr, address_id, user_note) {
		return httpRequest.post('/order/post_order', {pay_cart_arr: pay_cart_arr,address_id: address_id,user_note: user_note})
	},
	//再买一单
	buyagain: function(order_id) {
		return httpRequest.post('/order/buy_again', {order_id: order_id})
	},
	//网站配置信息
	webconfig: function() {
		return httpRequest.get('/index/web_config')
	},
	//付款
	payOrder: function(order_id, pay_way) {
		return httpRequest.post('/order/pay2order', {order_id: order_id,pay_way: pay_way,platform: "h5"})
	},
	//订单列表
	orderList: function(order_status, page, limit) {
		return httpRequest.get('/order/index', {order_status: order_status,page: page,limit: limit})
	},
	//取消订单
	cancelOrder: function(order_id) {
		return httpRequest.post('/order/cancel_order', {order_id: order_id})
	},
	//确认收货
	deliver: function(order_id) {
		return httpRequest.post('/order/confirm_deliver', {order_id: order_id})
	},
	//添加订单商品评论
	addCommit: function(order_id,product_id, content, attachment,anonymous) {
		return httpRequest.post('/user/add_commit', {order_id: order_id,product_id:product_id,content: content,attachment: attachment,comments_is_anonymous:anonymous})
	},
	//上传评论图片
	uploadCommit: function(params) {
		return httpRequest.post('/user/upload_commit_attach', params)
	},
	//申请合同签约
	applySign: function() {
		return httpRequest.post('/vip/apply_sign')
	},
	//申请押金签约
	applyMoney: function() {
		return httpRequest.post('/vip/apply_money')
	},
	//押金付款
	vipPay: function(vip_apply_id,pay_way) {
		return httpRequest.post('/vip/vip_pay', {vip_apply_id: vip_apply_id,pay_way:pay_way})
	},
	//调整额度
	changeBalance: function(balance) {
		return httpRequest.post('/vip/change_able_balance', {balance: balance})
	},
	contractDetail: function() {
		return httpRequest.get('/vip/contract_detail')
	},
	//提前还款
	payearly: function(pay_way,pay_back_money,way) {
		return httpRequest.post('/vip/pay_early',{pay_way:pay_way,pay_back_money:pay_back_money,way:way,platform:"h5"})
	},
	wxsign: function() {
		return httpRequest.get('/index/t')
	},
	getUserAli: function() {
		return httpRequest.get('/user/get_user_ali')
	},
	//用户签约信息
	getVipinfo: function() {
		return httpRequest.get('/user/get_vip_info')
	},
	//商家应还待还列表
	vipMoneylog: function(type, page, limit) {
		return httpRequest.get('/user/vip_money_log', {type: type,page: page,limit: limit})
	},
	getWxCode: function() {
		return httpRequest.get('/index/get_wx_code')
	},
	getWxToken: function(code) {
		return httpRequest.post('/index/get_wx_token', {code: code}, false)
	},
	//银行卡列表
	banklist: function() {
		return httpRequest.get('/user/bank_card_list')
	},
	//添加银行卡
	addbank: function(params) {
		return httpRequest.post('/user/add_bank_card', params)
	},
	//充值
	recharge: function(pay_way,money) {
		return httpRequest.post('/balance/recharge', {pay_way:pay_way,money:money})
	},
	//提现
	withdraw: function(money,bank_id) {
		return httpRequest.post('/balance/withdraw', {money:money,bank_id:bank_id})
	},
	//生成用户二维码
	userQrcode: function() {
		return httpRequest.get('/user/user_qrcode')
	},
	userenQrcode: function() {
		return httpRequest.get('/user/get_user_encode')
	},
	jiesuan: function() {
		return httpRequest.post('/index/a')
	},
	//商品评价列表
	commitlist: function(page, limit) {
		return httpRequest.get('/index/commit_list', {page: page,limit: limit})
	},
	//待评价
	waitcommit: function(page, limit) {
		return httpRequest.get('/order/wait_commit', {page: page,limit: limit})
	},
	//消息通知
	getNotice: function(page, limit) {
		return httpRequest.get('/user/notice_article', {page: page,limit: limit})
	},
	getHotSearch: function() {
		return httpRequest.get('/mi/get_hot_search', {})
	},
	search: function(keyword, page, sort) {
		return httpRequest.get('/mi/search', {
			keyword: keyword,
			page: page,
			sort: sort
		})
	},
	search2: function(keyword, page, sort, hasCoupon) {
		return httpRequest.get('/mi/search2', {
			keyword: keyword,
			page: page,
			sort: sort,
			hasCoupon: hasCoupon
		})
	}
}
