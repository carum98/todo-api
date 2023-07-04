import { SELECT, INSERT, UPDATE, DELETE } from '../database/index.js'

const table = 'users'

/**
 * @returns {Promise<object[]>}
 */
async function getAll() {
    return await SELECT(table)
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
    return await SELECT(table, params, condition)
}

/**
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.user_name
 * @param {string} params.password
 * @returns {Promise<object>}
 */
async function create(params) {
    return await INSERT(table, params)
}

/**
 * @param {number} id
 * @returns {Promise<object>}
 */
async function remove(id) {
    return await DELETE(table, id)
}

/**
 * @param {object} param
 * @param {number} param.id
 * @param {{ name: string?, user_name: string?, password: string? }} param.params
 * @returns {Promise<object>}
 */
async function update({ id, params }) {
    return await UPDATE(table, id, params)
}

export default {
    getAll,
    getBy,
    create,
    remove,
    update,
}