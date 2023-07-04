import { SELECT, INSERT, UPDATE, DELETE } from '../database/index.js'

const table = 'refresh_tokens'

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function get(id) {
    return await SELECT(table, { id })
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
    return await SELECT(table, params, condition)
}

/**
 * 
 * @param {object} param
 * @param {string} param.token
 * @param {number} param.user_id
 * @returns {Promise<object>}
 */
async function create({ token, user_id }) {
    return INSERT(table, { token, user_id })
}

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function remove(id) {
    return DELETE(table, id)
}

/**
 * @param {object} param
 * @param {number} param.id
 * @param {{ token: string? }} param.params
 * @returns {Promise<object>}
 */
async function update({ id, params }) {
    return UPDATE(table, id, params)
}

export default {
    get,
    getBy,
    create,
    remove,
    update,
}