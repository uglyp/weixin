var app = getApp();
const { putOrder } = require("../../utils/api_request.js");
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prevPages: null, //上一页信息,
    //头部配置信息
    parameter: {
      'navbar': '1',
      'title':'预购详情',
      'return': '1',
      'isFixed': true
    },
    need_mail:1,//1邮寄0不邮寄
    productList:[],
    totalPrice:0,//订单总价
    btnH: 130,
    navH: app.globalData.navHeight,
    mobile:null,//电话
    name:'',//收件人
    address:'',//地址
    post_code:null,//邮编
    is_show_adrr:false,
    products:{},
    source_id:null,
    sellerPhone:null,//卖家电话

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var pages = getCurrentPages();
    that.setData({ prevPages: pages[pages.length - 2] });
    if (wx.getStorageSync("token") == "") {
      wx.showModal({
        showCancel: false,
        content: '请登录后再操作',
        success: function () {
          wx.switchTab({
            url: "../../pages/user/user"
          })
        }
      })
    } else {
      that.data.source_id = options.source_id
      var thisProductList = wx.getStorageSync('productList')
      console.log(thisProductList);
      if (thisProductList && thisProductList.length>0){
        var total_price = 0
        var thisProduct = {}
        var thisList = []
        for (var index in thisProductList){
          if (thisProductList[index].cart_num>0){
            let thisPrice = util.$h.Mul(thisProductList[index].price, thisProductList[index].cart_num);
            total_price = total_price + thisPrice
            thisProduct[thisProductList[index].id] = thisProductList[index].cart_num
            thisList.push(thisProductList[index])
          }
        }
        that.setData({ 
          productList: thisList, 
          totalPrice: total_price,
          products: JSON.stringify(thisProduct),
          sellerPhone: options.phone })
      }
     

    }

  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //是否邮寄
  switchChange:function(e){
    this.setData({
      need_mail: e.detail.value ? 1 : 0
    })
    
  },
  getAddr() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              that.setData({
                name: res.userName,
                mobile: res.telNumber,
                address: res.detailInfo,
                post_code: res.postalCode,
                is_show_adrr: true
              })
              
            }
          })
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                that.setData({
                  name: res.userName,
                  mobile: res.telNumber,
                  address: res.detailInfo,
                  post_code: res.postalCode,
                  is_show_adrr: true
                })
                
              }
            })
          }
        }
      }
    })
  },
  //联系买家
  getPhone: function () {
    if (wx.getStorageSync("token") == "") {
      wx.showModal({
        showCancel: false,
        content: '请登录后再操作',
        success: function () {
          wx.switchTab({
            url: "../../pages/user/user"
          })
        }
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '联系方式',
        content: '+' + this.data.sellerPhone,
        success(res) { }
      })
    }
  },
  
 //提交
  orderOnLine:function(){
    let that = this
    if (that.data.need_mail){
      if (that.data.address == '') {
        wx.showToast({
          title: '请填写地址',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        return
      }

    }
    if (that.data.mobile == '') {
      wx.showToast({
        title: '请填写电话',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return
    } 
    if (that.data.name == '') {
      wx.showToast({
        title: '请填写收件人姓名',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return
    }
    var data={
      source_id: that.data.source_id,
      products: that.data.products,
      need_mail: that.data.need_mail,
      name: that.data.name,
      mobile: that.data.mobile,
      address: that.data.address,
      post_code: that.data.post_code,
      spread_uid: app.globalData.member_id ? app.globalData.member_id : ''
     }
    putOrder(data).then(res=>{
      if(res.data.code == 0){
        console.log('成功')
        wx.showToast({
          title: '订购成功',
          icon: 'success',
          duration: 3000,
        })
        setTimeout(function () {
          that.data.prevPages.setPagesData(that.data.source_id);//传回上一页
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
        
      } else if (res.data.code == 30012){
        wx.showToast({
          title: '库存不足，请重新下单',
          icon:'none',
          duration: 3000,
        })
        setTimeout(function () {
          that.data.prevPages.setPagesData(that.data.source_id);//传回上一页
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})