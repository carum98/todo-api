import { query } from '../database/index.js'

/**
 * @returns {Promise<object[]>}
 */
async function getAll() {
    const sql = 'SELECT * FROM users'

    return await query(sql)
}

/**
 * @param {object} params
 * @param {number} [params.id]
 * @param {string} [params.name]
 * @param {string} [params.user_name]
 * @param {string} [params.password]
 * @param {string} [condition]
 * @returns {Promise<object | object[] | null>}
 */
async function getBy(params, condition = 'AND') {
    const values = []

    for (const [key, value] of Object.entries(params)) {
        values.push(`${key} = '${value}'`)
    }

    const sql = `SELECT * FROM users WHERE ${values.join(` ${condition} `)}`

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
 * @param {Object} param
 * @param {string} param.name
 * @param {string} param.user_name
 * @param {string} param.password
 * @returns {Promise<object>}
 */
async function create({ name, user_name, password }) {
    const sql = `INSERT INTO users (name, user_name, password) VALUES ('${name}', '${user_name}', '${password}')`

    return await query(sql)
}

/**
 * @param {number} id
 * @returns {Promise<object>}
 */
async function remove(id) {
    const sql = `DELETE FROM users WHERE id = ${id}`

    return await query(sql)
}

/**
 * @param {object} param
 * @param {number} param.id
 * @param {{ name: string?, user_name: string?, password: string? }} param.params
 * @returns {Promise<object>}
 */
async function update({ id, params }) {
    const values = []
        
    for (const [key, value] of Object.entries(params)) {
        values.push(`${key} = '${value}'`)
    }

    const sql = `UPDATE users SET ${values.join(', ')} WHERE id = ${id}`
    return await query(sql)
}

export default {
    getAll,
    getBy,
    create,
    remove,
    update,
}