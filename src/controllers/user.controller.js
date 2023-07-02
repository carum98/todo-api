import { User } from '../services/index.js'

async function get(req, res) {
    const data = await User.getAll()

	return res.status(200).json({ data })
}

async function getById(req, res) {
    const { id } = req.params
    const data = await User.getById(id)

    return res.status(200).json({ data })
}

async function create(req, res) {
    const { name, user_name, password } = req.body
    await User.create({ name, user_name, password })

    return res.status(201)
}

async function remove(req, res) {
    const { id } = req.params
    await User.remove(id)

    return res.status(204)
}

async function update(req, res) {
    const { id } = req.params

    const { name, user_name, password } = req.body
    await User.update({ id, name, user_name, password })

    return res.status(204)
}

export default {
    get,
    getById,
    create,
    remove,
    update,
}
