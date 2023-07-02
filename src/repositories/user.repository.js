import { query } from '../database/index.js'

/**
 * @returns {Promise<object[]>}
 */
async function getAll() {
    const sql = 'SELECT * FROM users'

    return await query(sql)
}

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function getById(id) {
    const sql = `SELECT * FROM users WHERE id = ${id}`
    const [user] = await query(sql)

    return user
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
 * @param {object} param.params
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
    getById,
    create,
    remove,
    update,
}