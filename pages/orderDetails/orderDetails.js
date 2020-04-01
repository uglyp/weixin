// pages/orderdetails/orderdetails.js
var app = getApp();

const { getOrderDetail, updataOrder } = require("../../utils/api_request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //头部配置信息
    parameter: {
      'navbar': '1',
      'title': '订单详情',
      'return': '1',
      'isFixed': true
    },
    orderStatus: "",
    payStatus: "",
    selectWay: false,
    selectTime: false,
    order_id: '',
    source_id: "",
    orderInfo: null,
    memberInfo: null,
    status: '',//订单状态
    inputValue: '',//备注输入值
    order_ids: "",//要更新的订单id
    reminder: '',//温馨提示
    source_id: '',
    imgHeader: app.globalData.updatePath


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.order_id = options.order_id
    this.data.source_id = options.source_id
    this.getDetails()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindShowMsg() {
    this.setData({
      selectWay: !this.data.selectWay
    })
  },

  mySelect(e) {
    var name = e.currentTarget.dataset.name
    var status = e.currentTarget.dataset.status
    this.setData({
      orderStatus: name,
      selectWay: false,
      status: status
    })
  },
  //获取备注内容
  getInputValue(e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  sendRemarks() {
    var remarks = this.data.inputValue
    if (!this.data.inputValue) {
      remarks = this.data.orderInfo.remarks
    }
    var params = {
      order_ids: this.data.order_ids,
      remarks: remarks,
      reminder: this.data.reminder,
      status: Number(this.data.status),
      source_id: this.data.source_id
    }
    console.log(params)
    updataOrder(params).then(res => {
      console.log(res.data)
      res.data.code === 0 && wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000,
        success: (result) => {
          wx.navigateBack({
            delta: 1
          });
        },
      })
      this.getDetails()

    })
  },
  getDetails() {
    getOrderDetail({
      order_id: this.data.order_id,
      source_id: this.data.source_id
    }).then(res => {
      console.log(res.data.data)
      // this.data.orderInfo = res.data.data.order
      // this.data.memberInfo = res.data.data.member
      this.setData({
        orderInfo: res.data.data.order,
        memberInfo: res.data.data.member,
        orderStatus: res.data.data.order.status_label,
        payStatus: res.data.data.order.need_pay_label,
        order_ids: res.data.data.order.id,
        status: res.data.data.order.status,
        reminder: res.data.data.order.reminder,
        source_id: res.data.data.order.source_id

      })
    })
  }


  //支付状态的选择
  // bindShowTime() {
  //   this.setData({
  //     selectTime: !this.data.selectTime
  //   })
  // },
  // mySelectTime(e) {
  //   var name = e.currentTarget.dataset.name
  //   this.setData({
  //     payStatus: name,
  //     selectTime: false
  //   })
  // },
})