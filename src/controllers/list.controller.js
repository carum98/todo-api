import { List } from '../services/index.js'

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
    const data = await List.getBy({ 
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
    const data = await List.getBy({ id: parseInt(id), user_id: parseInt(req['user'].id) })

    if (data && !Array.isArray(data)) {
        return res.status(200).json(data.toJson())
    } else {
        return res.status(404).json({ message: 'List not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function create(req, res) {
    const { name, color } = req.body

    if (!(name && color)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const data = await List.create({ 
        name, 
        color, 
        user_id: parseInt(req['user'].id)
     })

    if (data) {
        return res.status(201).json(data.toJson())
    } else {
        return res.status(400).json({ message: 'List not created' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function update(req, res) {
    const { id } = req.params
    const { name, color } = req.body

    if (!(name || color)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const data = await List.update(parseInt(id), { name, color, user_id: parseInt(req['user'].id) })

    if (data) {
        return res.status(200).json(data.toJson())
    } else {
        return res.status(404).json({ message: 'List not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function remove(req, res) {
    const { id } = req.params
    const data = await List.remove(parseInt(id))

    if (data) {
        return res.status(204).json()
    } else {
        return res.status(404).json({ message: 'List not found' })
    }
}

export default {
    get,
    getById,
    create,
    update,
    remove,
}