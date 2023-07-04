import { query } from '../database/index.js'

const table = 'todos'

/**
 * @param {object} params 
 * @param {number} [params.id]
 * @param {number} [params.user_id]
 * @param {boolean} [params.is_complete]
 * @param {string} [condition]
 * @returns {Promise<object | object[] | null>}
 */
async function getBy(params, condition = 'AND') {
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
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {boolean} params.is_complete
 * @param {number} params.user_id
 * @returns {Promise<object>}
 */
async function create(params) {
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
 * @param {number} id 
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {boolean} params.is_complete
 * @param {number} params.user_id
 * @returns {Promise<object>}
 */
async function update(id, params) {
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
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function remove(id) {
    const sql = `DELETE FROM ${table} WHERE id = ${id}`

    return await query(sql)
}

export default {
    getBy,
    create,
    update,
    remove
}