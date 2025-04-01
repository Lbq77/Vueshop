const mysql = require('mysql')
let connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'Lbq030526',
	database:'vueshop'
})

module.exports=connection