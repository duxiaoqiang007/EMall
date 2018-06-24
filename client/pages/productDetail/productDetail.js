const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productID = options.id
    this.getProductDetail(productID)
  },
  getProductDetail(ID){
    wx.showLoading({
      title: '商品数据加载中...',
    })
    qcloud.request({
      url: config.service.productDetail + ID ,
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          this.setData({
            product: data.data
          })
        }
        else {
          setTimeout(()=>{
            wx.navigateBack({
            },2000)
          })
        }
      },
      error: res => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack({
          }, 2000)
        })
      }
    })
  },
  buy(){
    wx.showLoading({
      title: '购买中，请稍后',
    })
    let product = Object.assign({
      count:1
    },this.data.product)

    qcloud.request({
      url:config.service.addOrder,
      login:true,
      method:'POST',
      data:{
        list:[product]
      },
      success:res=>{
        wx.hideLoading()
        let data = res.data
        if(!data.code){
          wx.showToast({
            title: '购买成功',
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '购买失败，请重试',
          })
        }
      },
      fail:(error)=>{
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          icon:'none',
          title: '购买失败，请重试',
        })
      }
    })
  }
})