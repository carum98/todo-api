import { query } from '../database/index.js'

async function getAll() {
    const sql = 'SELECT * FROM users'

    return await query(sql)
}

async function getById(id) {
    const sql = `SELECT * FROM users WHERE id = ${id}`
    const [user] = await query(sql)

    return user
}

async function create({ name, user_name, password }) {
    const sql = `INSERT INTO users (name, user_name, password) VALUES ('${name}', '${user_name}', '${password}')`

    await query(sql)
}

async function remove(id) {
    const sql = `DELETE FROM users WHERE id = ${id}`
    await query(sql)
}

async function update({ id, name, user_name, password }) {
    const sql = `UPDATE users SET name = '${name}', user_name = '${user_name}', password = '${password}' WHERE id = ${id}`
    await query(sql)
}

export default {
    getAll,
    getById,
    create,
    remove,
    update,
}