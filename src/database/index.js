import mysql from 'mysql2'
import ConfigDB from '../config/database.conf.js'

/**
 * @param {string} sql
 * @returns {Promise<object[] | object>}
 */
export async function query(sql) {
    try {
        const con = mysql.createConnection(ConfigDB)
        
        const [rows, fields] = await con.promise().query(sql)

        return rows
    } catch (error) {
        console.error('Error connecting to database', error)
    }
}
