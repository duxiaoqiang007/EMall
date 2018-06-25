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
      //购物车中有该商品
      let count = list[0].count + 1
      await DB.query('update trolley_user set count = ? where trolley_user.id =? and trolley_user.user=?',[count,product.id,user])
    }
    ctx.state.data={}
  },
  list:async ctx =>{
    let user = ctx.state.$wxInfo.userinfo.openId
    let list = await DB.query('select * from trolley_user left join product on trolley_user.id = product.id where trolley_user.user=?',[user])
    ctx.state.data=list
  },
  update:async ctx=>{
    let user = ctx.state.$wxInfo.userinfo.openId
    let productList = ctx.request.body.list || []
    await DB.query('delete from trolley_user where trolley_user.user=?',[user])
    let sql = 'insert into trolley_user(id,count,user) values'
    let query=[]
    let params = []
    productList.forEach(product=>{
      query.push('(?,?,?)')
      params.push(product.id)
      params.push(product.count || 1)
      params.push(user)
    })
    await DB.query(sql+query.join(','),params)
  }
}


