import { User } from '../services/index.js'

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * @param {Request} _ 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function get(_, res) {
    const data = await User.getAll()

	return res.status(200).json({ 
        data: data.map(item => item.toJson())
    })
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function getById(req, res) {
    const { id } = req.params
    const data = await User.getBy({ id: parseInt(id) })

    if (data && !Array.isArray(data)) {
        return res.status(200).json(data.toJson())
    } else {
        return res.status(404).json({ message: 'User not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function create(req, res) {
    const { name, user_name, password } = req.body
    const data = await User.create({ name, user_name, password })

    if (data) {
        return res.status(201).json(data.toJson())
    } else {
        return res.status(400).json({ message: 'User not created' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function remove(req, res) {
    const { id } = req.params
    const data = await User.remove(parseInt(id))

    if (data) {
        return res.status(204).json()
    } else {
        return res.status(404).json({ message: 'User not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function update(req, res) {
    const { id } = req.params

    const { name, user_name, password } = req.body
    const user = await User.update({ id: parseInt(id), name, user_name, password })

    if (user) {
        return res.status(200).json(user.toJson())
    } else {
        return res.status(404).json({ message: 'User not found' })
    }
}

export default {
    get,
    getById,
    create,
    remove,
    update,
}
