const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    haveComment:true,
    commentList:[]
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
          this.getComment(ID)
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
        list:[product],
        isInstantBuy:true
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
  },
  getComment(ID){
    qcloud.request({
      url: config.service.commentList,
      data:{
        product_id: ID
      },
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          this.setData({
            commentList :data.data
          })
          console.log(data.data)
        }
        else {
          wx.showLoading({
            icon:'none',
            title: '评论加载失败'
          })
        }
      },
      error: res => {
        wx.showLoading({
          icon: 'none',
          title: '评论加载失败'
        })
      }
    })
  },
  addTrolley(){
    wx.showLoading({
      title: '加入购物车中，请稍后',
    })
    qcloud.request({
      url: config.service.addTrolley,
      login: true,
      method: 'PUT',
      data: { id: this.data.product.id},
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
  
  
  
  
  },
  onTapCommentEntry(event){
    let product = this.data.product
    if(this.data.haveComment){
      wx.navigateTo({
        url: '/pages/commentList/commentList?id='+product.id+'&price='+product.price+'&name='+product.name+'&image='+product.image,
      })
    }
  }
})