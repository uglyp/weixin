// components/load-more/index.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchStorage: {
      type: Object,
      value: []
    }
  },
  data:{
    updatePath: app.globalData.updatePath,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    toSearchList: function (e) {
      console.log(e,'子组件中的eeeeeee')
      let value = e.currentTarget.dataset.value
      console.log(value,'valuevaluevaluevalue')
      this.triggerEvent('toSearchList',value)
    },
    historyDel() {
      this.triggerEvent('historyDel')

    },
    allClick(){
      this.triggerEvent('allClick')

    }

  }
})