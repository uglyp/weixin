// pages/source/source.js
const app = getApp()
const { uploadImage, operation, productMap, sourceDetail, savePhoneNumber } = require("../../utils/api_request.js");
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    //头部配置信息
    parameter: {
      'navbar': '2',
      'return': '1',
      'isFixed': false
    },
    bgImg: app.globalData.updatePath+'bg.png',
    userInfo: null,
    startdate: '2016-09-01',
    starttime: '12:37',
    enddate: '2016-09-01',
    endtime: '12:37',
    subject:'',//主题
    content:'',//产品内容
    start_time:'',//开始时间组合
    end_time:'',//结束时间组合
    imgs: [],  //上传图片数组
    relative_images:[],//修改货源或求购是备份的原图片地址
    imgStr: '',//上传地址
    isAdd:true,//是否显示添加图片按钮
    if_can_invoice:0,// 是否可以开发票0不可，1可
    if_need_pay:0,// 是否需要在线支付0不需要，1需要
    type:0,//0发货源，1发求购
    setupTime:false,
    phoneNumber:'',
    info: [{
      product_name: '',
      standards: '',
      price:'',
      stock:'',
      purchase_limit_amount:''
    }],
    //infoTemplate:[],
    maxlength: 12,//价钱最高位
    source_id:null,//修改时使用
    

  },
  otherData: {
    imgarr: [],
    startStamp: "",//开始时间的毫秒数
    endStamp: "",//结束时间的毫秒数
    chooseDateType: true,//起始时间是否符合要求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      that.data.type = options.type
      if (options.source_id){
        that.data.source_id = options.source_id
        sourceDetail({ source_id: options.source_id }).then(res => {
          var thisSource = res.data.data.source
          var thisProductInfo = res.data.data.product_info
          var thisInfo = []
          for (var index in thisProductInfo){
            thisInfo.push(thisProductInfo[index].content)
            thisInfo[index]['id'] = thisProductInfo[index].id
            thisInfo[index]['price'] = thisProductInfo[index].price
            thisInfo[index]['stock'] = thisProductInfo[index].stock
            thisInfo[index]['purchase_limit_amount'] = thisProductInfo[index].purchase_limit_amount
          }
          //搜索信息
          if (res.data.code == 0) {
            that.setData({
              userInfo: app.globalData.userInfo,
              subject: thisSource.subject,
              startdate: util.timestampToTime(thisSource.start_time).substring(0,10),
              starttime: util.timestampToTime(thisSource.start_time).substring(11, 16),
              enddate: util.timestampToTime(thisSource.end_time).substring(0, 10),
              endtime: util.timestampToTime(thisSource.end_time).substring(11, 16),
              content: thisSource.content,
              imgs: thisSource.images,
              if_can_invoice: thisSource.if_can_invoice,
              if_need_pay: thisSource.if_need_pay,
              type: that.data.type,
              info: thisInfo,
              setupTime:true,
              phoneNumber:wx.getStorageSync('phoneNumber')
            })
            that.otherData.startStamp = app.datetime_to_unix(that.data.startdate, that.data.starttime)
            that.otherData.endStamp = app.datetime_to_unix(that.data.enddate, that.data.endtime)
            that.data.start_time = that.data.startdate + ' ' + that.data.starttime + ':00'
            that.data.end_time = that.data.enddate + ' ' + that.data.endtime + ':00'
            that.otherData.imgarr = thisSource.images
            that.data.relative_images = thisSource.relative_images

          }
        })
      }else{
        //时间设定
        var nowDate = new Date()
        var startStamp = nowDate.getTime();
        var startdate = app.formatDate(nowDate);
        var endStamp = startStamp + 7 * 24 * 3600 * 1000;
        var enddate = app.formatDate(new Date(endStamp))
        that.setData({
          userInfo: app.globalData.userInfo,
          type: that.data.type,
          startdate: startdate,
          enddate: enddate,
          phoneNumber: wx.getStorageSync('phoneNumber')
        })
        that.otherData.startStamp = app.datetime_to_unix(startdate, that.data.starttime)
        that.otherData.endStamp = app.datetime_to_unix(enddate, that.data.endtime)
        that.data.start_time = startdate + ' ' + that.data.starttime + ':00'
        that.data.end_time = enddate + ' ' + that.data.endtime + ':00'
      }
    }
  },
 
  payChange:function(e){
    this.setData({
      if_need_pay:e.detail.value?1:0
    })
  },
  invoiceChange:function(e){
    this.setData({
      if_can_invoice: e.detail.value ? 1 : 0
    })

  },
  bindSubject: function (e) {
    this.setData({
      subject: e.detail.value
    })
  },
  bindMessage: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //图片选择
  uploadImages: function () {
    var count = 6 - this.data.imgs.length;
    var that = this;
    var maxSize = 2000000;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        for (let i = 0; i < res.tempFiles.length; i++) {
          if (res.tempFiles[i].size < maxSize) {
            if (that.otherData.imgarr.length < 6) {
              that.otherData.imgarr.push( res.tempFiles[i].path)
            }
            that.setData({
              imgs: that.otherData.imgarr
            })
          } else {
            wx.showToast({
              title: '上传的图片中不能有超过2M的图片',
              icon: 'none',
              duration: 2000
            })
          }
          if (that.data.imgs.length >= 6) {
            that.setData({ isAdd: false })
          }
        }
        
        
      },
    })
  },
  //删除照片
  delImg: function (e) {
    let that = this;
    var thisindex = e.currentTarget.dataset.index;
    that.data.imgs.splice(thisindex, 1)
    that.data.relative_images.splice(thisindex,1)
    that.setData({
      imgs: that.data.imgs
    })
    if (that.data.imgs.length < 6) {
      that.setData({ isAdd: true })
    }
  },
  bindStartDateChange: function (e) {
    this.otherData.startStamp = app.datetime_to_unix(e.detail.value,this.data.starttime)
    if(this.chooseDate()){
      this.setData({
        startdate: e.detail.value,
      })
      this.data.start_time = e.detail.value + ' ' + this.data.starttime + ':00'
    }
    
  },
  bindStartTimeChange: function (e) {
    this.otherData.startStamp = app.datetime_to_unix(this.data.startdate, e.detail.value)
    if (this.chooseDate()) {
      this.setData({
        starttime: e.detail.value
      })
      this.data.start_time = this.data.startdate + ' ' + e.detail.value + ':00'
    }
  },
  bindEndDateChange: function (e) {
    this.otherData.endStamp = app.datetime_to_unix(e.detail.value,this.data.endtime)
    if(this.chooseDate()){
      this.setData({
        enddate: e.detail.value
      })
      this.data.end_time = e.detail.value + ' ' + this.data.endtime + ':00'

    }
  },
  bindEndTimeChange: function (e) {
    this.otherData.endStamp = app.datetime_to_unix(this.data.enddate, e.detail.value)
    if (this.chooseDate()) {
      this.setData({
        endtime: e.detail.value
      })
      this.data.end_time = this.data.enddate + ' ' + e.detail.value + ':00'
    }
  },
  // 活动时间改变验证
  chooseDate() {
    if (this.otherData.startStamp != "" && this.otherData.endStamp != "") {
      if (this.otherData.startStamp > this.otherData.endStamp) {
        wx.showModal({
          title: '提醒',
          content: '开始日期不得大于结束日期',
          showCancel: false
        })
        return false
      } else {
        return true
      }
      
    }

  },
  //设置时间
  setupTime:function(){
    this.setData({ setupTime: !this.data.setupTime})
  },
  inputBlur({
    currentTarget: {
      dataset: {
        index,
        field
      }
    },
    detail: {
      value
    }
  }) {
    let {
      info
    } = this.data
    if (field == 'price') {
      //价格
      if (value) {
        if (new RegExp(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/).exec(value)) {
          let maxlength = value.indexOf('.') + 3;
          if (maxlength == 2) {
            maxlength = 12;
          }
          this.setData({
            maxlength
          })
          info[index][field] = value
        } else {
          wx.showModal({
            title: '提醒',
            content: '价格举例：99.99',
            showCancel: false
          })
          info[index][field] = ''

        }
      } 
    } else if (field == 'stock' || field == 'purchase_limit_amount') {
      //库存
      if (value) {
        if (new RegExp(/^\d+$/).exec(value)) {
        } else {
          wx.showModal({
            title: '提醒',
            content: '库存应为正整数',
            showCancel: false
          })
          info[index][field] = ''
        }
      } 
    } 
    this.setData({
      info
    })
  },
  changeInput({
    currentTarget: {
      dataset: {
        index,
        field
      }
    },
    detail: {
      value
    }
  }) {
    let {
      info
    } = this.data
    info[index][field] = value
    this.setData({
      info
    })
  },
  //添加商品
  addItem() {
    let {
      info
    } = this.data
    info.push({
      product_name: '',
      standards: '',
      price: '',
      stock: '',
      purchase_limit_amount:''
    })
    this.setData({
      info
    })
  },
  
  //删除商品
  delItem:function(e){
    let that = this;
    var thisindex = e.currentTarget.dataset.index;
    let {info} = this.data
    info = info.filter(function (item, index) {
      return index != thisindex;
    });
    this.setData({
      info
    })
  },
  //获取电话号码
  getPhoneNumber:function(e){
    savePhoneNumber({ 
      encrypted_data: e.detail.encryptedData, 
      iv: e.detail.iv}).then(res=>{
        if(res.data.code==0){
          wx.setStorageSync('phoneNumber', res.data.data.phoneNumber);
          wx.setStorageSync('countryCode', res.data.data.countryCode);
          this.submit()
        }
    })
   
  },
  //提交
  submit:function(){
    let that = this
    var thisImgs = that.data.imgs
    var thisInfo = that.data.info
    if (that.data.subject==''){
      wx.showToast({
        title: '请输入主题',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    if (that.data.type==0&&thisInfo.length>0){
      for (var i = 0; i < thisInfo.length;i++){
        if (thisInfo[i].stock==''||parseInt(thisInfo[i].stock)==0){
          wx.showToast({
            title: '第' + (i+1)+'个产品库存应大于零',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
          return
        }
      }
    }
    wx.showLoading({
      title: '正在提交,请稍后',
    })
    if (thisImgs.length>0){
      //有图片上传先处理图片地址
      var promise = Promise.all(thisImgs.map((thisImg, index) => {
        if (that.data.relative_images.length>0){
          //修改 货源和求购 时做图片处理
          var imgs = that.data.relative_images
          for (var index in imgs){
            if (thisImg.indexOf(imgs[index])== -1){
              return new Promise(function (resolve, reject) {
                wx.uploadFile({
                  url: app.globalData.domain + '/v1/source/upload-image',
                  filePath: thisImg,
                  name: 'image',
                  header: app.globalData.headers,
                  success: function (res) {
                    that.data.imgStr = that.data.imgStr + JSON.parse(res.data).data + '&'
                    resolve(res.data);
                  },
                  fail: function (err) {
                    reject(new Error('failed to upload file'));
                  }
                });
              });

            }
          }
        }else{
          return new Promise(function (resolve, reject) {
            wx.uploadFile({
              url: app.globalData.domain + '/v1/source/upload-image',
              filePath: thisImg,
              name: 'image',
              header: app.globalData.headers,
              success: function (res) {
                that.data.imgStr = that.data.imgStr + JSON.parse(res.data).data + '&'
                resolve(res.data);
              },
              fail: function (err) {
                reject(new Error('failed to upload file'));
              }
            });
          });

        } 
        
      }));
      promise.then(function (results) {
        that.tobeOrder()
      }).catch(function (err) {
        console.log(err);
      });
    }else{
      //无图片上传
      that.tobeOrder()
    }
  },
  //保存
  tobeOrder: function (){
    let that = this;
    var s = that.data.imgStr
    if (that.data.relative_images.length > 0) {
      for (var index in that.data.relative_images){
        s = s + that.data.relative_images[index]+ '&'
      }
    }
    var dataInfo = {
      type: that.data.type,
      subject: that.data.subject,
      content: that.data.content,
      images: s.substring(0, s.length - 1),
      start_time: that.data.start_time,
      end_time: that.data.end_time,
      if_can_invoice: that.data.if_can_invoice,
      if_need_pay: that.data.if_need_pay,
      products: JSON.stringify(that.data.info),
      source_id: that.data.source_id ? that.data.source_id:''
    }
    operation(dataInfo).then(res => {
      if (res.data.code == 0) {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(function () {
          var thisUrl = (that.data.type == 0) ? '/pages/mysource/mysource?release=1' :'/pages/myAskToBuy/myAskToBuy?release=1'
          wx:wx.navigateTo({
            url: thisUrl,
            
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