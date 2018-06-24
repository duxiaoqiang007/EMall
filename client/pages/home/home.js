const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()
  },
  getProductList(){
    wx.showLoading({
      title: '商品数据加载中...',
    })
    qcloud.request({
      url: config.service.productList,
      success: res => {
        wx.hideLoading()
        if(!res.data.code){
          this.setData({
            productList: res.data.data
          })
        }
        else{
          wx.showToast({
            title: '商品加载失败',
          })         
        }
      },
      error: res => {
        wx.hideLoading()
        wx.showToast({
          title: '商品加载失败',
        })
      }
    })
  },
  addTrolley(event){
    let id = event.currentTarget.dataset.id
    let productList = this.data.productList
    let product
    wx.showLoading({
      title: '加入购物车中，请稍后',
    })
    
    for(let i=0,len=productList.length;i<len;i++){
      if (productList[i].id === id){
        product = productList[i]
        break
      }
    }

    qcloud.request({
      url: config.service.addTrolley,
      login: true,
      method: 'PUT',
      data: product,
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '加入购物车成功',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加入购物车失败，请重试',
          })
        }
      },
      fail: (error) => {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '加入购物车失败了，请重试',
        })
      }
    })
  }
  
})