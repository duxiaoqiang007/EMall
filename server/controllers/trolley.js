const DB = require('../units/db.js')
module.exports={
  //添加到购物车
  add:async ctx=>{
    let user = ctx.state.$wxInfo.userinfo.openId
    let product = ctx.request.body
    let list = await DB.query('select * from trolley_user where trolley_user.id=? and trolley_user.user = ?',[product.id,user])
  
    if(!list.length){
      //购物车没有该商品
      await DB.query('insert into trolley_user(id,count,user) values(?,?,?)',[product.id,1,user])
    }
    else{
      let count = list[0].count + 1
      await DB.query('update trolley_user set count = ? where trolley_user.id =? and trolley_user.user=?',[count,product.id,user])
    }
    ctx.state.data={}
  }
}