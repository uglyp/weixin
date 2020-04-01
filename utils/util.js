const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const $h = {
  //除法函数，用来得到精确的除法结果
  //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：$h.Div(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
  Div: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length; } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length; } catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  //加法函数，用来得到精确的加法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：$h.Add(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  Add: function (arg1, arg2) {
    arg2 = parseFloat(arg2);
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(100, Math.max(r1, r2));
    return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
  },
  //减法函数，用来得到精确的减法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：$h.Sub(arg1,arg2)
  //返回值：arg1减去arg2的精确结果
  Sub: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
  },
  //乘法函数，用来得到精确的乘法结果
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：$h.Mul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  Mul: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
}
/**
 * 处理服务器扫码带进来的参数
 * @param string param 扫码携带参数
 * @param string k 整体分割符 默认为：&
 * @param string p 单个分隔符 默认为：=
 * @return object
 * 
*/
const getUrlParams = (param, k, p) => {
  if (typeof param != 'string') return {};
  k = k ? k : '&';//整体参数分隔符
  p = p ? p : '=';//单个参数分隔符
  var value = {};
  if (param.indexOf(k) !== -1) {
    param = param.split(k);
    for (var val in param) {
      if (param[val].indexOf(p) !== -1) {
        var item = param[val].split(p);
        value[item[0]] = item[1];
      }
    }
  } else {
    var item = param.split(p);
    value[item[0]] = item[1];
  }
  return value;
}

/*
* 网络请求 
* @param string | object 请求地址
* @param method 请求方式
* @param params data数据
* @param header  请求头部
*/
const app = getApp();
const wxRequest = (url, method, params, header) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: method,
      header: header,
      success: res => {
        resolve(res);
      },
      fail: res => {
        reject('error');
        app.defShowToast('请求失败');
        //验证无网情况

      }
    })
  }).catch(err => {
    console.error(err);
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType == 'none') {
          if (app.globalData.isConnectting) {
            app.globalData.isConnectting = false;
            app.defShowToast('请检查网络');
          }

        }

      }
    })

  })

};
//倒计时；
var time = function (timeStamp, that) {
  var interval = null,
    totalSecond = timeStamp
   //totalSecond = timeStamp - Date.parse(new Date()) / 1000;//传入时间格式时转换总秒数
  interval = setInterval(function () {
    // 秒数  
    var second = totalSecond;

    // 小时位  
    var hr = Math.floor(second / 3600);
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    var min = Math.floor((second - hr * 3600) / 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    var sec = second - hr * 3600 - min * 60;
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;
    that.setData({
      countDownHour: hrStr,
      countDownMinute: minStr,
      countDownSecond: secStr,
    });
    totalSecond--;
    if (totalSecond <= 0) {
      clearInterval(interval);
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      that.setData({
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
      });
    }
  }.bind(that), 1000);
  that.setData({ interval: interval });
}
//倒计时2；
var time2 = function (timeStamp, that) {
  var totalSecond = timeStamp
  //var totalSecond = timeStamp - Date.parse(new Date()) / 1000;//传入时间格式时转换总秒数
  var interval = setInterval(function () {
    // 秒数  
    var second = totalSecond;
    // // 天数位  
    var day = Math.floor(second / 3600 / 24);
    var dayStr = day.toString();
    if (dayStr.length == 1) dayStr = '0' + dayStr;
    // 小时位  
    var hr = Math.floor((second - day * 3600 * 24) / (60 * 60));
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    // var min = Math.floor((second - hr * 3600) / 60);
    var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    // var sec = second - hrNew * 3600 - min * 60;
    var sec = Math.floor(second - day * 3600 * 24 - hr * 3600 - min * 60);
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;

    that.setData({
      countDownDay: dayStr,
      countDownHour: hrStr,
      countDownMinute: minStr,
      countDownSecond: secStr,
    });
    totalSecond--;
    if (totalSecond <= 0) {
      clearInterval(interval);
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      that.setData({
        countDownDay: '00',
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
        status:1,

      });
    }
  }.bind(that), 1000);
  that.setData({ interval: interval });
}
//时间戳转日期
var timestampToTime = function (timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
/**
  * 生成海报获取文字
  * @param string text 为传入的文本
  * @param int num 为单行显示的字节长度
  * @return array 
 */
const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows]   //  [处理文字的总字节长度，每行显示内容的数组，行数]
}
/**
 * 获取分享海报
 * @param array arr2 海报素材
 * @param string store_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
*/
const PosterCanvas = (arr2, store_name, price, successFn) => {
  wx.showLoading({ title: '海报生成中', mask: true });
  const ctx = wx.createCanvasContext('myCanvas');
  ctx.clearRect(0, 0, 0, 0);
  /**
   * 只能获取合法域名下的图片信息,本地调试无法获取
   * 
  */
  wx.getImageInfo({
    src: arr2[0],
    success: function (res) {
      console.log(res);
      const WIDTH = res.width;
      const HEIGHT = res.height;
      ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
      ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
      ctx.save();
      let r = 90;
      let d = r * 2;
      let cx = 40;
      let cy = 990;
      ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(arr2[2], cx, cy, d, d);
      ctx.restore();
      const CONTENT_ROW_LENGTH = 40;
      let [contentLeng, contentArray, contentRows] = textByteLength(store_name, CONTENT_ROW_LENGTH);
      ctx.setTextAlign('center');
      ctx.setFontSize(32);
      let contentHh = 32 * 1.3;
      for (let m = 0; m < contentArray.length; m++) {
        ctx.fillText(contentArray[m], WIDTH / 2, 820 + contentHh * m);
      }
      ctx.setTextAlign('center')
      ctx.setFontSize(48);
      ctx.setFillStyle('red');
      ctx.fillText('￥' + price, WIDTH / 2, 860 + contentHh);
      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'png',
          destWidth: WIDTH,
          destHeight: HEIGHT,
          success: function (res) {
            console.log('aa'+res.tempFilePath)
            wx.hideLoading();
            successFn && successFn(res.tempFilePath);
          }
        })
      });
    },
    fail: function () {
      wx.hideLoading();
      Tips({ title: '无法获取图片信息' });
    }
  })
}


module.exports = {
  formatTime: formatTime,
  $h: $h,
  wxRequest: wxRequest,
  time: time,
  time2: time2,
  timestampToTime: timestampToTime,
  PosterCanvas: PosterCanvas,
  getUrlParams: getUrlParams
}
