const app = getApp();
const api = require('./util.js')

//会员登录
module.exports.mpLogin = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/mini-program-login', 'POST', params, app.globalData.loginHeaders)
}
//获取banner图
module.exports.getBanner = params => {

  return api.wxRequest(`${app.globalData.domain}/v1/common/banner`, 'POST', params, app.globalData.loginHeaders)
}
//获取搜索历史记录
module.exports.getSearchHistory = params => {
  app.md5(params)
  return api.wxRequest(`${app.globalData.domain}/v1/source/search-history`, 'POST', params, app.globalData.headers)
}

// 货源/求购列表 货源/求购搜索列表 货源/求购搜索推荐列表 接口
// 参数
// keyword    搜索关键字
// type       0货源 1求购 2推荐   不传type会返回货源和求购分开的两组数据
// page       页码
// page_size  每页条数
module.exports.getListSearch = params => {
  app.md5(params)
  return api.wxRequest(`${app.globalData.domain}/v1/source/search`, 'POST', params, app.globalData.loginHeaders)
}

// 我的收藏   POST

module.exports.getMyFavorite = params => {
  app.md5(params)
  return api.wxRequest(`${app.globalData.domain}/v1/member/my-favorite`, 'POST', params, app.globalData.headers)
}
//收藏/取消收藏 接口post
module.exports.changeFavorite = params => {
  app.md5(params)
  return api.wxRequest(`${app.globalData.domain}/v1/member/favorite`, 'POST', params, app.globalData.headers)
}

//  我的货源   POST
module.exports.getMySource = params => {
  app.md5(params)
  return api.wxRequest(`${app.globalData.domain}/v1/member/my-source`, 'POST', params, app.globalData.headers)
}

//货源详情接口
module.exports.sourceDetail = params => {
  app.md5(params)
  if (wx.getStorageSync("token")) {
    return api.wxRequest(app.globalData.domain + '/v1/source/detail', 'POST', params, app.globalData.headers)

  } else {
    return api.wxRequest(app.globalData.domain + '/v1/source/detail', 'POST', params, app.globalData.loginHeaders)
  }

}

//订单列表接口
module.exports.orderList = params => {
  app.md5(params)
  if (wx.getStorageSync("token")) {
    return api.wxRequest(app.globalData.domain + '/v1/member/order-list', 'POST', params, app.globalData.headers)
  } else {
    return api.wxRequest(app.globalData.domain + '/v1/member/order-list', 'POST', params, app.globalData.loginHeaders)
  }
}

//会员订单取消
module.exports.orderCancel = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/order-cancel', 'POST', params, app.globalData.headers)
}
//查看订单详情
module.exports.getOrderDetail = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/order-detail', 'POST', params, app.globalData.headers)

}
///v1/source/edit-status   更新货源/求购状态接口 
module.exports.editStatus = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/source/edit-status', 'POST', params, app.globalData.headers)
}

// /v1/member/order-edit   订单更新 
module.exports.updataOrder = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/order-edit', 'POST', params, app.globalData.headers)
}

// /v1/member/my-orders   我的订单列表 
module.exports.getMyOrderList = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/my-orders', 'POST', params, app.globalData.headers)

}
//图片上传
module.exports.uploadImage = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/source/upload-image', 'POST', params, app.globalData.headers)
}
//货源/求购 新增/修改 （修改需传source_id）
module.exports.operation = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/source/operation', 'POST', params, app.globalData.headers)
}
//商品信息字段map接口 
module.exports.productMap = params => {
  return api.wxRequest(app.globalData.domain + '/v1/common/product-map', 'POST', params, app.globalData.loginHeaders)
}
//手机号信息上传接口
module.exports.savePhoneNumber = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/save-phone-number', 'POST', params, app.globalData.headers)
}
//会员下单接口
module.exports.putOrder = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/member/order', 'POST', params, app.globalData.headers)
}
//检查库存
module.exports.checkStock = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/source/check-stock', 'POST', params, app.globalData.headers)
}

//生成货源二维码
module.exports.shareCodeImg = params => {
  app.md5(params)
  return api.wxRequest(app.globalData.domain + '/v1/source/share-code-image', 'POST', params, app.globalData.headers)
}

