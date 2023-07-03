import { User } from '../services/index.js'

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function login(req, res) {
    const { user_name, password } = req.body

    if (!(user_name && password)) {
        return res.status(400).json({ message: 'Invalid data' })
    }

    // Check if user exists
    const user = await User.getBy({ user_name })

    if (!user || Array.isArray(user)) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Check if password is correct
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' })
    }

    // Generate token
    const token = user.generateToken()

    return res.status(200).json({ token })
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function register(req, res) {
    const { name, user_name, password } = req.body;

    if (!(name && user_name && password)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    // Check if user already exists
    const user = await User.getBy({ user_name })

    if (user) {
        return res.status(409).json({ message: 'User already exists' })
    }

    // Create user in database
    const data = await User.create({ name, user_name, password })

    if (data) {
        return res.status(201).json(data.toJson())
    }

    return res.status(400).json({ message: 'User not created' })
}

export default {
    login,
    register,
}