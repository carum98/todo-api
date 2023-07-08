import { Todo } from '../services/index.js'

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function get(req, res) {
    const data = await Todo.getBy({ 
        user_id: parseInt(req['user'].id)
    })

    const values = []

    if (Array.isArray(data)) {
        values.push(...data)
    } else if (data) {
        values.push(data)
    }

	return res.status(200).json({ 
        data: values.map(item => item.toJson())
    })
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function getById(req, res) {
    const { id } = req.params
    const data = await Todo.getBy({ id: parseInt(id), user_id: parseInt(req['user'].id) })

    if (data && !Array.isArray(data)) {
        return res.status(200).json(data.toJson())
    } else {
        return res.status(404).json({ message: 'Todo not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function create(req, res) {
    const { title, description, list_id } = req.body

    if (!(title && description && list_id)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const data = await Todo.create({ 
        title, 
        description, 
        user_id: parseInt(req['user'].id),
        list_id: parseInt(list_id),
     })

    if (data) {
        return res.status(201).json(data.toJson())
    } else {
        return res.status(400).json({ message: 'Todo not created' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function update(req, res) {
    const { id } = req.params
    const { title, description, is_complete, user_id, list_id } = req.body

    if (!(title || description || (is_complete !== undefined) || user_id || list_id)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const data = await Todo.update(parseInt(id), { title, description, is_complete, user_id, list_id })

    if (data) {
        return res.status(200).json(data.toJson())
    } else {
        return res.status(404).json({ message: 'Todo not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function remove(req, res) {
    const { id } = req.params
    const data = await Todo.remove(parseInt(id))

    if (data) {
        return res.status(204).json()
    } else {
        return res.status(404).json({ message: 'User not found' })
    }
}

export default {
    get,
    getById,
    create,
    update,
    remove,
}