import mysql from 'mysql2'
import ConfigDB from '../../config/database.conf.js'

/**
 * Helper function to execute a query `SELECT` in the database
 * 
 * @param {string} table              - Table name
 * @param {object} [params]           - Object with key-value pairs to filter the query
 * @param {object} [config]           - Object with configuration for the query
 * @param {string} [config.orderBy]   - Column to be used in the `ORDER BY` clause
 * @param {string} [config.order]     - Order to be used in the `ORDER BY` clause (ASC or DESC)
 * @param {string} [config.condition] - Condition to be used in the query (AND or OR)
 * @param {object} [config.columnsCounts]  - Columns to be used in the `COUNT` clause
 * @returns {Promise<object | object[] | null>}
 */
export async function SELECT(
    table, 
    params, 
    { condition = 'AND', orderBy = 'id', order = 'ASC', columnsCounts = {} } = {}
) {
    const counts = buildColumnsCounts(columnsCounts)
    const values = buildValues(params)

    let sql = `SELECT ${table}.*`

    if (counts.length > 0) {
        sql += `,${counts.join(',')}`
    }

    sql += ` FROM ${table}`

    if (values.length > 0) {
        sql += ` WHERE ${values.join(` ${condition} `)}`
    }

    sql += ` ORDER BY ${orderBy} ${order}`

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
    const values = buildValues(params)

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
 * Helper function to execute a query `COUNT` in the database
 * 
 * @param {string} table 
 * @param {object} params 
 * @returns {Promise<object>}
 */
export async function COUNT(table, params) {
    const values = buildValues(params)

    const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${values.join(',')}`

    return await query(sql).then(data => data[0].count)
}

/**
 * Helper function to execute a query in the database
 * 
 * @param {string} sql
 * @returns {Promise<object[] | object>}
 */
async function query(sql) {
    let con = null
    try {
        con = mysql.createConnection(ConfigDB)
        
        const [rows, fields] = await con.promise().query(sql)

        return rows
    } catch (error) {
        console.error('Error connecting to database', error)
    } finally {
        if (con) {
            await con.promise().end()
        }
    }
}

/**
 * Helper function to close the connection to the database
 */
export async function closeConnection() {
    try {
        const con = mysql.createConnection(ConfigDB)
        
        await con.promise().end()
    } catch (error) {
        console.error('Error closing connection to database', error)
    }
}

/**
 * Helper function to generate the values of a query
 * @param {Object} params 
 * @returns {string[]}
 */
function buildValues(params) {
    const values = []

    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            values.push(`${key} = '${value}'`)
        } else {
            values.push(`${key} = ${value}`)
        }
    }

    return values
}

/**
 * Helper function to generate the columns query
 * @param {Object} counts 
 * @returns {string[]}
 */
function buildColumnsCounts(counts) {
    const values = []

    for (const [name, value] of Object.entries(counts)) {
        const { table, params } = value

        values.push(`(SELECT COUNT(*) FROM ${table} WHERE ${buildValues(params).join(` AND `).replaceAll('\'', '')}) as ${name}`)
    }

    return values
}