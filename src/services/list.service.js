import { List as Repo } from '../repositories/index.js'
import { List } from '../models/index.js'

/**
 * @param {object} params
 * @param {number} [params.id]
 * @param {number} [params.user_id]
 * @returns {Promise<List[] | List | null>}
 */
async function getBy(params) {
    const data = await Repo.getBy(params)

    if (!data) {
        return null
    }

    if (Array.isArray(data)) {
        return data.map(item => new List(item))
    } else {
        return new List(data)
    }
}

/**
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.color
 * @param {number} params.user_id
 * @returns {Promise<List | null>}
 */
async function create(params) {
    const { insertId } = await Repo.create(params)

    const list = await getBy({
        id: insertId,
    })

    if (list && !Array.isArray(list)) {
        return list
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
 * @param {number} id
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.color
 * @param {number} params.user_id
 * @returns {Promise<List | null>}
 */
async function update(id, params) {
    const list = await getBy({ id })

    if (list && !Array.isArray(list)) {
        const diff = list.valuesDiffFrom(params)

        await Repo.update(id, diff)

        return list.copyWith(diff)
    }

    return null
}

export default {
    getBy,
    create,
    remove,
    update,
}