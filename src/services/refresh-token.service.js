import { RefreshToken as Repo } from '../repositories/index.js'
import { RefreshToken } from '../models/index.js'

/**
 * @param {object} param 
 * @param {number} [param.id]
 * @param {string} [param.token]
 * @param {number} [param.user_id]
 * @returns {Promise<RefreshToken | null>}
 */
async function getBy(param) {
    const data = await Repo.getBy(param)

    if (!data) {
        return null
    }

    return new RefreshToken(data)
}

/**
 * @param {object} param
 * @param {string} param.token
 * @param {number} param.user_id
 * @returns {Promise<RefreshToken | null>}
 */
async function create({ token, user_id }) {
    const { insertId } = await Repo.create({ token, user_id })

    const refreshToken = await getBy({
        id: insertId,
    })

    if (refreshToken) {
        return refreshToken
    } else {
        return null
    }
}

/**
 * @param {object} param
 * @param {number} param.id
 * @param {string} param.token
 * @returns 
 */
async function update({ id, token }) {
    const data = await getBy({ id })

    if (data) {
        await Repo.update({ id, params: { token } })
    
        return data.copyWith({ token })
    }

    return null
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
 * @param {object} param
 * @param {string} param.token
 * @param {number} param.user_id
 * @returns {Promise<RefreshToken | null>}
 */
async function upsert({ token, user_id }) {
    const data = await getBy({ user_id })

    if (data) {
        return update({ id: data.id, token })
    } else {
        return create({ token, user_id })
    }
}

export default {
    getBy,
    create,
    remove,
    update,
    upsert,
}