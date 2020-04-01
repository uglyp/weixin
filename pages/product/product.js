const app = getApp()
const { sourceDetail, orderList, changeFavorite, orderCancel, editStatus, checkStock, shareCodeImg} = require("../../utils/api_request.js");
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updatePath: app.globalData.updatePath,
    //头部配置信息
    parameter: {
      'navbar': '2',
      'return': '1',
      'isFixed': false
    },
    imgUrls:[],
    bgImg: app.globalData.updatePath+'icons01.png',
    source:null,
    productList: [],
    myself:0,//0非自己发布，1自己发布
    myOrderList:[],//自己预定此产品订单
    isMyOrderShow:true,//自己预定此产品订单是否显示
    countDownHour: "00",
    countDownMinute: "00",
    countDownSecond: "00",
    countDownDay:'',// 天
    status: null,//值为0显示，1时活动已结束，2的时候活动删除
    allCartNum:0,//购物车总数量
    btnH: null,
    defaultH:130,
    orderList:[],//此产品全部订单
    total_cnt:0,//总订单数
    page:1,//页数
    ismore:true,//是否有更多订单
    source_id:0,
    is_favorite:0,//0未收藏 1已收藏
    showModalStatus:false,//底部弹出框
    type:0,//0货源，1求购

    
    posterImageStatus: false,
    storeImage: '',//海报产品图
    PromotionCode: '',//二维码图片
    canvasStatus: false,//海报绘图标签
    posterImage: 'http://sandbox.imgmall.gulltour.com/images/source/20200325/1585128006476686.jpeg',//海报路径
    posterbackgd: app.globalData.updatePath+'posterbackgd.png',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //扫码携带参数处理
    if(options.scene){
      var value = util.getUrlParams(decodeURIComponent(options.scene)); 
      if (value.s) options.id = value.s;
      //记录推广人uid
      if (value.u) app.globalData.member_id = value.u;
      console.log(value.s + '/' + value.u)
    }
    that.setData({ source_id: options.id });
    that.getSource(options.id);
    that.getOrder(options.id,that.data.page)
    if (wx.getStorageSync("token") != "") {
      that.downloadFilePromotionCode();
    } 
  },
  //获取source
  getSource:function(id){
    let that = this;
    sourceDetail({ source_id: id }).then(res => {
      if (res.data.code == 0) {
        wx.hideLoading();
        var thisSource = res.data.data.source;
        var thisMyOrderList = res.data.data.my_order_list.data;
        var thisProductList = res.data.data.product_info;
        var numSub = [{ numSub: true }, { numSub: false }];
        var numAdd = [{ numAdd: true }, { numAdd: false }];
        var thisBtnH = thisSource.myself == 0 ? that.data.defaultH : that.data.defaultH + 100;
        if (thisProductList&&thisProductList.length > 0) {
          for (var index in thisProductList) {
            thisProductList[index].numSub = true;
            thisProductList[index].cart_num = 0
          }
        }
        if (thisMyOrderList&&thisMyOrderList.length>0){
          for (var i = thisMyOrderList.length;i>0;i--){
            thisMyOrderList[thisMyOrderList.length-i]['showid']=i
          }
        }
         
        //倒计时
        util.time2(thisSource.diff_time, that);
        that.setData({
          source: thisSource,
          productList: thisProductList,
          imgUrls: thisSource.images.length > 0 ? thisSource.images:['../../images/moren.jpg'],
          myself: thisSource.myself,
          myOrderList: thisMyOrderList,
          status: thisSource.status,
          btnH: thisBtnH,
          is_favorite: thisSource.is_favorite,
          type: thisSource.type,
          allCartNum:0

        })
      }
    })

  },
  //获取order
  getOrder(id,p){
    let that = this
    orderList({ source_id: id, page: p, page_size: 5 }).then(res => {
      if (res.data.code == 0) {
        var thisOrderList = res.data.data.data
        if (thisOrderList.length > 0) {
         
          if (thisOrderList.length < 5 && that.data.ismore) {
            that.data.ismore = !that.data.ismore
          }
        }
        that.setData({
          orderList: thisOrderList,
          ismore: that.data.ismore,
          total_cnt:res.data.data.total_cnt
        })

      }
    })

  },
  /**
   * 获取产品分销二维码
   * @param function successFn 下载完成回调
   * 
  */
  downloadFilePromotionCode: function (successFn) {
    var that = this;
    shareCodeImg({ source_id: that.data.source_id}).then(res=>{
      wx.downloadFile({
        url: res.data.data,
        success: function (res) {
          if (typeof successFn == 'function')
            successFn && successFn(res.tempFilePath);
          else
            that.setData({ PromotionCode: res.tempFilePath });
        },
        fail: function () {
          that.setData({ PromotionCode: '' });
        },
      });

    })
   
  },
  /**
     * 生成海报
    */
  goPoster: function () {
    var that = this;
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
      return
    }
    that.setData({ canvasStatus: true });
    var arr2 = [that.data.posterbackgd, that.data.storeImage, that.data.PromotionCode];
    wx.getImageInfo({
      src: that.data.PromotionCode,
      fail: function (res) {
        wx.showToast({
          title: '小程序二维码需要发布正式版后才能获取到',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        return ;
      },
    });
    if (arr2[2] == '') {
      //海报二维码不存在则从新下载
      that.downloadFilePromotionCode(function (msgPromotionCode) {
        arr2[2] = msgPromotionCode;
          if (arr2[2] == '') {
            wx.showToast({
            title: '海报二维码生成失败！',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
        return ;
        util.PosterCanvas(arr2, that.data.source.subject, '0.00', function (tempFilePath) {
          that.setData({
            posterImage: tempFilePath,
            posterImageStatus: true,
            canvasStatus: false,
            
          })
        });
      });
    } else {
      //生成推广海报
      util.PosterCanvas(arr2, that.data.source.subject, '0.00', function (tempFilePath) {
        that.setData({
          posterImage: tempFilePath,
          posterImageStatus: true,
          canvasStatus: false,
          
        })
      });
    }
  },
  //隐藏海报
  posterImageClose: function () {
    this.setData({ posterImageStatus: false, })
  },
  /*
  * 保存到手机相册
  */
  savePosterPath: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.posterImage,
                success: function (res) {
                  that.posterImageClose();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1000,
                    mask: true,
                  })
                },
                fail: function (res) {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true,
                  })
                }
              })
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.posterImage,
            success: function (res) {
              that.posterImageClose();
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000,
                mask: true,
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 1000,
                mask: true,
              })
             
            },
          })
        }
      }
    })
  },
  
  //收藏、取消收藏
  changeFavorite:function(){
    let that = this;
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
      var thisType = that.data.is_favorite == 0 ? '1' : '0'
      changeFavorite({ source_id: that.data.source_id, type: thisType }).then(res => {
        if (res.data.code == 0) {
          that.setData({
            is_favorite: thisType
          })
          wx.showToast({
            title: thisType == 1 ? '已收藏' : '取消收藏',
            icon: 'none',
            duration: 1000,
            mask: true,
          })

        }

      })

    }
    
  },
  //加
  addCart: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var item = that.data.productList[index];
    item.cart_num = item.cart_num + 1;
    var productInfo = item.productInfo;
    if (item.purchase_limit_amount==0){
      if (item.cart_num >= item.stock) {
        //item.purchase_limit_amount为每人最大订购量
        item.cart_num = item.stock;
        item.numAdd = true;
        item.numSub = false;
      } else { item.numAdd = false; item.numSub = false; }
    }else{
      if (item.cart_num >= (item.purchase_limit_amount >= item.stock ? item.stock : item.purchase_limit_amount)) {
        item.cart_num = (item.purchase_limit_amount >= item.stock ? item.stock : item.purchase_limit_amount);
        item.numAdd = true;
        item.numSub = false;
      } else { item.numAdd = false; item.numSub = false; }

    }
    
    
    var itemData = "productList[" + index + "]";
    that.setData({ [itemData]: item, allCartNum: item.cart_num});
  },
  //减
  subCart: function (event) {
    var that = this;
    var status = false;
    var index = event.currentTarget.dataset.index;
    var item = that.data.productList[index];
    item.cart_num = item.cart_num - 1;
    if (item.cart_num < 0) status = true;
    if (item.cart_num < 1) {
      item.numSub = true; item.numAdd = false;
    } else { item.numSub = false; item.numAdd = false; }
    if (false == status) {
      var itemData = "productList[" + index + "]";
      that.setData({ [itemData]: item, allCartNum: item.cart_num });
    }
  },
  //返回首页
  togoindex:function(){
    wx.switchTab({
      url: "../../pages/index/index"
    })
  },
  //是否显示 我的订单
  isshow:function(){
    let that = this;
    that.setData({
      isMyOrderShow :!that.data.isMyOrderShow
    })

  },
  //获取更多
  getMore:function(){
    let that = this;
    var ismore = that.data.ismore;
    var page = that.data.page;
    if (ismore){
      page= page+1
      
      orderList({ source_id: that.data.source_id, page: page ,page_size:5}).then(res => {
        if (res.data.code == 0) {
          var thisOrderList = res.data.data.data
          if (thisOrderList.length > 0) {
            for (var index in thisOrderList) {
              that.data.orderList.push(thisOrderList[index])
            }
            if (thisOrderList.length < 10 && that.data.ismore) {
              that.data.ismore = !that.data.ismore
            }
          }
          that.setData({
            orderList: that.data.orderList,
            ismore: that.data.ismore,
            total_cnt: res.data.data.total_cnt
          })

        }
      })
    }

  },
  noneOfCartNum:function(){
    let that = this
    if (that.data.allCartNum<=0){
      wx.showToast({
        title: '请选择预定商品',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
  },
  //联系买家
  getPhone:function(){
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
        content: '+'+this.data.source.phoneNumber,
        success(res) { }
      }) 
    }
  },
  //预订
  orderOnLine:function(){
    let that = this
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
      if (that.data.allCartNum <= 0) {
        wx.showToast({
          title: '请选择预定商品',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      } else {
        var thisProductList = that.data.productList
        var thisProduct = {}
        for (var index in thisProductList) {
          if (thisProductList[index].cart_num > 0) {
            thisProduct[thisProductList[index].id] = thisProductList[index].cart_num
          }
        }
        thisProduct = JSON.stringify(thisProduct)
        checkStock({ products: thisProduct}).then(res=>{
          if(res.data.code==0){
            wx.setStorageSync('productList', thisProductList)
            wx.navigateTo({
              url: '../../pages/order/order?source_id=' + that.data.source_id + '&phone=' + that.data.source.phoneNumber,
            })
          }else if(res.data.code==30012){
            wx.showToast({
              title: '库存不足，请重新选择',
              icon: 'none',
              duration: 3000,
            })
            that.getSource(that.data.source_id);

          }
        })
       
      }

    }
   

  },
  //取消预订
  orderCancel:function(e){
    let that = this;
    var order_id = e.currentTarget.dataset.orderid
    var index = e.currentTarget.dataset.index
    var status = e.currentTarget.dataset.status
    var item = that.data.myOrderList[index];
    if (status != 2 && status != 3){
      wx.showModal({
        title: '',
        content: '您确定取消该订单吗',
        success(res) {
          if (res.confirm) {
            orderCancel({ order_id: order_id }).then(res => {
              if (res.data.code == 0) {
                item.status_label = res.data.data.status_label
                item.status = res.data.data.status
                var itemData = "myOrderList[" + index + "]";
                that.setData({ [itemData]: item });
              }

            })
          }
        }
      })

    }

  },
  //点击我显示底部弹出框
  clickme: function () {
    this.showModal();
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //结束/删除、隐藏活动
  editStatus:function(e){
    let that = this;
    var thisStatus = e.currentTarget.dataset.status
    var thisContent = ((thisStatus == 1) ? '您确定要结束此活动？' :'您确定要删除、隐藏此活动？')
    if (thisStatus){
      wx.showModal({
        title: '',
        content: thisContent,
        success(res) {
          if (res.confirm){
            editStatus({ source_id: that.data.source_id, status: thisStatus }).then(res => {
              if (res.data.code == 0) {
                that.setData({ status: 1 })
                that.hideModal()
              }
            })
            
          }
          
        }
      })
    }

  },
  //修改活动
  modify:function(){
    wx.navigateTo({
      url: '/pages/releaseDetail/releaseDetail?type='+this.data.type+'&source_id='+this.data.source_id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  orderStatus(){
  
    let source_id = this.data.source_id
    console.log(source_id)

    wx.navigateTo({
      url:`/pages/orderStatus/orderStatus?source_id=${source_id}`
    })
  },
  orderAdministration(){
    let source_id = this.data.source_id
    wx.navigateTo({
      url:`/pages/orderAdministration/orderAdministration?source_id=${source_id}`
    })
  },
  //接收登录页面传来的用户信息
  setPagesData(obj) {
    this.setData({ allCartNum: 0 })
    this.getSource(obj);
    this.getOrder(obj,1)
  }
})
  