const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    commentValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product_id = options.product_id
    this.getProductDetail(product_id)
  },
  onInput(event){
    this.setData({
      commentValue:event.detail.value.trim()
    })
  },
  getProductDetail(ID) {
    wx.showLoading({
      title: '商品数据加载中...',
    })
    qcloud.request({
      url: config.service.productDetail + ID,
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          this.setData({
            product: data.data
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack({
            }, 2000)
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
  onTapAddComment(event){
    wx.showLoading({
      title: '提交中，请稍后',
    })
    qcloud.request({
      url:config.service.comment,
      login:true,
      method:'PUT',
      data:{
        product_id:this.data.product.id,
        content: this.data.commentValue
      },
      success:res=>{
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '评论完成',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
        }       
      },
      fail:res=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '评论失败',
        })
      }
    })
  }
})