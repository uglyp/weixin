var loadMoreView, page
//获取应用实例
const app = getApp()
const { orderList } = require("../../utils/api_request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serchKeyWord: "",
    currentIndex: 0,
    parameter: {
      'navbar': '1',
      'search': '0',
      'title': '订单状态',
      'return': '1',
      'isFixed': true
    },
    sendList: [],
    myOrderTab: [{ name: '全部', status: '' }, { name: '预购中', status: 0 }, { name: '预购成功', status: 1 }, { name: '取消', status: 2 }, { name: "已发货", status: 3 }],
    select: {
      page_size: 4,
      status: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source_id) {
      this.data.select.source_id = options.source_id
    }
    if (app.requestName) {
      this.setData({
        serchKeyWord: app.requestName
      })
    }
    page = 1
    var that = this
    loadMoreView = that.selectComponent("#loadMoreView")
    this.getListData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMoreView.loadMore()
  },

  getListData() {
    var _this = this;
    var params = Object.assign(this.data.select, { page })
    console.log(params)
    orderList(params).then(res => {
      var sendList = _this.data.sendList
      if (page == 1) {
        sendList = res.data.data.data
        wx.stopPullDownRefresh()
      } else {
        sendList = sendList.concat(res.data.data.data)
      }
      _this.setData({
        sendList: sendList
      })
      loadMoreView.loadMoreComplete(res.data.data)
    })

  },
  loadMoreListener: function (e) {
    page += 1
    this.getListData()
  },
  clickLoadMore: function (e) {
    this.getListData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  titleClick: function (e) {
    page = 1
    if (this.data.currentIndex === e.currentTarget.dataset.index) {
      return
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.index,
      sendList: [],
      "select.status": e.currentTarget.dataset.idx
    })
    console.log(this.data.currentIndex)

    this.getListData()
  },
  goDetails(e) {
    console.log(e.currentTarget.dataset)
    let source_id = e.currentTarget.dataset.sourceid
    let order_id = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `/pages/orderDetails/orderDetails?source_id=${source_id}&order_id=${order_id}`
    });
  }
})