const mysql = require('mysql2/promise');
const config = require('../config/db');

// 创建连接池
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port : config.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 封装数据库操作方法
class Mysql {
    static async query(sql,values){
        try{
            const [rows] = await pool.query(sql,values)
            return rows
        }catch(err){
            console.error('SQL error:',err)
            throw err
        }
    }
}

module.exports = Mysql