import { SELECT, INSERT, UPDATE, DELETE, COUNT } from '../database/index.js'

const table = 'todos'

/**
 * @param {object} params 
 * @param {number} [params.id]
 * @param {number} [params.user_id]
 * @param {number} [params.list_id]
 * @param {boolean} [params.is_complete]
 * @param {string} [condition]
 * @returns {Promise<object | object[] | null>}
 */
async function getBy(params, condition = 'AND') {
    return await SELECT(table, params, { condition, orderBy: 'position' })
}

/**
 * @param {object} params
 * @param {string} params.title
 * @param {boolean} params.is_complete
 * @param {number} params.user_id
 * @param {number} params.position
 * @returns {Promise<object>}
 */
async function create(params) {
    return await INSERT(table, params)
}

/**
 * @param {number} id 
 * @param {object} params
 * @param {string} params.title
 * @param {boolean} params.is_complete
 * @param {number} params.user_id
 * @returns {Promise<object>}
 */
async function update(id, params) {
    return await UPDATE(table, id, params)
}

/**
 * @param {number} id 
 * @returns {Promise<object>}
 */
async function remove(id) {
    return await DELETE(table, id)
}

/**
 * @param {object} params
 * @param {number} params.list_id 
 * @returns {Promise<object>}
 */
async function count(params) {
    return await COUNT(table, params)
}

export default {
    getBy,
    create,
    update,
    remove,
    count,
}