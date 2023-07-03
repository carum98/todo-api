import jwt from 'jsonwebtoken'
import { User, Token } from '../services/index.js'

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next
 */
export async function AuthMiddleware(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Token not found'
        })
    }

    try {
        const decoded = Token.verify(token)

        const user = await User.getBy({
            user_name: decoded['user_name']
        })

        if (user === null) {
            return res.status(401).json({
                message: 'User not found'
            })
        }

        req['user'] = user

        next()
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}