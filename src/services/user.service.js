import { User as Repo } from '../repositories/index.js'
import { User } from '../models/index.js'

/**
 * @returns {Promise<User[]>}
 */
async function getAll() {
    const data = await Repo.getAll()

    return data.map(item => new User(item))
}

/**
 * @param {number} id
 * @returns {Promise<User | null>}
 */
async function getById(id) {
    const data = await Repo.getById(id)

    if (!data) {
        return null
    }

    return new User(data)
}

/**
 * @param {Object} param
 * @param {string} param.name
 * @param {string} param.user_name
 * @param {string} param.password
 * @returns {Promise<User | null>}
 */
async function create({ name, user_name, password }) {
    const { insertId } = await Repo.create({ name, user_name, password })

    return getById(insertId)
}

/**
 * @param {number} id
 * @returns {Promise<boolean>}
 */
async function remove(id) {
    const { affectedRows } = await Repo.remove(id)

    return affectedRows > 0
}

/**
 * @param {Object} param
 * @param {number} param.id
 * @param {string} param.name
 * @param {string} param.user_name
 * @param {string} param.password
 * @returns {Promise<User | null>}
 */
async function update({ id, name, user_name, password }) {
    const user = await getById(id)

    if (!user) {
        return null
    }

    const diff = user.valuesDiffFrom({ name, user_name, password })

    await Repo.update({ id, params: diff })

    return user.copyWith(diff)
}

export default {
    getAll,
    getById,
    create,
    remove,
    update,
}