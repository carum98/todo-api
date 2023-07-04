import mysql from 'mysql2'
import ConfigDB from '../config/database.conf.js'

/**
 * Helper function to execute a query `SELECT` in the database
 * 
 * @param {string} table       - Table name
 * @param {object} [params]    - Object with key-value pairs to filter the query
 * @param {string} [condition] - Condition to be used in the query (AND or OR)
 * @returns {Promise<object | object[] | null>}
 */
export async function SELECT(table, params, condition = 'AND') {
    if (!params) {
        return await query(`SELECT * FROM ${table}`)
    }

    const values = []

    for (const [key, value] of Object.entries(params)) {
        values.push(`${key} = '${value}'`)
    }

    const sql = `SELECT * FROM ${table} WHERE ${values.join(` ${condition} `)}`
    const data = await query(sql)

    if (data.length === 0) {
        return null
    }

    if (data.length === 1) {
        return data[0]
    } else {
        return data
    }
}

/**
 * Helper function to execute a query `INSERT` in the database
 * 
 * @param {string} table  - Table name
 * @param {object} params - Object with key-value pairs to be inserted
 * @returns {Promise<object>}
 */
export async function INSERT(table, params) {
    const keys = Object.keys(params)

    const values = Object.values(params).map(value => {
        if (typeof value === 'string') {
            return `'${value}'`
        } else {
            return value
        }
    })

    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`

    return await query(sql)
}

/**
 * Helper function to execute a query `UPDATE` in the database
 * 
 * @param {string} table  - Table name
 * @param {number} id     - ID of the row to be updated
 * @param {object} params - Object with key-value pairs to be updated
 * @returns {Promise<object>}
 */
export async function UPDATE(table, id, params) {
    const values = []

    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            values.push(`${key} = '${value}'`)
        } else {
            values.push(`${key} = ${value}`)
        }
    }

    const sql = `UPDATE ${table} SET ${values.join(',')} WHERE id = ${id}`

    return await query(sql)
}

/**
 * Helper function to execute a query `DELETE` in the database
 * 
 * @param {string} table - Table name
 * @param {number} id    - ID of the row to be deleted
 * @returns {Promise<object>}
 */
export async function DELETE(table, id) {
    const sql = `DELETE FROM ${table} WHERE id = ${id}`

    return await query(sql)
}

/**
 * Helper function to execute a query in the database
 * 
 * @param {string} sql
 * @returns {Promise<object[] | object>}
 */
async function query(sql) {
    try {
        const con = mysql.createConnection(ConfigDB)
        
        const [rows, fields] = await con.promise().query(sql)

        return rows
    } catch (error) {
        console.error('Error connecting to database', error)
    }
}
