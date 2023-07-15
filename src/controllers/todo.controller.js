import { Todo, List } from '../services/index.js'

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
    const { title, list_id } = req.body

    if (!(title && list_id)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const user_id_number = parseInt(req['user'].id)
    const list_id_number = parseInt(list_id)

    const list = await List.getBy({ 
        id: list_id_number, 
        user_id: user_id_number 
    })

    if (!list) {
        return res.status(404).json({ message: 'List not found' })
    }

    const data = await Todo.create({ 
        title, 
        user_id: user_id_number,
        list_id: list_id_number,
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
    const { title, is_complete, user_id, list_id } = req.body

    const params = {
        title, 
        is_complete, 
        user_id, 
        list_id
    }

    if (!(title || (is_complete !== undefined) || user_id || list_id)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const data = await Todo.update(parseInt(id), params)

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

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function complete(req, res) {
    const { id } = req.params
    const data = await Todo.update(parseInt(id), { is_complete: true })

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
async function toggle(req, res) {
    const { id } = req.params
    const data = await Todo.getBy({ id: parseInt(id) })

    if (data && !Array.isArray(data)) {
        const is_complete = !data.is_complete
        const updated = await Todo.update(parseInt(id), { is_complete })

        if (updated) {
            return res.status(200).json(updated.toJson())
        } else {
            return res.status(400).json({ message: 'Todo not updated' })
        }
    } else {
        return res.status(404).json({ message: 'Todo not found' })
    }
}

/**
 * @param {Request} req
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function move(req, res) {
    const { id } = req.params
    const { position } = req.body

    if (!position) {
        return res.status(400).json({ message: 'Invalid data' })
    }

    const data = await Todo.getBy({ id: parseInt(id) })

    if (data === null || Array.isArray(data)) {
        return res.status(404).json({ message: 'Todo not found' })
    }

    const todos = await Todo.getBy({ list_id: data.list_id })

    if (todos === null || !Array.isArray(todos)) {
        return res.status(404).json({ message: 'Todos not found' })
    }

    // Check if the position is valid
    if (position < 1 || position > todos.length) {
        return res.status(400).json({ message: 'Invalid position' })
    }

    // Move into the array to the new position
    todos.splice(position - 1, 0, todos.splice(data.position - 1, 1)[0])

    // Update the position of each todo
    await Promise.all(todos.map((item, index) => Todo.update(item.id, { position: index + 1 })))

    return res.status(200).json({ message: 'Todos updated' })
}

export default {
    get,
    getById,
    create,
    update,
    remove,
    complete,
    toggle,
    move,
}