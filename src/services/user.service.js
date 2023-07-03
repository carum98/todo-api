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
 * @param {object} param
 * @param {number} [param.id]
 * @param {string} [param.name]
 * @param {string} [param.user_name]
 * @param {string} [param.password]
 * @returns {Promise<User[] | User | null>}
 */
async function getBy(param) {
    const data = await Repo.getBy(param)

    if (!data) {
        return null
    }

    if (Array.isArray(data)) {
        return data.map(item => new User(item))
    } else {
        return new User(data)
    }
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

    const user = await getBy({
        id: insertId,
    })

    if (user && !Array.isArray(user)) {
        return user
    } else {
        return null
    }
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
    const user = await getBy({ id })

    if (user && !Array.isArray(user)) {
        const diff = user.valuesDiffFrom({ name, user_name, password })

        await Repo.update({ id, params: diff })
    
        return user.copyWith(diff)
    }

    return null
}

export default {
    getAll,
    getBy,
    create,
    remove,
    update,
}