const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: true, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选 
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
        this.getTrolleyList()
      }
    })
  },
  onTapLogin: function (event) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
        this.getTrolleyList()
      }
    })
  },
  getTrolleyList(){
    wx.showLoading({
      title: '购物车加载中...',
    })
    qcloud.request({
      url: config.service.trolleyList,
      login: true,
      success: res => {
        wx.hideLoading()
        if (!res.data.code) {
          this.setData({
            trolleyList: res.data.data
          })
          console.log(res.data.data)
        }
        else {
          wx.showToast({
            title: '购物车加载失败',
          })
        }
      },
      error: res => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '购物车加载失败',
        })
      }
    })
  },
  onTapCheckSingal(event){
    let checkId = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount
    let numTotalProduct
    let numCheckProduct =0
    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]
    numTotalProduct = trolleyList.length
    trolleyCheckMap.forEach(checked=>{
      numCheckProduct = checked?numCheckProduct+1:numCheckProduct
    })
    isTrolleyTotalCheck = (numTotalProduct===numCheckProduct)?true:false
    trolleyAccount= this.getTotalMoney(trolleyCheckMap, trolleyList)
     
    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })

  },
  onTapTotalCheck(event){
    let trolleyCheckMap=this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount
    isTrolleyTotalCheck = !isTrolleyTotalCheck
    trolleyList.forEach(product=>{
      trolleyCheckMap[product.id] = isTrolleyTotalCheck
    })
    trolleyAccount = this.getTotalMoney(trolleyCheckMap, trolleyList)
    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },
  getTotalMoney(trolleyCheckMap, trolleyList){
    let account = 0
    trolleyList.forEach(product=>{
      account = trolleyCheckMap[product.id] ? account + product.price * product.count : account
    })
    return account
  },
  onTapIfEdit(event){
    let isTrolleyEdit = this.data.isTrolleyEdit
    this.setData({
      isTrolleyEdit:!isTrolleyEdit
    })
  },
  onTapMin(event){
    let id = event.currentTarget.dataset.id
    let trolleyAccount = this.data.trolleyAccount
    let trolleyList = this.data.trolleyList
    let trolleyCheckMap = this.data.trolleyCheckMap
    for (let i = 0; i < trolleyList.length;i++){
        if(trolleyList[i].id == id){
          trolleyList[i].count = trolleyList[i].count - 1 > 0 ? trolleyList[i].count - 1 : 0
          if (trolleyList[i].count == 0){
            trolleyList.splice(i,1)
            delete trolleyCheckMap[id]
          }
          this.updateTrolleyList(trolleyList)
          trolleyAccount = this.getTotalMoney(trolleyCheckMap, trolleyList)
          this.setData({
            trolleyList,
            trolleyAccount
          })
          break;
        }
    }
  },
  onTapAdd(event){
    let id = event.currentTarget.dataset.id
    let trolleyAccount = this.data.trolleyAccount
    let trolleyCheckMap = this.data.trolleyCheckMap
    let count
    let trolleyList = this.data.trolleyList
    trolleyList.forEach(product => {
      if (product.id == id) {
        product.count += 1
        this.updateTrolleyList(trolleyList)
        trolleyAccount = this.getTotalMoney(trolleyCheckMap, trolleyList)
        this.setData({
          trolleyList,
          trolleyAccount
        })
      }
    })   
  },
  updateTrolleyList(trolleyList){
    wx.showLoading({
      title: '更新购物车，请稍后',
    })
    qcloud.request({
      url: config.service.trolleyList,
      login: true,
      method: 'POST',
      data: { list: trolleyList },
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
         this.setData({
           isTrolleyEdit:false
         })
        } else {
          wx.showToast({
            icon: 'none',
            title: '更新购物车失败，请重试',
          })
        }
      },
      fail: (error) => {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '更新购物车失败了，请重试',
        })
      }
    })
  }, 
  buy(event) {
    if (this.data.trolleyAccount<=0) return

    wx.showLoading({
      title: '购买中，请稍后',
    })
    let trolleyList = this.data.trolleyList
    let buyList = []
    let trolleyCheckMap = this.data.trolleyCheckMap
     buyList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product.id]
    })
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: buyList,
        isInstantBuy: false
      },
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '购买成功',
          })
          this.getTrolleyList()
        } else {
          wx.showToast({
            icon: 'none',
            title: '购买失败，请重试',
          })
        }
      },
      fail: (error) => {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '购买失败了，请重试',
        })
      }
    })
  }
})