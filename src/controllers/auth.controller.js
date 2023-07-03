import { User, Token, RefreshToken } from '../services/index.js'
import bcrypt from 'bcrypt'

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
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid password' })
    }

    // Generate token
    return res.status(200).json({ 
        ...Token.generate(user)
    })
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
    if (await User.alreadyExists({ user_name })) {
        return res.status(409).json({ message: 'User already exists' })
    }

    // Create user in database
    const user = await User.create({ name, user_name, password })

    if (user) {
        return res.status(200).json({ 
            ...Token.generate(user)
        })
    }

    return res.status(400).json({ message: 'User not created' })
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function refreshToken(req, res) {
    const { refresh } = req.body

    if (!refresh) {
        return res.status(400).json({ message: 'Invalid data' })
    }

    const refreshInstance = await RefreshToken.getBy({ token: refresh })

    if (refreshInstance === null) {
        return res.status(404).json({ message: 'Refresh token not found' })
    }

    try {
        const decoded = Token.verifyRefreshToken(refreshInstance.token)

        const user = await User.getBy({
            user_name: decoded['user_name']
        })

        if (user && !Array.isArray(user)) {
            return res.status(200).json({ 
                ...Token.generate(user)
            })
        }

        return res.status(404).json({ message: 'User not found' })
    } catch (error) {
        await RefreshToken.remove(refreshInstance.id)

        return res.status(401).json({ message: 'Invalid refresh token' })
    }
}

export default {
    login,
    register,
    refreshToken
}