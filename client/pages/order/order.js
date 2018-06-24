const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
        this.getOrder()
      }
    })

  },
  onTapLogin: function (event) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
        this.getOrder()
      }
    })
  },
  getOrder(){
      wx.showLoading({
        title: '订单数据加载中...',
      })
      qcloud.request({
        url: config.service.orderList,
        login:true,
        success: res => {
          wx.hideLoading()
          let data = res.data
          console.log(data)
          if (!data.code) {
            this.setData({
              orderList: data.data
            })
          }
          else {
            wx.showToast({
              icon:'none',
              title: '订单加载失败',
            })
          }
        },
        fail: res => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '订单加载失败了',
          })
        }
      })
  }
})