var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js')
var user = require('../db/userSql.js')
let jwt = require('jsonwebtoken')

//引入支付宝文件
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 定义 POST 接口
router.post('/api/dataReport', (req, res) => {
    console.log('📥 收到数据:', req.body);

    if (!req.body.eventType || !req.body.details) {
        return res.status(400).json({ message: '❌ 缺少必要参数' });
    }

    // 模拟数据持久化或处理
    const { eventType, details } = req.body;
    console.log(`✅ 事件类型: ${eventType}, 详情:`, details);

    res.status(200).json({ message: '✅ 数据上报成功' });
});



//发起支付
router.post('/api/payment',function(req,res,next){
    //订单号
    let orderId = req.body.orderId;
    //商品总价
    let price = req.body.price;
    //购买商品的名称
    let name = req.body.name;
    //开始对接支付宝API
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
      outTradeNo: orderId,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//价格
      subject: name,//商品名称
    });
    //支付成功或者失败跳转的链接
    formData.addField('returnUrl', 'http://localhost:5173/payment');
    //返回promise
    const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    //对接支付宝成功，支付宝方返回的数据
    result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                msg:'支付中',
                paymentUrl : resp
            }
        })
    })
})

//修改订单状态
router.post('/api/submitOrder',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //订单号
    let orderId = req.body.orderId;
    //购物车选中的商品id
    let shopArr = req.body.shopArr;
    //查询用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
        //用户id
        let uId = results[0].id;
        connection.query(`select * from store_order where uId = ${uId} and order_id = ${orderId}`,function(err,result){
            //订单的数据库id
            let id = result[0].id;
            //修改订单状态 1==>2
            connection.query(`update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,function(e,r){
                //购物车数据删除
                shopArr.forEach(v=>{
                    connection.query(`delete from goods_cart where id = ${v}`,function(){
                        
                    })
					
				res.send({
				    data:{
				        code:200,
				        success:true
				    }
				})
                })
            })
        })
    })
    
})

//查询订单
router.post('/api/selectOrder',function(req,res,next){
    //接收前端给后端的订单号
    let orderId = req.body.orderId;
    connection.query(`select * from store_order where order_id='${orderId}'`,function(err,result){
         res.send({
            data:{
                 success:true,
                 code:200,
                 data:result
            }
         })
    })
})

// 生成一个订单
router.post('/api/addOrder', function (req, res, next) {
    console.log('✅ [Step 1] --- 接口已被调用 /api/addOrder');

    // 1. 获取Token
    let token = req.headers.token;
    console.log('🟦 [Step 2] --- 接收到的Token:', token);

    if (!token) {
        return res.send({
            success: false,
            code: 401,
            message: 'Token 未提供',
        });
    }

    let tokenObj = jwt.decode(token);
    console.log('🟩 [Step 3] --- 解码后的tokenObj:', tokenObj);

    // 2. 获取前端传递的订单商品数组
    let goodsArr = req.body.arr;
    console.log('🟨 [Step 4] --- 接收到的goodsArr:', goodsArr);

    if (!goodsArr || goodsArr.length === 0) {
        return res.send({
            success: false,
            code: 400,
            message: '商品数组为空',
        });
    }

    // 3. 生成订单号
    function setTimeDateFmt(s) {
        return s < 10 ? '0' + s : s;
    }

    function randomNumber() {
        const now = new Date();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        month = setTimeDateFmt(month);
        day = setTimeDateFmt(day);
        hour = setTimeDateFmt(hour);
        minutes = setTimeDateFmt(minutes);
        seconds = setTimeDateFmt(seconds);
        let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
        return orderCode;
    }

    let orderId = randomNumber();
    console.log('🟧 [Step 5] --- 生成的订单号 orderId:', orderId);

    // 4. 统计商品信息
    let goodsName = [];
    let goodsPrice = 0;
    let goodsNum = 0;

    goodsArr.forEach(v => {
        goodsName.push(v.goods_name);
        goodsPrice += v.goods_price * v.goods_num;
        goodsNum += parseInt(v.goods_num);
    });
    console.log('🔵 [Step 6] --- 订单商品信息:');
    console.log('    - 商品名称:', goodsName.join(', '));
    console.log('    - 总金额:', goodsPrice);
    console.log('    - 总数量:', goodsNum);

    // 5. 查询当前用户
    console.log('🟪 [Step 7] --- 查询当前用户:', tokenObj.tel);
    connection.query(`SELECT * FROM user WHERE tel = '${tokenObj.tel}'`, function (error, results) {
        if (error) {
            console.error('🚫 [Error] --- 查询用户错误:', error);
            return res.send({
                success: false,
                code: 500,
                message: '查询用户失败',
            });
        }
        if (results.length === 0) {
            console.error('🚫 [Error] --- 未找到对应用户');
            return res.send({
                success: false,
                code: 404,
                message: '未找到对应用户',
            });
        }
        let uId = results[0].id;
        console.log('🟨 [Step 8] --- 用户ID uId:', uId);

        // 6. 插入订单
        connection.query(
            `INSERT INTO store_order (order_id, goods_name, goods_price, goods_num, order_status, uId) 
            VALUES ('${orderId}', '${goodsName}', '${goodsPrice}', '${goodsNum}', '1', ${uId})`,
            function (e, r) {
                if (e) {
                    console.error('🚫 [Error] --- 插入订单失败:', e);
                    return res.send({
                        success: false,
                        code: 500,
                        message: '订单创建失败',
                    });
                }
                console.log('🟢 [Step 9] --- 订单已插入:', r);

                // 7. 查询刚插入的订单
                connection.query(
                    `SELECT * FROM store_order WHERE uId = ${uId} AND order_id = '${orderId}'`,
                    function (err, result) {
                        if (err) {
                            console.error('🚫 [Error] --- 查询订单失败:', err);
                            return res.send({
                                success: false,
                                code: 500,
                                message: '订单查询失败',
                            });
                        }
                        console.log('🟩 [Step 10] --- 查询到的订单:', result);

                        // 8. 发送成功响应
                        res.send({
							data:{
								success: true,
								code: 200,
								data: result
								
							}
                            
                        });
						
                    }
                );
            }
        );
    });
});




//修改购物车数量
router.post('/api/updateNum',function(req,res,next){
    
    let id = req.body.id;
    let changeNum = req.body.num;
    
    connection.query(`select * from goods_cart where id = ${id}`,function(error,results){
        //原来的数量
        let num = results[0].goods_num;
        connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${changeNum}) where id = ${id}`,function(err,result){
            res.send({
                data:{
                    code:200,
                    success:true
                }
            })
        })
    })
})

