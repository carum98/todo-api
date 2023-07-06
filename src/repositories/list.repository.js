import { SELECT, INSERT, UPDATE, DELETE } from '../database/index.js'

const table = 'lists'

/**
 * @param {object} params 
 * @param {number} [params.id]
 * @param {number} [params.user_id]
 * @returns {Promise<object | object[] | null>}
 */
async function getBy(params, condition = 'AND') {
    return await SELECT(table, params, condition)
}

/**
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.color
 * @param {number} params.user_id
 * @returns {Promise<object>}
 */
async function create(params) {
    return await INSERT(table, params)
}

/**
 * @param {number} id
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.color
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

export default {
    getBy,
    create,
    update,
    remove
}