import { query } from '../database/index.js'

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function get(id) {
    const sql = `SELECT * FROM refresh_tokens WHERE id = ${id}`

    const [data] = await query(sql)

    return data
}

/**
 * @param {object} params 
 * @param {number} [params.id]
 * @param {string} [params.token]
 * @param {number} [params.user_id]
 * @param {string} [condition]
 * @returns {Promise<object | null>}
 */
async function getBy(params, condition = 'AND') {
    const values = []

    for (const [key, value] of Object.entries(params)) {
        values.push(`${key} = '${value}'`)
    }

    const sql = `SELECT * FROM refresh_tokens WHERE ${values.join(` ${condition} `)}`

    const data = await query(sql)

    if (data.length === 0) {
        return null
    }

    return data[0]
}

/**
 * 
 * @param {object} param
 * @param {string} param.token
 * @param {number} param.user_id
 * @returns {Promise<object>}
 */
async function create({ token, user_id }) {
    const sql = `INSERT INTO refresh_tokens (token, user_id) VALUES ('${token}', '${user_id}')`

    return await query(sql)
}

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function remove(id) {
    const sql = `DELETE FROM refresh_tokens WHERE id = ${id}`

    return await query(sql)
}

/**
 * @param {object} param
 * @param {number} param.id
 * @param {{ token: string? }} param.params
 * @returns {Promise<object>}
 */
async function update({ id, params }) {
    const values = []
        
    for (const [key, value] of Object.entries(params)) {
        values.push(`${key} = '${value}'`)
    }

    const sql = `UPDATE refresh_tokens SET ${values.join(', ')} WHERE id = ${id}`
    return await query(sql)
}

export default {
    get,
    getBy,
    create,
    remove,
    update,
}