//查询购物车数据
router.post('/api/selectCart',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //查询用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
        //用户id
        let uId = results[0].id;
        //查询购物车
        connection.query(`select * from goods_cart where uId = ${uId}`,function(err,result){
            res.send({
                data:{
                    code:200,
                    success:true,
                    data:result
                }
            })
        })
    })
})

// 添加购物车数据
router.post('/api/addCart', function(req, res, next) {
    console.log("🔥 [1] 接收到请求: ", req.body);
    
    // 接收前端参数
    let goodsId = req.body.goodsId;
    console.log("📦 [2] 接收到的 goodsId: ", goodsId);

    // 接收 Token
    let token = req.headers.token;
    console.log("🔑 [3] 接收到的 token: ", token);

    // 解析 Token
    let tokenObj;
    try {
        tokenObj = jwt.decode(token);
        if (!tokenObj || !tokenObj.tel) {
            throw new Error('无效的Token');
        }
        console.log("🪙 [4] 解码后的 tokenObj: ", tokenObj);
    } catch (error) {
        console.error("🚨 [Error] Token 解析失败: ", error);
        return res.status(401).send({
            code: 401,
            success: false,
            msg: 'Token 无效或已过期'
        });
    }

    // 查询用户
    connection.query(`SELECT * FROM user WHERE tel = ?`, [tokenObj.tel], function(error, results) {
        if (error) {
            console.error("🚨 [Error] 查询用户失败: ", error);
            return res.status(500).send({
                code: 500,
                success: false,
                msg: '查询用户失败'
            });
        }
        console.log("👤 [5] 用户查询结果: ", results);

        if (results.length === 0) {
            return res.status(404).send({
                code: 404,
                success: false,
                msg: '用户不存在'
            });
        }

        let uId = results[0].id;
        console.log("🆔 [6] 获取到的用户ID: ", uId);

        // 查询商品
        connection.query(`SELECT * FROM goodslist WHERE id = ?`, [goodsId], function(err, result) {
            if (err) {
                console.error("🚨 [Error] 查询商品失败: ", err);
                return res.status(500).send({
                    code: 500,
                    success: false,
                    msg: '查询商品失败'
                });
            }
            console.log("🛒 [7] 商品查询结果: ", result);

            if (result.length === 0) {
                return res.status(404).send({
                    code: 404,
                    success: false,
                    msg: '商品不存在'
                });
            }

            let goodsName = result[0].name;
            let goodsPrice = result[0].price;
            let goodsImgUrl = result[0].imgUrl;

            console.log(`📦 [8] 商品信息 - 名称: ${goodsName}, 价格: ${goodsPrice}, 图片: ${goodsImgUrl}`);

            // 插入购物车
            connection.query(
                `INSERT INTO goods_cart (uId, goods_id, goods_name, goods_price, goods_num, goods_imgUrl) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [uId, goodsId, goodsName, goodsPrice, 1, goodsImgUrl],
                function(e, r) {
                    if (e) {
                        console.error("🚨 [Error] 插入购物车失败: ", e);
                        return res.status(500).send({
                            code: 500,
                            success: false,
                            msg: '添加购物车失败'
                        });
                    }
                    console.log("✅ [9] 购物车插入成功: ", r);
                    res.send({
                        data: {
                            code: 200,
                            success: true,
                            msg: '添加成功'
                        }
                    });
                }
            );
        });
    });
});


//修改密码
router.post('/api/modify',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		//某一条记录数id
		let id = results[0].id;
		let pwd = results[0].pwd;
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

//注册
router.post('/api/register',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		if(error) throw error;
		//用户存在
		if( results.length > 0 ){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'用户已存在，请登录！',
					data:results[0]
				}
			})
		}else{
			//不存在，新增一条数据
			connection.query( user.inserData ( params ),function(err,result){
				connection.query( user.queryUserTel( params ) , function(e,r){
					res.send({
						code:200,
						data:{
							success:true,
							msg:'注册成功！登录成功',
							data:r[0]
						}
					})
				})
			})
		}
	})
	
})

//手机号密码登录
router.post('/api/login',function (req, res, next){
	//接受用户传递的手机号和密码
	let params ={
		userTel : req.body.userTel,
		userPwd : req.body.userPwd
	}
	connection.query(user.queryUserTel(params),function(err,results){
		if(results.length>0){
			connection.query(user.queryUserPwd(params),function(err,result){
				if(result.length>0)
				res.send({
					code:200,
					data:{
						msg:'登陆成功',
						success:true,
						data:result[0]
					},
				})
				else{
					//密码不对
					res.send({
						code:302,
						data:{
							msg:'密码不对',
							success:false
						
						},
					})
					
				}
			})
		}else{
			res.send({
				code:301,
				data:{
					msg:'手机号不存在',
					success:false
				},
			})
			
		}
	})
})


//通过商品id查询的接口
router.get('/api/goods/id', function (req, res, next) {
    // 1. 获取前端传递的 ID
    let id = req.query.id;

    connection.query('SELECT * FROM goodslist WHERE id = ?', [id], function (err, results) {
        if (err) throw error
        res.json({
            code: 0,
            data: results
        });
    });
});


//分类的接口
router.get('/api/goods/list',function (req, res, next){
	res.send({
		code:0,
		data:[
			{
				//一级数据（左侧的）
				id:0,
				name:'正在流行',
				data:[
					{
						//二级数据（右侧的）
						id:0,
						name:'热销爆款',
						imgUrl:'/images/list-1.webp'
					},
					{
						id:1,
						name:'短袖',
						imgUrl:'/images/list-2.webp'
						
					},
					{
						id:2,
						name:'针织衫',
						imgUrl:'/images/list-3.webp'
					},
					{
						id:3,
						name:'衬衫',
						imgUrl:'/images/list-4.webp'
					},
				]
			},
			{
				//一级数据（左侧的）
				id:1,
				name:'上衣',
				data:[
					{
						//二级数据（右侧的）
						id:0,
						name:'热销爆款',
						imgUrl:'/images/list-4.webp'
					},
					{
						id:1,
						name:'套装',
						imgUrl:'/images/list-3.webp'
						
					},
					{
						id:2,
						name:'冲锋衣',
						imgUrl:'/images/list-2.webp'
					},
					{
						id:3,
						name:'防晒衣',
						imgUrl:'/images/list-1.webp'
					}
				]
			}
		]
	})
})



// 后端接口: /api/goods/shopList
router.get('/api/goods/shopList', (req, res) => {
  // 获取请求参数
  const searchName = req.query.searchName || '';   // 搜索关键字
  const currentPage = parseInt(req.query.currentPage) || 1;      // 当前页数
  const pageSize = parseInt(req.query.pageSize) || 10;    // 每页数量
  const offset = (currentPage - 1) * pageSize;               // 偏移量

  console.log(`👉 [INFO] 收到请求 - searchName: "${searchName}", page: ${currentPage}, limit: ${pageSize}`);
  
  // SQL 查询
  const sql = `
    SELECT * FROM goodslist 
    WHERE name LIKE ? 
    ORDER BY id ASC 
    LIMIT ? OFFSET ?`;

  // SQL 参数
  const params = [`%${searchName}%`, pageSize, offset];

  // 执行查询
  connection.query(sql, params, (error, results) => {
    if (error) {
      console.error(`❌ [ERROR] 数据库查询失败: ${error.message}`);
      return res.status(500).send({
        code: 0,
        message: '数据库查询失败',
        error: error.message,
      });
    }

    // 打印查询结果
    console.log(`✅ [INFO] 查询成功 - 返回 ${results.length} 条数据`);
    console.log('返回的数据:', results); // 打印结果数据

    // 检查是否有数据
    if (results.length === 0) {
      console.warn(`⚠️ [WARN] 没有更多数据了 - page: ${currentPage}`);
    }

    // 返回响应
    res.send({
      code: 200,
	  message:"success",
      data:{
		  results,
		  pagenation:{
			  total:results.length,
			  currentPage,
			  pageSize
			  
		  }
		  
	  }
      
    });
  });
});


//首页数据
router.get('/api/index',function(req,res,next){
	res.send({
		code:0,
		data:{
			sortList : [{
					id: 1,
					title: '女装',
					imgUrl: '/images/1.webp'
				}, {
					id: 2,
					title: '女鞋',
					imgUrl: '/images/2.webp'
				},
				{
					id: 3,
					title: '上衣',
					imgUrl: '/images/3.webp'
				},
				{
					id: 4,
					title: '美妆/护肤',
					imgUrl: '/images/4.webp'
				},
				{
					id: 5,
					title: '裤子',
					imgUrl: '/images/5.webp'
				},
				{
					id: 6,
					title: '母婴/童装',
					imgUrl: '/images/6.webp'
				},
				{
					id: 7,
					title: '裙子',
					imgUrl: '/images/7.webp'
				},
				{
					id: 8,
					title: '男装男鞋',
					imgUrl: '/images/8.webp'
				},
				{
					id: 9,
					title: '套装',
					imgUrl: '/images/9.webp'
				},
				{
					id: 10,
					title: '配饰',
					imgUrl: '/images/10.webp'
				}
			],
			goodsList : [{
					id: 1,
					name: '拉链连帽衫燕尾大码女夏季遮肚子显瘦短袖t恤胖mm小众正肩上衣',
					actor: './images/list-1.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '100',
					sales: 11,
					imgUrl: './images/list-1.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 2,
					name: '【送运费险】早秋黑色上衣女新款百搭纯色V领交叉长袖针织衫',
					actor: './images/list-2.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '120',
					sales: 22,
					imgUrl: './images/list-2.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 3,
					name: '2件60露背T恤女短袖新款夏修身针织衫上衣冰丝T恤微透打底衫',
					actor: './images/list-3.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '59',
					sales: 33,
					imgUrl: './images/list-3.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 4,
					name: '2件50元纯色百搭粉色T恤衫少女学生上衣服ins紧身短袖T恤',
					actor: './images/list-4.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '85',
					sales: 44,
					imgUrl: './images/list-4.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 5,
					name: '大码女装短款法式不规则高级感上衣女胖mm显瘦遮肉内搭打底衫',
					actor: './images/list-5.jpg',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '110',
					sales: 555,
					imgUrl: './images/list-5.jpg',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 6,
					name: '60两件长袖t恤春秋新款网红露肩百搭露肩宽松设计感打底心机上衣',
					actor: './images/list-6.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '80',
					sales: 666,
					imgUrl: './images/list-6.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				}
			]
			
		}
	})
})

module.exports = router;
