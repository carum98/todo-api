import { User as Repo } from '../repositories/index.js'
import { User } from '../models/index.js'

async function getAll() {
    const data = await Repo.getAll()

    return data.map(item => new User(item))
}

async function getById(id) {
    const data = await Repo.getById(id)

    return new User(data)
}

async function create({ name, user_name, password }) {
    await Repo.create({ name, user_name, password })
}

async function remove(id) {
    await Repo.remove(id)
}

async function update({ id, name, user_name, password }) {
    await Repo.update({ id, name, user_name, password })
}

export default {
    getAll,
    getById,
    create,
    remove,
    update,
}