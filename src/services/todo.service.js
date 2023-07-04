import { Todo as Repo } from '../repositories/index.js'
import { Todo } from '../models/index.js'

/**
 * @param {object} params
 * @param {number} [params.id]
 * @param {number} [params.user_id]
 * @param {boolean} [params.is_complete]
 * @returns {Promise<Todo[] | Todo | null>}
 */
async function getBy(params) {
    const data = await Repo.getBy(params)

    if (!data) {
        return null
    }

    if (Array.isArray(data)) {
        return data.map(item => new Todo(item))
    } else {
        return new Todo(data)
    }
}

/**
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {number} params.user_id
 * @returns {Promise<Todo | null>}
 */
async function create(params) {
    const { insertId } = await Repo.create({
        ...params,
        is_complete: false,
    })

    const todo = await getBy({
        id: insertId,
    })

    if (todo && !Array.isArray(todo)) {
        return todo
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
 * @param {string} params.title
 * @param {string} params.description
 * @param {boolean} params.is_complete
 * @param {number} params.user_id
 * @returns {Promise<Todo | null>}
 */
async function update(id, params) {
    const todo = await getBy({ id })

    if (todo && !Array.isArray(todo)) {
        const diff = todo.valuesDiffFrom(params)

        await Repo.update(id, diff )
    
        return todo.copyWith(diff)
    }

    return null
}

export default {
    getBy,
    create,
    remove,
    update,
}