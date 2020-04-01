var loadMoreView, page
//获取应用实例
const app = getApp()
const { orderList } = require("../../utils/api_request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNotification: false,
    selectWay: false,
    selectTime: false,
    chartWay: false,
    tihuoWay: '门店自提',
    tihuoTime: '随时取货',
    duanxinInfo: "随时取货",
    serchKeyWord: "",
    currentIndex: 0,
    parameter: {
      'navbar': '1',
      'search': '0',
      'title': '订单管理',
      'return': '1',
      'isFixed': true
    },
    sendList: [],
    myOrderTab: ['全部', '未发货', '已发货', '已取消订单'],
    select: {
      page_size: 4,
      source_id: ""


    },
    checkedService: true,
    checkedChart: false,
    total_cnt: "",//总订单数
    total_mon: "",//总金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source_id) {
      this.data.select.source_id = options.source_id
    }
    console.log(options)
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
    var params = Object.assign(_this.data.select, { page })
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
        sendList: sendList,
        total_cnt: res.data.data.total_cnt,
        total_mon:res.data.data.total
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
    if (this.data.currentIndex === e.currentTarget.dataset.idx) {
      return
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx,
      sendList: []
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
  },
  service() {
    if (this.data.checkedService) {
      return
    } else {
      this.setData({
        checkedService: true,
        checkedChart: false
      })
    }
  },
  chat() {
    if (this.data.checkedChart) {
      return
    } else {
      this.setData({
        checkedService: false,
        checkedChart: true
      })
    }
  },
  bindShowMsg() {
    this.setData({
      selectWay: !this.data.selectWay
    })
  },
  bindShowChart() {
    this.setData({
      chartWay: !this.data.chartWay
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      selectWay: false
    })
  },
  myChart(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      duanxinInfo: name,
      chartWay: false
    })
  },
  //提货时间下拉操作
  bindShowTime() {
    this.setData({
      selectTime: !this.data.selectTime
    })
  },
  mySelectTime(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoTime: name,
      selectTime: false
    })
  },
  sendNotification() {
    this.setData({
      showNotification: true
    })
  },
  hideDialog() {
    this.setData({
      showNotification: false
    })
  }
})